require('dotenv').config()
const { readdirSync } = require('fs')
const { Routes } = require('discord.js')
const user = require('./adm/data/usuario')
const bot = require('./adm/data/relatorio')
const idioma = require('./adm/data/idioma')

const cleverbot = require('cleverbot-free')
const { REST } = require('@discordjs/rest')
const { Client, Collection, GatewayIntentBits, IntentsBitField } = require('discord.js')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		IntentsBitField.Flags.GuildMembers
	]
})

// Alternância entre modo normal e de testes
const modo_develop = 0, force_update = 0, silent = 0
let status = 1, ranking = 1

let token = process.env.token_1, clientId = process.env.client_1

if (!modo_develop)
	status = 1, ranking = 1

if (silent)
	status = 0, ranking = 0

// Force update é usado para forçar a atualização de comandos globais
// e privados do bot
if (modo_develop)
	token = process.env.token_2, clientId = process.env.client_2

let commands = []
const comandos_privados = []
const conversations = []
client.commands = new Collection()

// Linkando os comandos slash disponíveis
for (const folder of readdirSync(`${__dirname}/comandos/`)) {
	for (const file of readdirSync(`${__dirname}/comandos/${folder}`).filter(file => file.endsWith('.js'))) {
		const command = require(`./comandos/${folder}/${file}`)

		if (!modo_develop)
			if (!command.data.name.startsWith('c_'))
				commands.push(command.data.toJSON())
			else // Salvando comandos privados para usar apenas num servidor
				comandos_privados.push(command.data.toJSON())
		else
			commands.push(command.data.toJSON())
	}
}

if (modo_develop || force_update) {
	const rest = new REST({ version: '10' }).setToken(token)

	if (force_update) { // Registrando os comandos públicos globalmente
		rest.put(Routes.applicationCommands(clientId), { body: commands })
			.then(() => console.log('Comandos globais atualizados com sucesso.'))
			.catch(console.error)
	}

	if (force_update) // Reescreve a lista de comandos com os comandos privados
		commands = comandos_privados

	// Registrando os comandos privados no servidor
	rest.put(Routes.applicationGuildCommands(clientId, process.env.guildID), { body: commands })
		.then(() => console.log('Comandos privados do servidor atualizados com sucesso.'))
		.catch(console.error)

	// Removendo os comandos slash globalmente
	// rest.get(Routes.applicationCommands(clientId))
	// 	.then(data => {
	// 		const promises = []

	// 		for (const command of data) {
	// 			const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`
	// 			promises.push(rest.delete(deleteUrl))
	// 		}

	// 		console.log("Removendo os comandos em barra globalmente")
	// 		return Promise.all(promises)
	// 	})
}

for (const folder of readdirSync(`${__dirname}/comandos/`)) {
	for (const file of readdirSync(`${__dirname}/comandos/${folder}`).filter(file => file.endsWith('.js'))) {
		const command = require(`./comandos/${folder}/${file}`)
		client.commands.set(command.data.name, command)
	}
}

client.once('ready', async () => {

	// Definindo o idioma do bot
	idioma.setPath(`${__dirname}/arquivos/data/idiomas`)
	idioma.setDefault('pt-br')

	client.bot = bot
	client.idioma = idioma
	client.usuarios = user
	client.owners = process.env.owner_id

	if (status)
		await require('./adm/eventos/status.js')({ client })

	console.log(`Caldeiras do ${client.user.username} aquecidas, pronto para operar`)
})

client.on('messageCreate', async (message) => {

	let ativador = "a_1"

	if (client.user.id == "846472827212136498")
		ativador = "a_2"

	// Respostas automatizadas por IA
	if (message.content.includes(client.user.id) || (message.content.toLowerCase()).includes(ativador)) {
		let text = message.content.split("> ")[1] || message.content
		text = text.replace(ativador, "").replace("833349943539531806", "").trim()

		let alvo = "a_2"

		if (ativador == "a_2")
			alvo = "a_1"

		cleverbot(text).then(res => {
			conversations.push(text)
			conversations.push(res.trim())

			setTimeout(() => {
				message.channel.send(`${alvo} ${res}`)

				if (conversations.length > 200) {
					conversations.shift()
					conversations.shift()
				}
			}, 2000)
		})

		return
	}

	if (message.author.bot || message.webhookId) return

	try { // Atualizando ranking e recebendo mensagens de texto

		const caso = 'messages'
		if (message.content.length >= 7 && ranking) await require('./adm/data/ranking.js')({ client, message, caso })

		require('./adm/eventos/comandos_antigos.js')({ client, message })
	} catch (err) {
		const local = 'commands'
		require('./adm/eventos/error.js')({ client, err, local })
	}
})

client.on('interactionCreate', async interaction => {

	if (interaction.isSelectMenu()) // Interações por uso de menus de seleção
		return require('./adm/interacoes/menus.js')({ client, interaction })

	if (interaction.isButton()) // Interações por uso de botões
		return require('./adm/interacoes/buttons.js')({ client, interaction })

	const { inicio } = require(`./arquivos/idiomas/${client.idioma.getLang(interaction)}`)

	if (!interaction.isChatInputCommand()) return
	if (!interaction.guild) return interaction.reply(inicio[0]["comando_dm"])

	const command = client.commands.get(interaction.commandName)
	if (!command) return

	await command.execute(client, interaction)
		.then(() => {
			require('./adm/eventos/log.js')({ client, interaction, command })
		})
		.catch(err => {
			const { inicio } = require(`./arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

			require('./adm/eventos/error.js')({ client, err })
			interaction.reply({ content: `:octagonal_sign: | ${inicio[0]["epic_embed_fail"]}`, ephemeral: true })
		})
})

// Eventos secundários
require('./adm/eventos/events.js')({ client })

client.login(token)