require('dotenv').config()

const { CeiraClient } = require('./client')
const { slash_commands } = require('./commands')
const { internal_functions } = require('./functions')

const idioma = require('./adm/data/idioma')
const database = require('./adm/database/database')

let client = new CeiraClient()
internal_functions(client) // Registra as funções internas do bot
slash_commands(client) // Atualiza os comandos slash do bot

client.discord.once("ready", async () => {

	console.log("🟠 | Executando etapas finais")

	// Definindo o idioma do bot
	idioma.setDefault("pt-br")
	client.owners = process.env.owner_id.split(", ")

	// Eventos secundários
	await require("./adm/eventos/events")({ client })
	await require("./adm/eventos/status.js")({ client })
	await require("./adm/automaticos/modulo")({ client })

	console.log(`🟢 | Caldeiras do(a) ${client.user().username} aquecidas, pronto para operar`)
	console.log(`⏱️  | Tempo de inicialização: ${client.timestamp() - client.x.timestamp > 1 ? `${client.timestamp() - client.x.timestamp} segundos` : '1 segundo'}`)
})

client.discord.on("messageCreate", async (message) => {

	// Previne que o bot responda a interações enquanto estiver atualizando comandos
	if (client.x.force_update) return

	const user = await client.getUser(message.author.id)
	const guild = await client.getGuild(message.guild.id)

	// Ignorando usuários
	if (user.conf?.banned || false) return
	if (message.author.bot || message.webhookId) return

	let text = message.content.toLowerCase()

	// Recursos de Broadcast
	const bot = await client.getBot(client.id())

	if (bot?.transmission.status)
		require("./adm/eventos/broadcast.js")({ client, bot, message })

	// Respostas automatizadas por IA
	if ((text.includes(client.id()) || text.includes("alonsal")) && client.decider(guild.conf?.conversation, 1)) {
		await require("./adm/eventos/conversacao.js")({ client, message, text })
		return
	}

	try { // Atualizando o XP dos usuários
		const caso = "messages"
		if (message.content.length > 6 && client.x.ranking) await require("./adm/data/ranking.js")({ client, message, caso })

		require("./adm/eventos/comandos_antigos")({ client, message })
	} catch (err) { // Erro no comando
		const local = "commands"
		require("./adm/eventos/error.js")({ client, err, local })
	}
})

client.discord.on("interactionCreate", async interaction => {

	// Previne que o bot responda a interações enquanto estiver atualizando comandos
	if (client.x.force_update) return

	const user = await client.getUser(interaction.user.id)

	// Ignorando usuários
	if (user.conf?.banned || false) return

	client.update_tasks(interaction)

	if (interaction.isStringSelectMenu()) // Interações geradas no uso de menus de seleção
		return require("./adm/interacoes/menus.js")({ client, user, interaction })

	if (interaction.isButton()) // Interações geradas no uso de botões
		return require("./adm/interacoes/buttons.js")({ client, user, interaction })

	if (!interaction.isChatInputCommand()) return
	if (!interaction.guild) return client.tls.reply(interaction, user, "inic.error.comando_dm")

	const command = client.discord.commands.get(interaction.commandName)
	if (!command) return

	// Executando o comando
	command.execute(client, user, interaction)
		.then(() => {
			require("./adm/eventos/log.js")({ client, interaction, command })
		})
		.catch(err => {
			require("./adm/eventos/error.js")({ client, err })
			client.tls.reply(interaction, user, "inic.error.epic_embed_fail", true, 0)
		})
})

database.setup(process.env.url_dburi)
client.login(client.x.token)