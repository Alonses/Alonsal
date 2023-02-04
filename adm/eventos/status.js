const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { EmbedBuilder, ActivityType } = require('discord.js')
const fs = require('fs')

module.exports = async ({ client }) => {

    client.idioma.loadAll(client)

    if (client.id() === process.env.client_1) {

        // Não notifica que o bot ficou online
        if (client.x.status) {
            fetch(`${process.env.url_apisal}/status`)
                .then(res => res.json())
                .then(retorno => {

                    let status_apisal = "🛑 Offline"
                    if (retorno.status)
                        status_apisal = "✅ Online"

                    dispara_status(client, status_apisal)
                })
                .catch(() => {
                    dispara_status(client, "🛑 Offline")
                })

            client.user().setActivity('Vapor p/ fora!', { type: ActivityType.Watching })

            const activities = [
                "panquecas",
                "/faustop",
                `baidu em ${client.guilds().size} servers`,
                "games de graça",
                "slash commands",
                "itens pixelados",
                "/alaa"
            ]

            let i = 0
            setInterval(() => client.user().setActivity(`${activities[i++ % activities.length]}`, { type: ActivityType.Playing }), 10000)
        }
    } else
        client.user().setPresence({ activities: [{ name: 'ceira explosiva em servidores' }], type: ActivityType.Playing })

    setTimeout(() => {
        client.idioma.listAll()
    }, 2000)

    require('../automaticos/relata.js')({ client })
    require('../automaticos/anuncia.js')({ client })
}

function dispara_status(client, status_apisal) {

    if (process.env.stats_channel) {
        setTimeout(() => {

            fs.readFile('./arquivos/data/language.txt', 'utf8', function (err, data) {

                const commit_language = data
                const canais_texto = client.discord.channels.cache.filter((c) => c.type === 0).size
                let members = 0

                client.guilds().forEach(async guild => {
                    members += guild.memberCount - 1
                })

                let bandeira_idiomas = client.idioma.listAll().split(" ")
                let counter = 0, bandeirolas_1 = [], bandeirolas_2 = []

                for (let i = 0; i < bandeira_idiomas.length; i++) {

                    if (counter < 4)
                        bandeirolas_1.push(bandeira_idiomas[i])
                    else
                        bandeirolas_2.push(bandeira_idiomas[i])

                    if (counter == 4)
                        bandeirolas_1.push("\n")

                    if (i % 7 == 0) {
                        counter = 0
                        bandeirolas_2.push("\n")
                    }

                    counter++
                }

                const embed = new EmbedBuilder()
                    .setTitle(':steam_locomotive: Caldeiras aquecidas')
                    .setColor(0x29BB8E)
                    .addFields(
                        {
                            name: ':globe_with_meridians: **Servidores**',
                            value: `:heart_on_fire: **Ativo: **\`${client.guilds().size}\`\n:card_box: **Canais: **\`${canais_texto.toLocaleString('pt-BR')}\`\n:busts_in_silhouette: **Usuários: **\`${members.toLocaleString('pt-BR')}\``,
                            inline: true
                        },
                        {
                            name: `⠀`,
                            value: `⠀`,
                            inline: true
                        },
                        {
                            name: `:white_small_square: **Versão ${process.env.version}**`,
                            value: `⠀`,
                            inline: true
                        },
                    )
                    .addFields(
                        {
                            name: ':moyai: **APISAL**',
                            value: `\`${status_apisal}\``,
                            inline: true
                        },
                        {
                            name: ':earth_americas: **Idiomas**',
                            value: bandeirolas_1.join(" "),
                            inline: true
                        },
                        {
                            name: `💠 ${commit_language}`,
                            value: bandeirolas_2.join(" "),
                            inline: true
                        }
                    )

                client.notify(process.env.status_channel, embed) // Avisa que está online em um canal
            })
        }, 3000)
    }
}