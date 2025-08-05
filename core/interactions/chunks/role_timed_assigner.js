const { EmbedBuilder } = require('discord.js')

const { getTimedRoleAssigner } = require('../../database/schemas/User_roles')

const { defaultRoleTimes } = require('../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, dados }) => {

    const user_alvo = interaction.options?.getUser("user") || dados
    const role = await getTimedRoleAssigner(user_alvo.id, interaction.guild.id)

    const razao = role.relatory ? `\n\`\`\`fix\n${role.relatory}\`\`\`` : "\n```fix\nSem motivo informado```"

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.timed_roles.titulo")} :passport_control:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${client.tls.phrase(user, "mode.timed_roles.descricao")}${razao}`)
        .addFields(
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${role.uid}\`\n( <@${role.uid}> )`,
                inline: true
            },
            {
                name: `${client.emoji("mc_name_tag")} **${client.tls.phrase(user, "mode.roles.cargo_selecionado")}**`,
                value: `<@&${role.rid}>`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}**`,
                value: role.timeout ? `\`${client.tls.phrase(user, `menu.times.${defaultRoleTimes[role.timeout]}`)}\`` : `\`❌ ${client.tls.phrase(user, "mode.timed_roles.sem_expiracao")}\``,
                inline: true
            }
        )

    const row = [
        { id: "role_timed_assigner", name: { tls: "mode.anuncio.cargo", alvo: user }, type: 1, emoji: client.emoji("mc_name_tag"), data: `2.${role.uid}` },
        { id: "role_timed_assigner", name: { tls: "menu.botoes.expiracao", alvo: user }, type: 1, emoji: client.defaultEmoji("time"), data: `3.${role.uid}` }
    ]

    if (role.timeout !== null) // Só libera a função caso um tempo seja selecionado
        row.push({ id: "role_timed_assigner", name: { tls: "menu.botoes.conceder", alvo: user }, type: 2, emoji: client.emoji(10), data: `1.${role.uid}` })

    row.push({ id: "role_timed_assigner", name: { tls: "menu.botoes.cancelar", alvo: user }, type: 3, emoji: client.emoji(0), data: `0.${role.uid}` })

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(row, interaction)],
        flags: "Ephemeral"
    })
}