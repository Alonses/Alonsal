const { PermissionsBitField } = require("discord.js")

const { removeWarn } = require("../../database/schemas/Warns")

module.exports = async ({ client, user, interaction, guild, user_warns, guild_member, guild_executor, bot_member }) => {

    // Verificando se o membro e o executor estão no servidor
    if (!guild_member || !guild_executor) return

    // Verificando se a hierarquia do membro que ativou o report é maior que o do alvo e se pode banir membros
    if (guild_executor.roles.highest.position < guild_member.roles.highest.position || !guild_executor.permissions.has([PermissionsBitField.Flags.BanMembers]))
        return client.notify(guild.warn.channel, { content: `:octagonal_sign: | A punição não foi aplicada pois o moderador que criou a advertência não possui permissões para \`Banir membros\` ou a hierarquia do usuário que foi advertido é maior que a do moderador!` })

    // Verificando se a hierarquia do bot é maior que o do alvo e se pode banir membros
    if (bot_member.roles.highest.position < guild_member.roles.highest.position || !bot_member.permissions.has([PermissionsBitField.Flags.BanMembers])) {

        // Bot não possui permissões para moderar membros
        if (!bot_member.permissions.has([PermissionsBitField.Flags.BanMembers]))
            return client.notify(guild.warn.channel, { content: ":octagonal_sign: | Eu não posso banir esse membro por falta de permissões, as advertências do servidor estão definidas como `Banir membro`, porém eu não posso banir um usuário sem essa permissão concedida!\nO sistema de advertências não irá funcionar sem essa permissão." })

        // Usuário alvo possui mais hierarquia que o bot
        return client.notify(guild.warn.channel, { content: ":octagonal_sign: | Eu não posso banir esse membro pois ele possui mais hierarquia que eu!\nO sistema de advertências não irá funcionar se meu cargo estiver abaixo do usuário advertido na lista de cargos do servidor!" })
    }

    // Banindo o membro
    await guild_member.ban({ // Banindo o usuário do servidor automaticamente
        reason: user_warns.relatory,
        deleteMessageSeconds: 3 * 24 * 60 * 60 // 3 dias
    })
        .then(async () => {
            // Resetando as advertências do usuário
            await removeWarn(user_warns.uid, guild.sid)
        })
}