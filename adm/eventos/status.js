const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client }) => {

    if (client.user.id === "833349943539531806") {

        fetch('https://apisal.herokuapp.com/status')
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

        client.user.setActivity('¡Estoy en linea!', 'COMPETING')
        const activities = [
            "/idioma | Español ahora!",
            `comandos em barra`,
            "traducciones",
            "slash commands",
            "cera en español",
            "baidu en comandos",
            "etiquétame ahí tu cuerno!",
        ]

        let i = 0
        setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`), 10000)
    } else
        client.user.setPresence({ activities: [{ name: 'baidu nos servidores' }] })

    require('../automaticos/relata.js')({ client })
    require('../automaticos/anuncia.js')({ client })
}

function dispara_status(client, status_apisal) {

    const canais_texto = client.channels.cache.filter((c) => c.type === 0).size
    let members = 0

    client.guilds.cache.forEach(async guild => {
        members += guild.memberCount - 1
    })

    const embed = new EmbedBuilder()
        .setTitle(':steam_locomotive: Caldeiras aquecidas')
        .setColor(0x29BB8E)
        .addFields(
            {
                name: ':globe_with_meridians: **Servidores**',
                value: `**Ativo em: **\`${client.guilds.cache.size}\``,
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
            { name: ':white_small_square: Versão', value: `\`${process.env.version}\``, inline: true },
            { name: '⠀', value: '⠀', inline: true },
            { name: ':moyai: APISAL', value: `\`${status_apisal}\``, inline: true })
        .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) })

    client.channels.cache.get('854695578372800552').send({ embeds: [embed] }) // Avisa que está online em um canal
}