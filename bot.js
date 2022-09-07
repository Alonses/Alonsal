const { readdirSync } = require("fs")
const idioma = require("./adm/idioma")
const { REST } = require('@discordjs/rest')
const { Client, Collection, GatewayIntentBits, IntentsBitField } = require('discord.js')
const { Routes } = require('discord.js')
let { clientId, clientId_2, token, token_2, guildId, owner_id } = require('./config.json')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
    	GatewayIntentBits.MessageContent,
		IntentsBitField.Flags.GuildMembers
	]
})

// Alternância entre modo normal e de testes
const modo_develop = 0, force_update = 0
let status = 1, ranking = 1

if (!modo_develop) {
	status = 1
	ranking = 1
}

// Force update é usado para forçar a atualização de comandos globais
// e privados do bot

if (modo_develop) {
	token = token_2
	clientId = clientId_2
}

let commands = []
const comandos_privados = []
client.commands = new Collection()

// Linkando os comandos slash disponíveis
for (const folder of readdirSync(`${__dirname}/comandos/`)) {
	for (const file of readdirSync(`${__dirname}/comandos/${folder}`).filter(file => file.endsWith('.js'))) {
		const command = require(`./comandos/${folder}/${file}`)

		if (!modo_develop)
			if (!command.data.name.startsWith("c_"))
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
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
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
	idioma.setDefault("pt-br")

	client.idioma = idioma
	client.owners = owner_id

	if (status)
		await require("./adm/internos/status.js")({client})
	
	console.log(`Caldeiras do ${client.user.username} aquecidas, pronto para operar`)
})

client.on("messageCreate", async (message) => {
	if (message.author.bot || message.webhookId) return

	try{ // Atualizando ranking e recebendo mensagens de texto
		
		const caso = 'messages'
		if (message.content.length >= 7 && ranking) await require('./adm/ranking.js')({client, message, caso})
		
		require('./adm/internos/comandos_antigos.js')({client, message})
	}catch(err) {
		const local = "commands"
		require('./adm/internos/error.js')({client, err, local})
	}
})

client.on('interactionCreate', async interaction => {

	if (!interaction.isChatInputCommand()) return 
	if (!interaction.guild) return interaction.reply("Comandos em DM não estão ativos :spy:")

	const command = client.commands.get(interaction.commandName)
	if (!command) return
	
	await command.execute(client, interaction)
	.then(() => {
		require('./adm/internos/log.js')({client, interaction, command})
	})
	.catch(err => {
		const { inicio } = require(`./arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

		require('./adm/internos/error.js')({client, err})
		interaction.reply({ content: inicio[0]["epic_embed_fail"], ephemeral: true })
	})
})

// Eventos secundários
require('./adm/internos/eventos.js')({client})

client.login(token)