const { EmbedBuilder } = require('discord.js')

const { activities } = require('../../../files/json/text/activities.json')

module.exports = async ({ client, user, interaction, caso }) => {

    const bot = await client.getBot()
    let row, ouvindo_agora = "", pagina = parseInt(caso) || 0

    if (pagina === 0)
        if (activities[client.cached.presence]?.link) {
            ouvindo_agora = `\`\`\`fix\n🎶 ${client.tls.phrase(user, "manu.info.ouvindo_agora")}\n${client.defaultEmoji("instrument")} ${activities[client.cached.presence].text}\`\`\`\n`

            row = client.create_buttons([
                { name: client.tls.phrase(user, "menu.botoes.ouvir_tambem"), emoji: client.defaultEmoji("music"), value: activities[client.cached.presence].link, type: 4 }
            ], interaction)
        }

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.info.infos")}`)
        .setColor(client.embed_color(user.misc.color))
        .setThumbnail("https://scontent-gru1-1.xx.fbcdn.net/v/t39.30808-6/271761723_4781205238660427_2679923254801920704_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a2f6c7&_nc_eui2=AeEaDbTjIrwdCOtcagWWhVkesSC9z2rDnVexIL3PasOdV5UecFHHTVPIWqV19Eq3VfRZCnHRKRq1cLToTkrsKEim&_nc_ohc=0RgcC3ujltUAX97XDKA&_nc_oc=AQmx0z2kxoAK_y5WsuATe7C9j_M2uor_EZ2DjNPqmJD0olXXScM70c5xlhDQvVV3qVg&_nc_ht=scontent-gru1-1.xx&oh=00_AfDAgo9E37s4Nc_t_6Njz2Q3Ko5-A9be58np1JZJ0nNEOQ&oe=652140A5")
        .setDescription(`${ouvindo_agora}\n${client.tls.phrase(user, "manu.info.conteudo_1")}\n\n${client.tls.phrase(user, "manu.info.invocado_1")} \`${client.locale(bot.persis.commands + 1)}\` ${client.tls.phrase(user, "manu.info.invocado_2")} ${client.emoji("emojis_dancantes")}\n[ _${client.tls.phrase(user, "manu.info.versao")} ${bot.persis.version}_ ]\n\n${client.tls.phrase(user, "manu.info.spawn_alonsal")} <t:1618756500>`)
        .setFooter({
            text: "Alonsal",
            iconURL: "https://i.imgur.com/K61ShGX.png"
        })

    if (pagina === 1) // Dados sobre informações de suporte
        embed.setDescription(client.replace(client.tls.phrase(user, "manu.info.conteudo_2"), [client.emoji("dancando_elizabeth"), client.emoji("mc_bolo")]))

    if (pagina === 2) // Dados sobre fontes externas
        embed.setDescription(client.tls.phrase(user, "manu.info.conteudo_3"))


    if (pagina === 0) // Página inicial
        row = client.create_buttons([
            { id: "browse_info", name: client.tls.phrase(user, "inic.inicio.suporte"), type: 1, emoji: client.emoji(25), data: 1 },
            { id: "browse_info", name: client.tls.phrase(user, "manu.data.links_externos"), type: 1, emoji: client.emoji(32), data: 2 },
        ], interaction)
    else if (pagina === 1)
        row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "browse_info" },
            { name: client.tls.phrase(user, "inic.inicio.convidar"), type: 4, emoji: client.emoji("mc_coracao"), value: `https://discord.com/oauth2/authorize?client_id=${client.id()}&scope=bot&permissions=1614150720` },
            { name: client.tls.phrase(user, "manu.avalie.avaliar"), type: 4, emoji: client.emoji("emojis_dancantes"), value: "https://top.gg/bot/833349943539531806" },
            { name: client.tls.phrase(user, "manu.apoio.contribua"), type: 4, emoji: client.emoji("mc_bolo"), value: "https://picpay.me/slondo" },
            { name: "Buy a Coffee!", type: 4, emoji: "☕", value: "https://www.buymeacoffee.com/slondo" }
        ], interaction)
    else if (pagina === 2)
        row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "browse_info" },
            { name: "GitHub", type: 4, emoji: "🌐", value: "https://github.com/Alonses/Alonsal" },
            { name: "Alondioma", type: 4, emoji: "🏴‍☠️", value: "https://github.com/Alonses/Alondioma" }
        ], interaction)


    // Botão ouvindo agora
    if (ouvindo_agora !== "")
        row.components.push(client.create_buttons([
            { name: client.tls.phrase(user, "menu.botoes.ouvir_tambem"), emoji: client.defaultEmoji("music"), value: activities[client.cached.presence].link, type: 4 }
        ], interaction).components[0])

    if (!interaction.customId)
        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    else
        interaction.update({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
}