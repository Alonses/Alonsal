const { PermissionsBitField } = require('discord.js')

const action_permission = {
    "member_mute": [PermissionsBitField.Flags.ModerateMembers],
    "member_ban": [PermissionsBitField.Flags.BanMembers],
    "member_kick_2": [PermissionsBitField.Flags.KickMembers]
}

module.exports = async ({ client, user, interaction }) => {

    const guild_executor = await client.getMemberPermissions(interaction.guild.id, interaction.user.id)
    const guild = await client.getGuild(interaction.guild.id)

    // Verificando as permissões do moderador que iniciou a advertência
    if (!guild_executor.permissions.has(action_permission[guild.warn.action]))
        return interaction.reply({ content: `:octagonal_sign: | Você não pode acessar essa função!\nA punição das advertências neste servidor estão definidas como \`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\` e você não possui ela...`, ephemeral: true })

    // Redirecionando o evento
    require('../../../core/interactions/chunks/panel_guild_browse_warns')({ client, user, interaction })
}