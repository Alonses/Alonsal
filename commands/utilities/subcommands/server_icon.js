module.exports = async ({ client, user, interaction }) => {

    const icone_server = interaction.guild.iconURL({ size: 2048 })

    if (!icone_server)
        return client.tls.reply(interaction, user, "util.avatar.sem_icone", client.decider(user?.conf.ghost_mode, 0), 1)

    const row = client.create_buttons([{ name: { tls: "menu.botoes.navegador", alvo: user }, type: 4, emoji: "🌐", value: icone_server }])

    const embed = client.create_embed({
        title: interaction.guild.name,
        image: icone_server,
        description: { tls: "util.avatar.download_icon" }
    }, user)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
    })
}