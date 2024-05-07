const fs = require('fs')

const { REST } = require('@discordjs/rest')
const { Routes, Collection } = require('discord.js')

let commands = [], comandos_privados = []

function slash_commands(client) {

    client.cached.timestamp = client.timestamp()
    client.discord.commands = new Collection()

    // Linkando os comandos slash disponíveis
    if (!client.x.delete_slash) {
        for (const folder of fs.readdirSync(`${__dirname}/commands/`)) {
            for (const file of fs.readdirSync(`${__dirname}/commands/${folder}`).filter(file => file.endsWith('.js'))) {

                if (folder !== "experimental" || client.x.modo_develop) {
                    const command = require(`./commands/${folder}/${file}`)

                    if (!client.x.modo_develop)
                        if (!command.data.name.startsWith('c_'))
                            commands.push(command.data.toJSON())
                        else // Salvando comandos privados para usar apenas num servidor
                            comandos_privados.push(command.data.toJSON())
                    else
                        commands.push(command.data.toJSON())

                    // Comandos do menu de contexto
                    if ('menu_data' in command && 'menu' in command)
                        commands.push(command.menu_data.toJSON())
                }
            }

            // Comandos do menu de contexto
            if (fs.existsSync(`${__dirname}/commands/${folder}/context`)) {
                for (const file of fs.readdirSync(`${__dirname}/commands/${folder}/context`).filter(file => file.endsWith('.js'))) {
                    if (folder !== "experimental" || client.x.modo_develop) {
                        const command = require(`./commands/${folder}/context/${file}`)

                        if ('menu_data' in command && 'menu' in command)
                            commands.push(command.menu_data.toJSON())
                    }
                }
            }
        }

        console.log("🔵 | Atualizando comandos")
    }

    if (client.x.modo_develop || client.x.force_update) {
        const rest = new REST({ version: "10" }).setToken(client.x.token)

        if (!client.x.delete_slash) { // Registrando os comandos públicos globalmente
            if (client.x.force_update) { // Atualizando forçadamente os comandos globais
                rest.put(Routes.applicationCommands(client.x.id), { body: commands })
                    .then(() => console.log("🟢 | Comandos globais atualizados com sucesso."))
                    .catch(console.error)
            }

            if (client.x.force_update) // Reescreve a lista de comandos com os comandos privados
                commands = comandos_privados

            // Registrando os comandos privados no servidor
            rest.put(Routes.applicationGuildCommands(client.x.id, process.env.guild_id), { body: commands })
                .then(() => console.log("🟢 | Comandos privados do servidor atualizados com sucesso."))
                .catch(console.error)

        } else { // Removendo os comandos slash

            console.log("🟠 | Excluindo os comandos slash")

            // Comandos da guild
            rest.put(Routes.applicationGuildCommands(client.x.id, process.env.guild_id), { body: [] })
                .then(() => console.log('🟢 | Comandos slash do servidor removidos com sucesso.'))
                .catch(console.error)

            // Comandos globais
            rest.put(Routes.applicationCommands(client.x.id), { body: [] })
                .then(() => console.log('🟢 | Comandos slash globais removidos com sucesso.'))
                .catch(console.error)
        }
    }

    if (!client.x.delete_slash) {
        console.log("🔵 | Ordenando comandos")

        for (const folder of fs.readdirSync(`${__dirname}/commands/`)) {
            for (const file of fs.readdirSync(`${__dirname}/commands/${folder}`).filter(file => file.endsWith('.js'))) {
                const command = require(`./commands/${folder}/${file}`)
                client.discord.commands.set(command.data.name, command)

                // Comandos de menu de contexto com nomes diferentes dos comandos principais
                if ('menu_data' in command && 'menu' in command)
                    if (!client.discord.commands.get(command.menu_data.name.toLowerCase()))
                        client.discord.commands.set(command.menu_data.name.toLowerCase(), command)

                // Comandos do menu de contexto
                if (fs.existsSync(`${__dirname}/commands/${folder}/context`)) {
                    for (const file of fs.readdirSync(`${__dirname}/commands/${folder}/context`).filter(file => file.endsWith('.js'))) {
                        if (folder !== "experimental" || client.x.modo_develop) {
                            const command = require(`./commands/${folder}/context/${file}`)

                            if ('menu_data' in command && 'menu' in command)
                                client.discord.commands.set(command.menu_data.name.toLowerCase(), command)
                        }
                    }
                }
            }
        }
    }
}

module.exports.slash_commands = slash_commands