const { EmbedBuilder } = require('discord.js')

const { getTimedRoleAssigner } = require('../../database/schemas/User_roles')

const { defaultRoleTimes } = require('../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, dados }) => {

    const user_alvo = interaction.options?.getUser("user") || dados
    const role = await getTimedRoleAssigner(user_alvo.id, interaction.guild.id)

    const razao = role.relatory ? `\n\`\`\`fix\n${role.relatory}\`\`\`` : "\n```fix\nSem motivo informado```"

    const embed = new EmbedBuilder()
        .setTitle(`> Atribuindo um cargo temporário :passport_control:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`Você está atribuindo um cargo temporário a um membro deste servidor.\n\nUse os botões abaixo para configurar as preferências do cargo conforme desejar.${razao}`)
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
                name: `${client.defaultEmoji("time")} **Expiração**`,
                value: role.timeout ? `\`${client.tls.phrase(user, `menu.times.${defaultRoleTimes[role.timeout]}`)}\`` : `\`Sem expiração definida\``,
                inline: true
            }
        )

    const row = [
        { id: "role_timed_assigner", name: "Cargo", type: 1, emoji: client.emoji("mc_name_tag"), data: `2.${role.uid}` },
        { id: "role_timed_assigner", name: "Expiração", type: 1, emoji: client.defaultEmoji("time"), data: `3.${role.uid}` }
    ]

    if (role.timeout !== null) // Só libera a função caso um tempo seja selecionado
        row.push({ id: "role_timed_assigner", name: "Conceder", type: 2, emoji: client.emoji(10), data: `1.${role.uid}` })

    row.push({ id: "role_timed_assigner", name: "Cancelar", type: 3, emoji: client.emoji(0), data: `0.${role.uid}` })

    client.reply(interaction, {
        embeds: [embed],
        components: [client.create_buttons(row, interaction)],
        ephemeral: true
    })
}