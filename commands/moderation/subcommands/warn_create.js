const { PermissionsBitField } = require('discord.js')

const { listAllUserWarns } = require('../../../core/database/schemas/User_warns')
const { listAllGuildWarns } = require('../../../core/database/schemas/Guild_warns')

const guildActions = {
    "member_mute": [PermissionsBitField.Flags.ModerateMembers],
    "member_ban": [PermissionsBitField.Flags.BanMembers],
    "member_kick_2": [PermissionsBitField.Flags.KickMembers]
}

module.exports = async ({ client, user, interaction }) => {

    // Verificando a quantidade de advertências customizadas no servidor
    const warns_guild = await listAllGuildWarns(interaction.guild.id)

    if (warns_guild.length < 2) // Warns não configuradas no servidor
        return client.tls.reply(interaction, user, "mode.warn.nao_configurado", true, 60)

    const guild_member = await client.getMemberGuild(interaction.guild.id, interaction.options.getUser("user").id)
    const guild_executor = await client.getMemberGuild(interaction.guild.id, interaction.user.id)
    const bot_member = await client.getMemberGuild(interaction.guild.id, client.id())

    const guild = await client.getGuild(interaction.guild.id)

    let user_alvo = interaction.options.getUser("user")
    let id_alvo

    if (typeof user_alvo === "object")
        id_alvo = user_alvo.id

    if (id_alvo === interaction.user.id) // Impede que o usuário se auto reporte
        return client.tls.reply(interaction, user, "mode.report.auto_reporte", true, client.emoji(0))

    if (id_alvo === client.id()) // Impede que o usuário reporte o bot
        return client.tls.reply(interaction, user, "mode.report.reportar_bot", true, client.emoji(0))

    if (isNaN(id_alvo) || id_alvo.length < 18) // ID inválido
        return client.tls.reply(interaction, user, "mode.report.id_invalido", true, client.defaultEmoji("types"))

    const membro_guild = await client.getMemberGuild(interaction, id_alvo)

    if (!guild_member) // Membro saiu do servidor antes de acionar o comando
        return client.tls.reply(interaction, user, "mode.warn.membro_desconhecido", true, 1)

    if (membro_guild?.user.bot) // Impede que outros bots sejam reportados
        return client.tls.reply(interaction, user, "mode.report.usuario_bot", true, client.emoji(0))

    // Verificando se a hierarquia do membro que ativou o warn é maior que o do alvo
    if (guild_executor.roles.highest.position < guild_member.roles.highest.position)
        return client.tls.reply(interaction, user, "mode.warn.mod_sem_hierarquia", true, client.emoji(0))

    const user_warns = await listAllUserWarns(guild_member.id, interaction.guild.id)
    const indice_warn = user_warns.length >= warns_guild.length ? warns_guild.length - 1 : user_warns.length

    if (warns_guild[indice_warn].action) // Verificando as permissões do moderador que iniciou a advertência
        if (warns_guild[indice_warn].action !== "none") {

            if (!guild_executor.permissions.has(guildActions[warns_guild[indice_warn].action]))
                return client.tls.reply(interaction, user, "mode.warn.mod_sem_permissao", true, 7, client.tls.phrase(user, `menu.events.${warns_guild[indice_warn].action}`))

            // Verificando se a hierarquia do bot é maior que o do alvo e se pode banir membros
            if (bot_member.roles.highest.position < guild_member.roles.highest.position || !bot_member.permissions.has(guildActions[warns_guild[indice_warn].action])) {

                let frase_retorno = client.tls.phrase(user, "mode.warn.bot_sem_hierarquia", client.emoji(0))

                // Avisando sobre a falta de permissões do bot
                if (!bot_member.permissions.has(guildActions[warns_guild[indice_warn].action]))
                    frase_retorno = client.tls.phrase(user, "mode.warn.bot_sem_permissao", 7, client.tls.phrase(user, `menu.events.${warns_guild[indice_warn].action}`))

                return interaction.reply({ content: frase_retorno, ephemeral: true })
            }
        }

    // Redirecionando o evento
    require('../../../core/formatters/chunks/model_user_warn')({ client, user, interaction, guild, user_warns, guild_member, guild_executor, bot_member })
}