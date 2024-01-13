const { EmbedBuilder } = require('discord.js')

const { listAllUserWarns } = require('../../database/schemas/Warns')

module.exports = async ({ client, user, interaction, dados }) => {

    let member = interaction.options?.getUser("user") || dados
    const descricao = interaction.options?.getString("reason")

    const user_warns = await listAllUserWarns(member.id, interaction.guild.id)

    if (user_warns.length < 1)
        return interaction.reply({
            content: "🔍 | O usuário mencionado não possui nenhuma advertência neste servidor!",
            ephemeral: true
        })

    const embed = new EmbedBuilder()
        .setTitle(`> Advertências de ${user_warns[0].nick} ${client.defaultEmoji("paper")}`)
        .setColor(client.embed_color(user.misc.color))
        .setFooter({
            text: "Selecione uma das advertências abaixo para poder gerenciar!",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    const botoes = []
    let counter = 0

    user_warns.forEach(warn => {
        botoes.push({ id: "warn_user_verify", name: `${counter + 1}°`, emoji: client.defaultEmoji("guard"), type: 1, data: `9|${warn.uid}.${warn.timestamp}` })
        counter++
    })

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}