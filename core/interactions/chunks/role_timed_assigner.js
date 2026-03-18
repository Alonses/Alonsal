const { getTimedRoleAssigner } = require('../../database/schemas/User_roles')

const { defaultRoleTimes } = require('../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, dados }) => {

    const user_alvo = interaction.options?.getUser("user") || dados
    const role = await getTimedRoleAssigner(client.encrypt(user_alvo.id), client.encrypt(interaction.guild.id))

    const razao = role.relatory ? `\n\`\`\`fix\n${client.decifer(role.relatory)}\`\`\`` : "\n```fix\nSem motivo informado```"

    const embed = client.create_embed({
        title: `${client.tls.phrase(user, "mode.timed_roles.titulo")} :passport_control:`,
        description: `${client.tls.phrase(user, "mode.timed_roles.descricao")}${razao}`,
        fields: [
            {
                name: `${client.defaultEmoji("person")} **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${user_alvo.id}\`\n( <@${user_alvo.id}> )`,
                inline: true
            },
            {
                name: `${client.emoji("mc_name_tag")} **${client.tls.phrase(user, "mode.roles.cargo_selecionado")}**`,
                value: `<@&${client.decifer(role.rid)}>`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}**`,
                value: role.timeout ? `\`${client.tls.phrase(user, `menu.times.${defaultRoleTimes[role.timeout]}`)}\`` : `\`❌ ${client.tls.phrase(user, "mode.timed_roles.sem_expiracao")}\``,
                inline: true
            }
        ]
    }, user)

    const row = [
        { id: "role_timed_assigner", name: { tls: "mode.anuncio.cargo" }, type: 0, emoji: client.emoji("mc_name_tag"), data: `2.${user_alvo.id}` },
        { id: "role_timed_assigner", name: { tls: "menu.botoes.expiracao" }, type: 0, emoji: client.defaultEmoji("time"), data: `3.${user_alvo.id}` }
    ]

    if (role.timeout !== null) // Só libera a função caso um tempo seja selecionado
        row.push({ id: "role_timed_assigner", name: { tls: "menu.botoes.conceder" }, type: 1, emoji: client.emoji(10), data: `1.${user_alvo.id}` })

    row.push({ id: "role_timed_assigner", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `0.${user_alvo.id}` })

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(row, interaction, user)],
        flags: "Ephemeral"
    })
}