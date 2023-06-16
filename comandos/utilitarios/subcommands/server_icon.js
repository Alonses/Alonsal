const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    const icone_server = interaction.guild.iconURL({ size: 2048 })

    if (!icone_server)
        return interaction.reply({ content: ":mag: | O servidor não possui um icone customizado!", ephemeral: client.decider(user?.conf.ghost_mode, 0) })

    const row = client.create_buttons([{ name: client.tls.phrase(user, "menu.botoes.navegador"), type: 4, emoji: "🌐", value: icone_server }])

    const embed = new EmbedBuilder()
        .setTitle(interaction.guild.name)
        .setDescription(client.tls.phrase(user, "util.avatar.download_icon"))
        .setColor(client.embed_color(user.misc.color))
        .setImage(icone_server)

    interaction.reply({ embeds: [embed], components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}