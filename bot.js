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
internal_functions(client) // Registra as funções internas do bot
slash_commands(client) // Atualiza os comandos slash do bot

client.discord.once("ready", async () => {

	console.log("🟠 | Executando etapas finais")

	// Definindo o idioma do bot
	idioma.setDefault("pt-br")
	client.owners = process.env.owner_id.split(", ")

	// Eventos secundários
	await require("./core/auto/clock")({ client })
	await require("./core/events/events")({ client })
	await require("./core/events/status")({ client })

	console.log(`🟢 | Caldeiras do(a) ${client.username()} aquecidas, pronto para operar`)
	console.log(`⏱️  | Tempo de inicialização: ${client.timestamp() - client.cached.timestamp > 1 ? `${client.timestamp() - client.cached.timestamp} segundos` : '1 segundo'}`)
})

client.discord.on("messageCreate", async message => {

	// Prevents the bot from responding to interactions while updating commands
	if (client.x.force_update) return

	// Prevents the bot from interacting with other members when in develop mode
	if (!process.env.owner_id.includes(message.author.id) && client.x.modo_develop) return

	const user = await checkUser(message.author.id)
	const guild = await client.getGuild(message.guild.id)
	const text = `${message.content} `

	if (guild.spam.suspicious_links) // Checking the text for a malicious link
		if (text.match(client.cached.regex)) {

			let link = text.match(client.cached.regex)

			if (link)
				if (await verifySuspiciousLink(link))
					return nerfa_spam({ client, message, guild })
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

		// Broadcast Resources
		if (client.cached.broad_status)
			await require("./core/events/broadcast")({ client, message })

		// AI-automated responses
		// if ((text.includes(client.id()) || text.toLowerCase().includes("alon")) && client.decider(guild.conf?.conversation, 1))
		// return require("./core/events/conversation")({ client, message, text, guild })

		// Checking whether the text starts with a classic prefix
		require("./core/events/legacy_commands")({ client, message })
	}
})

client.discord.on("interactionCreate", async interaction => {

	// Previne que o bot responda a interações enquanto estiver atualizando comandos
	if (client.x.force_update) return

	const user = await client.getUser(interaction.user.id)

	// Impede o bot de interagir com outros membros quando está no modo develop
	if (!process.env.owner_id.includes(interaction.user.id) && client.x.modo_develop)
		return client.tls.reply(interaction, user, "inic.inicio.testes", true, 60)

	if (user.conf?.banned || false) return // Ignorando usuários

	// Verificando se é um comando usado num servidor
	if (!interaction.guild) return client.tls.reply(interaction, user, "inic.error.comando_dm")

	if (interaction.isStringSelectMenu()) // Interações geradas no uso de menus de seleção
		return require("./core/interactions/menus")({ client, user, interaction })

	if (interaction.isButton()) // Interações geradas no uso de botões
		return require("./core/interactions/buttons")({ client, user, interaction })

	if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return

	// Define o idioma do usuário automaticamente caso não tenha um idioma padrão
	await client.verifyUserLanguage(user, interaction.guild.id)

	const command = client.discord.commands.get(interaction.commandName.toLowerCase())

	// Removendo marcações para exclusão do usuário
	if (user.erase.valid) {
		user.erase.forced = false
		await user.save()
	}

	if (!command) return
	const action = interaction.isContextMenuCommand() ? command.menu : command.execute

	try {
		// Executando o comando
		await action({ client, user, interaction })
		await require("./core/events/log")({ client, interaction, command })

		// Atualizando a ultima interação
		client.cached.last_interaction = client.timestamp()
	} catch (err) {
		await client.error(err, "Slash Command")
		client.tls.reply(interaction, user, "inic.error.epic_embed_fail", true, client.emoji(0))
	}
})

database.setup(process.env.url_dburi)
client.login(client.x.token)