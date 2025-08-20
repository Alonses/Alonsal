const { PermissionsBitField } = require('discord.js')

const { CeiraClient } = require('./client')
const { slash_commands } = require('./commands')
const { internal_functions } = require('./functions')

const idioma = require('./core/data/language')
const database = require('./core/database/database')

const { nerfa_spam } = require('./core/events/spam')
const { getBot } = require('./core/database/schemas/Bot')
const { checkUser } = require('./core/database/schemas/User')
const { getUserRankServer } = require('./core/database/schemas/User_rank_guild')
const { verifySuspiciousLink } = require('./core/database/schemas/Spam_links')
const { verifica_chute } = require('./commands/games/forca')

let client = new CeiraClient()
internal_functions(client) // Registers the internal functions
slash_commands(client) // Updates the slash commands

client.discord.once("ready", async () => {

	console.log("🟠 | Executando etapas finais")

	// Setting the default language and value for ranking
	idioma.setDefault("pt-br")
	client.cached.ranking_value = (await getBot(client.id())).persis.ranking || 5

	// Secondary events
	await require("./core/auto/clock")({ client })
	await require("./core/events/events")({ client })
	await require("./core/events/status")({ client })

	// Pre-saving ranked guilds on cache
	client.updateRankedGuilds()

	console.log(`🟢 | Caldeiras do(a) ${client.username()} aquecidas, pronto para operar`)
	console.log(`⏱️  | Tempo de inicialização: ${client.timestamp() - client.cached.timestamp > 1 ? `${client.timestamp() - client.cached.timestamp} segundos` : '1 segundo'}`)
})

client.discord.on("messageCreate", async message => {

	// Checking if the author is a bot or a webhook
	if (message.author.bot || message.webhookId) return

	// Prevents the bot from interacting with other members when in develop mode or updating commands
	if ((!process.env.owner_id.includes(message.author.id) && client.x.modo_develop) || client.x.force_update) return

	const user = await checkUser(client.encrypt(message.author.id))
	const guild = await client.getGuild(message.guild.id)

	// Jogo da forca com letras/palavras enviadas no chat
	if (client.cached.forca_sessao.has(client.encrypt(message.author.id))) {
		const jogo = client.cached.forca_sessao.get(client.encrypt(message.author.id)).id_game

		verifica_chute(client, message, (message.content).toLowerCase(), jogo, user)
	}

	// Responding to the user who just ping the bot
	if (message.content.includes(client.id()) && message.content.length === 21)
		if (await client.permissions(null, client.id(), [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], message))
			return message.reply({
				content: client.tls.phrase(user, "inic.inicio.apresentacao", client.emoji("emojis_dancantes")),
				components: [client.create_buttons([{ name: { tls: "inic.inicio.convidar" }, type: 4, emoji: client.emoji("mc_coracao"), value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=2550136990` }], message, user)]
			}).catch(console.error)

	if (guild.spam.suspicious_links) { // Checking the text for a malicious link

		const link = `${message.content} `.match(client.cached.regex)

		if (link)
			if (await verifySuspiciousLink(link)) {
				const suspect_link = true
				return nerfa_spam({ client, message, guild, suspect_link })
			}
	}

	if (guild.conf.spam) // Server anti-spam system
		await require("./core/events/spam")({ client, message, guild })

	if (user) { // It only runs if the member is saved in the database

		let user_rank_guild = await getUserRankServer(user.uid, client.encrypt(message.guild.id))

		// Ignoring banned users and those moved to data deletion
		if (!user_rank_guild || user.conf?.banned || user.erase.valid || user_rank_guild.erase.valid) return

		// Syncing user data
		if (!user.profile.avatar || !user.profile.avatar?.includes(message.author.avatar)) {

			const user_guild = await client.getMemberGuild(message, message.author.id)

			if (user_guild?.user) {
				user.profile.avatar = client.encrypt(user_guild.user.avatarURL({ dynamic: true }))

				await user.save()
			}
		}

		if (!user.nick) {
			user.nick = client.encrypt(message.author.username)
			await user.save()
		}

		// Updating users' XP, experience received by the user
		client.registryExperience(message, "messages")
	}
})

client.discord.on("interactionCreate", async interaction => {

	// Prevents the bot from responding to interactions while updating commands
	if (client.x.force_update) return

	const user = await client.getUser(interaction.user.id)

	// Atualiza o tempo de inatividade do servidor
	if (interaction.guild) client.updateGuildIddleTimestamp(interaction.guild.id)

	// Prevents the bot from interacting with other members when in develop mode
	if (!process.env.owner_id.includes(interaction.user.id) && client.x.modo_develop)
		return client.tls.reply(interaction, user, "inic.error.testes", true, 60)

	if (user.conf?.banned || false) return // Ignoring users

	if (interaction.isStringSelectMenu() || interaction.isUserSelectMenu()) // Interactions generated when using selection menus
		return require("./core/interactions/menus")({ client, user, interaction })

	if (interaction.isButton()) // Interactions generated when using buttons
		return require("./core/interactions/buttons")({ client, user, interaction })

	if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return

	// Automatically sets the user's language if they don't have a default language
	if (!user.lang && interaction.guild) await client.verifyUserLanguage(user, interaction.guild.id)

	const command = client.discord.commands.get(interaction.commandName.toLowerCase())

	// Removing the user data deletion label
	if (user.erase.valid) {
		user.erase.forced = false
		await user.save()
	}

	if (!user.nick) {
		user.nick = client.encrypt(interaction.user.username)
		await user.save()
	}

	if (!command) return
	const action = interaction.isContextMenuCommand() ? command.menu : command.execute

	try {

		// Verificando se o comando é originado de um servidor ou DM
		const user_command = interaction.guild ? false : true

		// Executing the command
		await action({ client, user, interaction, user_command })
		await require("./core/events/log")({ client, interaction })

		// Updating the last interaction
		client.cached.last_interaction = client.timestamp()
	} catch (err) {
		await client.error(err, "Slash Command")
		client.tls.reply(interaction, user, "inic.error.epic_embed_fail", true, client.emoji(0))
	}
})

// Conectando ao banco de dados
database.setup(process.env.url_dburi)
client.login(client.x.token)