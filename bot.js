require('dotenv').config()

const { CeiraClient } = require('./client')
const { config } = require('./config')

const idioma = require('./adm/data/idioma')
const database = require("./adm/database/database")

let client = new CeiraClient()
config(client) // Atualiza os comandos slash do bot

client.discord.once('ready', async () => {

	// Definindo o idioma do bot
	idioma.setDefault('pt-br')

	client.owners = process.env.owner_id.split(", ")

	await require('./adm/eventos/status.js')({ client })

	// Eventos secundários
	require('./adm/eventos/events.js')({ client })

	console.log(`Caldeiras do(a) ${client.user().username} aquecidas, pronto para operar`)
})

client.discord.on('messageCreate', async (message) => {

	if (message.author.bot || message.webhookId) return

	let text = message.content.toLowerCase()

	// Respostas automatizadas por IA
	if (text.includes(client.id()) || text.includes("alonsal")) {
		await require('./adm/eventos/conversacao.js')({ client, message, text })
		return
	}

	try { // Atualizando o XP dos usuários
		const caso = 'messages'
		if (message.content.length > 6 && client.x.ranking) await require('./adm/data/ranking.js')({ client, message, caso })

		require('./adm/eventos/comandos_antigos.js')({ client, message })
	} catch (err) { // Erro no comando
		const local = 'commands'
		require('./adm/eventos/error.js')({ client, err, local })
	}
})

client.discord.on('interactionCreate', async interaction => {

	const user = await client.getUser(interaction.user.id)

	if (interaction.isSelectMenu()) // Interações geradas no uso de menus de seleção
		return require('./adm/interacoes/menus.js')({ client, user, interaction })

	if (interaction.isButton()) // Interações geradas no uso de botões
		return require('./adm/interacoes/buttons.js')({ client, user, interaction })

	if (!interaction.isChatInputCommand()) return
	if (!interaction.guild) return client.tls.reply(user, "inic.error.comando_dm")

	const command = client.discord.commands.get(interaction.commandName)
	if (!command) return

	await command.execute(client, user, interaction)
		.then(() => {
			require('./adm/eventos/log.js')({ client, interaction, command })
		})
		.catch(err => {
			require('./adm/eventos/error.js')({ client, err })
			client.tls.reply(interaction, user, "inic.error.epic_embed_fail", true, 0)
		})
})

database.setup(process.env.dburi)
client.login(client.x.token)