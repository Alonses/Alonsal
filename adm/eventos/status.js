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

                let bandeira_idiomas = client.idioma.listAll()

                const embed = new EmbedBuilder()
                    .setTitle(':steam_locomotive: Caldeiras aquecidas')
                    .setColor(0x29BB8E)
                    .addFields(
                        {
                            name: ':globe_with_meridians: **Servidores**',
                            value: `**Ativo em: **\`${client.guilds().size}\``,
                            inline: true
                        },
                        {
                            name: ':card_box: **Canais**',
                            value: `**Observando: **\`${canais_texto.toLocaleString('pt-BR')}\``,
                            inline: true
                        },
                        {
                            name: ':busts_in_silhouette: **Usuários**',
                            value: `**Escutando: **\`${members.toLocaleString('pt-BR')}\``,
                            inline: true
                        }
                    )
                    .addFields(
                        {name: ':white_small_square: **Versão**', value: `\`${process.env.version}\``, inline: true},
                        {
                            name: ':earth_americas: **Idiomas**',
                            value: `\`💠 ${commit_language}\`${bandeira_idiomas}`,
                            inline: true
                        },
                        {name: ':moyai: **APISAL**', value: `\`${status_apisal}\``, inline: true})
                    .setFooter({text: client.user().username, iconURL: client.user().avatarURL({dynamic: true})})

                client.discord.channels.cache.get(process.env.stats_channel).send({embeds: [embed]}) // Avisa que está online em um canal
            })
        }, 3000);
    }
}