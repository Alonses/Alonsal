const { PermissionsBitField } = require('discord.js')

const guildActions = {
    "member_mute": [PermissionsBitField.Flags.ModerateMembers],
    "member_ban": [PermissionsBitField.Flags.BanMembers],
    "member_kick_2": [PermissionsBitField.Flags.KickMembers]
}

module.exports = async ({ client, user, interaction }) => {

    const guild_executor = await client.getMemberPermissions(interaction.guild.id, interaction.user.id)
    const guild = await client.getGuild(interaction.guild.id)

    // Verificando as permissões do moderador que iniciou a advertência
    if (!guild_executor.permissions.has(guildActions[guild.warn.action]))
        return client.tls.reply(interaction, user, "mode.warn.sem_permissao", true, client.emoji(7), client.tls.phrase(user, `menu.events.${guild.warn.action}`))

    // Redirecionando o evento
    require('../../../core/interactions/chunks/panel_guild_browse_warns')({ client, user, interaction })
}