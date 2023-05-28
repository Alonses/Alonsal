const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    let icone_server = interaction.guild.iconURL({ size: 2048 }).replace(".webp", ".gif")

    fetch(icone_server)
        .then(res => {
            if (res.status !== 200)
                icone_server = icone_server.replace('.gif', '.webp')

            const embed = new EmbedBuilder()
                .setTitle(interaction.guild.name)
                .setDescription(client.replace(client.tls.phrase(user, "util.avatar.download_icon"), icone_server))
                .setColor(client.embed_color(user.misc.color))
                .setImage(icone_server)

            interaction.reply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
        })
}