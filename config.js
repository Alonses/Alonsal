const { REST } = require('@discordjs/rest')
const { Routes, Collection } = require('discord.js')

const { readdirSync } = require('fs')

let commands = []
const comandos_privados = []

function config(client) {

    client.discord.commands = new Collection()

    // Linkando os comandos slash disponíveis
    for (const folder of readdirSync(`${__dirname}/comandos/`)) {
        for (const file of readdirSync(`${__dirname}/comandos/${folder}`).filter(file => file.endsWith('.js'))) {
            const command = require(`./comandos/${folder}/${file}`)

            if (!client.x.modo_develop)
                if (!command.data.name.startsWith('c_'))
                    commands.push(command.data.toJSON())
                else // Salvando comandos privados para usar apenas num servidor
                    comandos_privados.push(command.data.toJSON())
            else
                commands.push(command.data.toJSON())
        }
    }

    if (client.x.modo_develop || client.x.force_update) {
        const rest = new REST({ version: '10' }).setToken(client.x.token)

        if (client.x.force_update) { // Registrando os comandos públicos globalmente
            rest.put(Routes.applicationCommands(client.x.clientId), { body: commands })
                .then(() => console.log('Comandos globais atualizados com sucesso.'))
                .catch(console.error)
        }

        if (client.x.force_update) // Reescreve a lista de comandos com os comandos privados
            commands = comandos_privados

        // Registrando os comandos privados no servidor
        rest.put(Routes.applicationGuildCommands(client.x.clientId, process.env.guildID), { body: commands })
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
}

module.exports = {
    config
}