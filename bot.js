const { CeiraClient } = require('./client')
const { slash_commands } = require('./commands')
const { internal_functions } = require('./functions')

const idioma = require('./core/data/language')
const database = require('./core/database/database')

const { nerfa_spam } = require('./core/events/spam')
const { checkUser } = require('./core/database/schemas/User')
const { getUserRankServer } = require('./core/database/schemas/Rank_s')
const { verifySuspiciousLink } = require('./core/database/schemas/Spam_link')

let client = new CeiraClient()
internal_functions(client) // Registers the internal functions
slash_commands(client) // Updates the slash commands

client.discord.once("ready", async () => {

	console.log("🟠 | Executando etapas finais")

	// Setting the default language
	idioma.setDefault("pt-br")

	// Secondary events
	await require("./core/auto/clock")({ client })
	await require("./core/events/events")({ client })
	await require("./core/events/status")({ client })

	console.log(`🟢 | Caldeiras do(a) ${client.username()} aquecidas, pronto para operar`)
	console.log(`⏱️  | Tempo de inicialização: ${client.timestamp() - client.cached.timestamp > 1 ? `${client.timestamp() - client.cached.timestamp} segundos` : '1 segundo'}`)
})

client.discord.on("messageCreate", async message => {

	// Prevents the bot from interacting with other members when in develop mode or updating commands
	if ((!process.env.owner_id.includes(message.author.id) && client.x.modo_develop) || client.x.force_update) return

	const user = await checkUser(message.author.id)
	const guild = await client.getGuild(message.guild.id)

	if (guild.spam.suspicious_links) { // Checking the text for a malicious link

		const link = `${message.content} `.match(client.cached.regex)

		if (link)
			if (await verifySuspiciousLink(link)) return nerfa_spam({ client, message, guild })
	}

	if (guild.conf.spam) // Server anti-spam system
		await require("./core/events/spam")({ client, message, guild })

	// Checking if the author is a bot or a webhook
	if (message.author.bot || message.webhookId) return

	if (user) { // It only runs if the member is saved in the database

		let user_rank_guild = await getUserRankServer(user.uid, message.guild.id)

		// Ignoring banned users and those moved to data deletion
		if (user.conf?.banned || user.erase.valid || user_rank_guild.erase.valid) return

		// Syncing user data
		const user_guild = await client.getMemberGuild(message, user.uid)
		if (!user.profile.avatar || user.profile.avatar !== user_guild.user.avatarURL({ dynamic: true })) {
			user.profile.avatar = user_guild.user.avatarURL({ dynamic: true })
			await user.save()
		}

		// Updating users' XP
		if (client.x.ranking) // Experience received by the user
			client.registryExperience(message, "messages")
	}
})

client.discord.on("interactionCreate", async interaction => {

	// Prevents the bot from responding to interactions while updating commands
	if (client.x.force_update) return

	const user = await client.getUser(interaction.user.id)

	// Prevents the bot from interacting with other members when in develop mode
	if (!process.env.owner_id.includes(interaction.user.id) && client.x.modo_develop)
		return client.tls.reply(interaction, user, "inic.inicio.testes", true, 60)

	if (user.conf?.banned || false) return // Ignoring users

	// Checking if it is a command used on a server
	if (!interaction.guild) return client.tls.reply(interaction, user, "inic.error.comando_dm")

	if (interaction.isStringSelectMenu()) // Interactions generated when using selection menus
		return require("./core/interactions/menus")({ client, user, interaction })

	if (interaction.isButton()) // Interactions generated when using buttons
		return require("./core/interactions/buttons")({ client, user, interaction })

	if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return

	// Automatically sets the user's language if they don't have a default language
	if (!user.lang) await client.verifyUserLanguage(user, interaction.guild.id)

	const command = client.discord.commands.get(interaction.commandName.toLowerCase())

	// Removing the user data deletion label
	if (user.erase.valid) {
		user.erase.forced = false
		await user.save()
	}

	if (!command) return
	const action = interaction.isContextMenuCommand() ? command.menu : command.execute

	try {
		// Executing the command
		await action({ client, user, interaction })
		await require("./core/events/log")({ client, interaction, command })

		// Updating the last interaction
		client.cached.last_interaction = client.timestamp()
	} catch (err) {
		await client.error(err, "Slash Command")
		client.tls.reply(interaction, user, "inic.error.epic_embed_fail", true, client.emoji(0))
	}
})

database.setup(process.env.url_dburi)
client.login(client.x.token)