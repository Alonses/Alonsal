const idioma = require("./adm/idioma")
const { readdirSync } = require("fs")
const { REST } = require('@discordjs/rest')
const { Routes, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const { Client, Collection, GatewayIntentBits } = require('discord.js')
const { clientId, clientId2, guildId, token, token_2, owner_id } = require('./config.json')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
    	GatewayIntentBits.MessageContent
	]
})

client.commands = new Collection()
const commands = []
const comandos_privados = []

// Linkando os comandos slash disponíveis
for (const folder of readdirSync(`${__dirname}/comandos/`)){
	for (const file of readdirSync(`${__dirname}/comandos/${folder}`).filter(file => file.endsWith('.js'))) {
		const command = require(`./comandos/${folder}/${file}`)

		if(!command.data.name.startsWith("c_"))
			commands.push(command.data.toJSON())
		else // Salvando comandos privados para usar apenas num servidor
			comandos_privados.push(command.data.toJSON())
	}
}

// const rest = new REST({ version: '10' }).setToken(token)

// Registrando os comandos globalmente
// rest.put(Routes.applicationCommands(clientId2), { body: commands })
// 	.then(() => console.log('Comandos Alonsais globais atualizados com sucesso.'))
// 	.catch(console.error)

// // // Registrando os comandos no server
// rest.put(Routes.applicationGuildCommands(clientId2, guildId), { body: comandos_privados })
// 	.then(() => console.log('Comandos Alonsais privados do servidor atualizados com sucesso.'))
// 	.catch(console.error)

// Removendo os comandos slash globalmente
// rest.get(Routes.applicationCommands(clientId2))
//     .then(data => {
//         const promises = []

//         for (const command of data) {
//             const deleteUrl = `${Routes.applicationCommands(clientId2)}/${command.id}`
//             promises.push(rest.delete(deleteUrl))
//         }
		
// 		console.log("Removendo os comandos em barra globalmente")
//         return Promise.all(promises)
//     })

for (const folder of readdirSync(`${__dirname}/comandos/`)){
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

	await require("./adm/internos/status.js")({client})
	console.log('Caldeiras aquecidas, pronto para operar')
})

client.on("messageCreate", async (message) => {
	if (message.author.bot || message.webhookId) return

	try{ // Atualizando ranking e recebendo mensagens de texto
		if(message.content.length >= 7) await require('./adm/ranking.js')({client, message})
		
		if (message.channel.type === "GUILD_TEXT") {
			const permissions = message.channel.permissionsFor(message.client.user)

			if (!permissions.has("SEND_MESSAGES")) return // Permissão para enviar mensagens no canal
		}

		const { updates } = require(`./arquivos/idiomas/${client.idioma.getLang(message)}.json`)

		if (message.content.includes(client.user.id) || message.content.startsWith(".a")){
		
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
					.setLabel(updates[0]["convidar"])
					.setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1614150720`)
					.setStyle(ButtonStyle.Link),
				)
				
			message.reply({ content: updates[0]["slash_commands"], components: [row]})
		}
	}catch(err){
		require('./adm/internos/error.js')({client, err})
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
		require('./adm/internos/error.js')({client, err})
		interaction.reply({ content: inicio[0]["epic_embed_fail"], ephemeral: true })
	})
})

// Eventos secundários
require('./adm/internos/eventos.js')({client})

client.login(token);