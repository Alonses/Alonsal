module.exports = async ({ client, user, interaction }) => {

    const row = client.create_buttons([
        { name: { tls: "inic.ping.site" }, type: 4, emoji: "🌐", value: 'http://alonsal.discloud.app/' },
        { name: { tls: "inic.inicio.suporte" }, type: 4, emoji: client.emoji("icon_rules_channel"), value: process.env.url_support },
        { id: "language", name: "Change language", type: 2, emoji: client.defaultEmoji("earth") }
    ], interaction, user)

    const embed = client.create_embed({
        title: "inic.ping.titulo",
        image: "https://i.imgur.com/N8AFVTH.png",
        description: `${client.tls.phrase(user, "inic.ping.boas_vindas_tutorial")}\n\n${client.defaultEmoji("earth")} | ${client.tls.phrase(user, "inic.ping.idioma_dica")}`
    }, user)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}