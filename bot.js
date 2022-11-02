require('dotenv').config()
const { readdirSync } = require('fs')
const { Routes } = require('discord.js')
const user = require('./adm/data/usuario')
const idioma = require('./adm/data/idioma')
const auto = require('./adm/data/relatorio')
const translate = require('./adm/formatadores/translate')

const cleverbot = require('cleverbot-free')
const { REST } = require('@discordjs/rest')
const { Client, Collection, GatewayIntentBits, IntentsBitField } = require('discord.js')

const cli = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		IntentsBitField.Flags.GuildMembers
	]
})

class CeiraClient {
	constructor(discord, usuarios, idioma, translate, auto) {
		this.tls = translate,
			this.idioma = idioma,
			this.discord = discord,
			this.usuarios = usuarios,
			this.auto = auto
	}

	id() {
		return this.discord.user.id
	}

	user() {
		return this.discord.user
	}

	guilds() {
		return this.discord.guilds.cache
	}

	formata_num(valor) {
		return parseFloat(valor).toLocaleString('pt-BR')
	}
}

const client = new CeiraClient(cli, user, idioma, translate, auto)

// Alternância entre modo normal e de testes
const modo_develop = 1, force_update = 0, silent = 0
let status = 1, ranking = 1

let token = process.env.token_1, clientId = process.env.client_1

if (silent)
	status = 0, ranking = 0

// Force update é usado para forçar a atualização de comandos globais
// e privados do bot
if (modo_develop)
	token = process.env.token_2, clientId = process.env.client_2

let commands = []
const conversations = []
const comandos_privados = []
client.discord.commands = new Collection()

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
		client.discord.commands.set(command.data.name, command)
	}
}

client.discord.once('ready', async () => {

	// Definindo o idioma do bot
	idioma.setPath(`${__dirname}/arquivos/data/idiomas`)
	idioma.setDefault('pt-br')

	client.owners = process.env.owner_id.split(", ")

	if (status)
		await require('./adm/eventos/status.js')({ client })

	console.log(`Caldeiras do ${client.user().username} aquecidas, pronto para operar`)
})

client.discord.on('messageCreate', async (message) => {

	let text = message.content.toLowerCase()

	// Respostas automatizadas por IA
	if (text.includes(client.id()) || text.includes("alonsal")) {
		text = text.split("> ")[1] || text
		text = text.replace("alonsal", "").replace(client.id(), "").trim()

		cleverbot(text).then(res => {
			conversations.push(text)
			conversations.push(res.trim())

			setTimeout(() => {
				message.channel.send(res)

				if (conversations.length > 500) {
					conversations.shift()
					conversations.shift()
				}
			}, Math.floor(900 + (Math.random() * 800)))
		})

		return
	}

	if (message.author.bot || message.webhookId) return

	try { // Atualizando ranking e recebendo mensagens de texto

		const caso = 'messages'
		if (message.content.length > 6 && ranking) await require('./adm/data/ranking.js')({ client, message, caso })

		require('./adm/eventos/comandos_antigos.js')({ client, message })
	} catch (err) {
		const local = 'commands'
		require('./adm/eventos/error.js')({ client, err, local })
	}
})

client.discord.on('interactionCreate', async interaction => {

	if (interaction.isSelectMenu()) // Interações por uso de menus de seleção
		return require('./adm/interacoes/menus.js')({ client, interaction })

	if (interaction.isButton()) // Interações por uso de botões
		return require('./adm/interacoes/buttons.js')({ client, interaction })

	if (!interaction.isChatInputCommand()) return
	if (!interaction.guild) return client.tls.reply(client, interaction, "inic.error.comando_dm")

	const command = client.discord.commands.get(interaction.commandName)
	if (!command) return

	await command.execute(client, interaction)
		.then(() => {
			require('./adm/eventos/log.js')({ client, interaction, command })
		})
		.catch(err => {
			require('./adm/eventos/error.js')({ client, err })
			client.tls.reply(client, interaction, "inic.error.epic_embed_fail", true, 0)
		})
})

// Eventos secundários
require('./adm/eventos/events.js')({ client })

client.discord.login(token)