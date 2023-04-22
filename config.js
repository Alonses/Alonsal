const { REST } = require('@discordjs/rest')
const { Routes, Collection } = require('discord.js')

const { readdirSync } = require('fs')

let commands = []
const comandos_privados = []

function config(client) {

    // Limpando o console e inicializando o bot
    console.clear()
    client.x.timestamp = client.timestamp()

    console.log("🟠 | Inicializando o bot...")

    client.discord.commands = new Collection()

    // Linkando os comandos slash disponíveis
    if (!client.x.delete_slash) {
        for (const folder of readdirSync(`${__dirname}/comandos/`)) {
            for (const file of readdirSync(`${__dirname}/comandos/${folder}`).filter(file => file.endsWith('.js'))) {

                if (folder !== "experimental" || client.x.modo_develop) {
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
        }

        console.log("🔵 | Atualizando comandos")
    }

    if (client.x.modo_develop || client.x.force_update) {
        const rest = new REST({ version: "10" }).setToken(client.x.token)

        if (!client.x.delete_slash) { // Registrando os comandos públicos globalmente
            if (client.x.force_update) { // Atualizando forçadamente os comandos globais
                rest.put(Routes.applicationCommands(client.x.clientId), { body: commands })
                    .then(() => console.log("🟢 | Comandos globais atualizados com sucesso."))
                    .catch(console.error)
            }

            if (client.x.force_update) // Reescreve a lista de comandos com os comandos privados
                commands = comandos_privados

            // Registrando os comandos privados no servidor
            rest.put(Routes.applicationGuildCommands(client.x.clientId, process.env.guild_id), { body: commands })
                .then(() => console.log("🟢 | Comandos privados do servidor atualizados com sucesso."))
                .catch(console.error)

        } else { // Removendo os comandos slash globalmente

            console.log("🟠 | Excluindo comandos slash registrados globalmente")

            rest.get(Routes.applicationCommands(client.x.clientId))
                .then(data => {
                    const promises = []

                    for (const command of data) {
                        const deleteUrl = `${Routes.applicationCommands(client.x.clientId)}/${command.id}`
                        promises.push(rest.delete(deleteUrl))
                    }

                    console.log("🟢 | Comandos slash globais removidos com sucesso")

                    return Promise.all(promises)
                })
        }
    }

    if (!client.x.delete_slash) {
        console.log("🔵 | Ordenando comandos")

        for (const folder of readdirSync(`${__dirname}/comandos/`)) {
            for (const file of readdirSync(`${__dirname}/comandos/${folder}`).filter(file => file.endsWith('.js'))) {
                const command = require(`./comandos/${folder}/${file}`)
                client.discord.commands.set(command.data.name, command)
            }
        }
    }
}

module.exports.config = config