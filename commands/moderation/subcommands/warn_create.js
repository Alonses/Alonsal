const { PermissionsBitField } = require('discord.js')

const action_permission = {
    "member_mute": [PermissionsBitField.Flags.ModerateMembers],
    "member_ban": [PermissionsBitField.Flags.BanMembers],
    "member_kick_2": [PermissionsBitField.Flags.KickMembers]
}

module.exports = async ({ client, user, interaction }) => {

    const guild_member = await client.getMemberPermissions(interaction.guild.id, interaction.options.getUser("user").id)
    const guild_executor = await client.getMemberPermissions(interaction.guild.id, interaction.user.id)
    const bot_member = await client.getMemberPermissions(interaction.guild.id, client.id())

    const guild = await client.getGuild(interaction.guild.id)

    // Verificando se a hierarquia do membro que ativou o warn é maior que o do alvo
    if (guild_executor.roles.highest.position < guild_member.roles.highest.position)
        return interaction.reply({ content: ":octagonal_sign: | Você não pode criar uma advertência a um usuário que possui mais permissões que você!", ephemeral: true })

    // Verificando as permissões do moderador que iniciou a advertência
    if (!guild_executor.permissions.has(action_permission[guild.warn.action]))
        return interaction.reply({ content: `:octagonal_sign: | Você não pode criar uma advertência neste servidor!\nA punição das advertências neste servidor estão definidas como \`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\` e você não possui ela...`, ephemeral: true })

    // Verificando se a hierarquia do bot é maior que o do alvo e se pode banir membros
    if (bot_member.roles.highest.position < guild_member.roles.highest.position || !bot_member.permissions.has(action_permission[guild.warn.action])) {

        let frase_retorno = ":octagonal_sign: | Eu não posso criar uma advertência a esse usuário, pois possuo menos permissões que o usuário informado!"

        // Desativando o recurso no servidor sem a permissão requerida
        if (!bot_member.permissions.has(action_permission[guild.warn.action]))
            frase_retorno = `:octagonal_sign: | Eu não posso criar uma advertência a esse usuário, pois não tenho permissões para \`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\`.`

        return interaction.reply({ content: frase_retorno, ephemeral: true })
    }

    // Redirecionando o evento
    require('../../../core/formatters/chunks/model_user_warn')({ client, user, interaction, guild, guild_member, guild_executor, bot_member })
}