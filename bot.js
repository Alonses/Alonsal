require('dotenv').config()

const { CeiraClient } = require('./client')
const { slash_commands } = require('./commands')
const { internal_functions } = require('./functions')

const idioma = require('./core/data/language')
const database = require('./core/database/database')

let client = new CeiraClient()
internal_functions(client) // Registra as funções internas do bot
slash_commands(client) // Atualiza os comandos slash do bot

client.discord.once("ready", async () => {

	console.log("🟠 | Executando etapas finais")

	// Definindo o idioma do bot
	idioma.setDefault("pt-br")
	client.owners = process.env.owner_id.split(", ")

	// Eventos secundários
	await require("./core/events/events")({ client })
	await require("./core/events/status")({ client })
	await require("./core/auto/module")({ client })

	console.log(`🟢 | Caldeiras do(a) ${client.user().username} aquecidas, pronto para operar`)
	console.log(`⏱️ | Tempo de inicialização: ${client.timestamp() - client.x.timestamp > 1 ? `${client.timestamp() - client.x.timestamp} segundos` : '1 segundo'}`)
})

client.discord.on("messageCreate", async (message) => {

	// Previne que o bot responda a interações enquanto estiver atualizando comandos
	if (client.x.force_update) return

	const user = await client.getUser(message.author.id)
	const guild = await client.getGuild(message.guild.id)
	const user_guild = await client.getMemberGuild(message, user.uid)

	// Define o idioma do usuário automaticamente caso não tenha um idioma padrão
	if (!user.lang) {
		user.lang = guild.lang || "pt-br"
		await user.save()
	}

	// Ignorando usuários
	if (user.conf?.banned || false) return
	if (message.author.bot || message.webhookId) return

	let text = message.content.toLowerCase()

	// Sincronizando os dados do usuário
	if (!user.profile.avatar || user.profile.avatar !== user_guild.user.avatarURL({ dynamic: true })) {
		user.profile.avatar = user_guild.user.avatarURL({ dynamic: true })
		await user.save()
	}

	// Recursos de Broadcast
	const bot = await client.getBot()

	if (bot?.transmission.status)
		require("./core/events/broadcast.js")({ client, bot, message })

	// Respostas automatizadas por IA
	if ((text.includes(client.id()) || text.includes("alonsal")) && client.decider(guild.conf?.conversation, 1))
		return await require("./core/events/conversacao.js")({ client, message, text })

	try { // Atualizando o XP dos usuários
		const caso = "messages"

		if (guild.conf.spam) // Sistema anti-spam do servidor
			require("./core/events/spam.js")({ client, message, user, guild })

		if (message.content.length > 6 && client.x.ranking) await require("./core/data/ranking.js")({ client, message, caso })

		require("./core/events/legacy_commands")({ client, message })
	} catch (err) { // Erro no comando
		const local = "commands"
		client.error({ err, local })
	}
})

client.discord.on("interactionCreate", async interaction => {

	// Previne que o bot responda a interações enquanto estiver atualizando comandos
	if (client.x.force_update) return

	const user = await client.getUser(interaction.user.id)
	// Ignorando usuários
	if (user.conf?.banned || false) return

	const guild = await client.getGuild(interaction.guild.id)

	// Define o idioma do usuário automaticamente caso não tenha um idioma padrão
	if (!user.lang) {
		user.lang = guild.lang || "pt-br"
		await user.save()
	}

	// Atualiza o formato de salvamento das tasks
	client.update_tasks(interaction)

	if (interaction.isStringSelectMenu()) // Interações geradas no uso de menus de seleção
		return require("./core/interactions/menus.js")({ client, user, interaction })

	if (interaction.isButton()) // Interações geradas no uso de botões
		return require("./core/interactions/buttons.js")({ client, user, interaction })

	if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return
	if (!interaction.guild) return client.tls.reply(interaction, user, "inic.error.comando_dm")

	const command = client.discord.commands.get(interaction.commandName.toLowerCase())

	if (!command) return
	const action = interaction.isContextMenuCommand() ? command.menu : command.execute;

	try {
		// Executando o comando
		action(client, user, interaction)
			.then(() => {
				require("./core/events/log.js")({ client, interaction, command })
			})
	} catch (err) {
		client.error({ err })
		client.tls.reply(interaction, user, "inic.error.epic_embed_fail", true, client.emoji(0))
	}
})

database.setup(process.env.url_dburi)
client.login(client.x.token)