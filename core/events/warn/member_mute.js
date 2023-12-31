const { PermissionsBitField } = require("discord.js")

const { spamTimeoutMap } = require("../../database/schemas/Strikes")
const { listAllGuildWarns } = require("../../database/schemas/Warns_guild")

module.exports = async ({ client, user, interaction, guild, user_warns, guild_member, guild_executor, bot_member }) => {

    // Verificando se o membro e o executor estão no servidor
    if (!guild_member || !guild_executor) return

    // Verificando se a hierarquia do membro que ativou o report é maior que o do alvo e se pode banir membros
    if (guild_executor.roles.highest.position < guild_member.roles.highest.position || !guild_executor.permissions.has([PermissionsBitField.Flags.ModerateMembers]))
        return client.notify(guild.warn.channel, { content: `:octagonal_sign: | A punição não foi aplicada pois o moderador que criou a advertência não possui permissões para \`Castigar membros\` ou a hierarquia do usuário que foi advertido é maior que a do moderador!` })

    // Verificando se a hierarquia do bot é maior que o do alvo e se pode banir membros
    if (bot_member.roles.highest.position < guild_member.roles.highest.position || !bot_member.permissions.has([PermissionsBitField.Flags.ModerateMembers])) {

        // Bot não possui permissões para moderar membros
        if (!bot_member.permissions.has([PermissionsBitField.Flags.ModerateMembers]))
            return client.notify(guild.warn.channel, { content: ":octagonal_sign: | Eu não posso silenciar esse membro por falta de permissões, as advertências do servidor estão definidas como `Mutar membro`, porém eu não posso mutar um usuário sem a permissão `Castigar membros`.!\nO sistema de advertências não irá funcionar sem essa permissão." })

        // Usuário alvo possui mais hierarquia que o bot
        return client.notify(guild.warn.channel, { content: ":octagonal_sign: | Eu não posso silenciar esse membro pois ele possui mais hierarquia que eu!\nO sistema de advertências não irá funcionar se meu cargo estiver abaixo do usuário advertido na lista de cargos do servidor!" })
    }

    const guild_warns = await listAllGuildWarns(interaction.guild.id)

    // Tempo de mute padrão do servidor para advertências
    const timeout = spamTimeoutMap[guild_warns[user_warns.total].timeout] * 1000

    // Mutando o membro
    await guild_member.timeout(timeout, user_warns.relatory)
        .catch(console.error)
}