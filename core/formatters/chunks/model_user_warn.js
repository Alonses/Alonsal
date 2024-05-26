const { EmbedBuilder } = require('discord.js')

const { getUserWarn, listAllUserWarns } = require('../../database/schemas/User_warns')
const { listAllGuildWarns } = require('../../database/schemas/Guild_warns')
const { getUserPreWarn, listAllUserPreWarns } = require('../../database/schemas/User_pre_warns')

const { spamTimeoutMap, defaultEraser } = require('../patterns/timeout')
const { default_emoji } = require('../../../files/json/text/emojis.json')

module.exports = async ({ client, user, interaction, guild, user_warns, guild_member }) => {

    const descricao_warn = interaction.options.getString("reason")
    const guild_warns = await listAllGuildWarns(interaction.guild.id)

    let texto_rodape = "⠀", user_warn, id_warn = "warn_create"

    if (!guild.warn.hierarchy.status) {
        if (user_warns.length < guild_warns.length) user_warn = await getUserWarn(guild_member.id, interaction.guild.id, client.timestamp())
        else user_warn = user_warns[user_warns.length - 1]
    } else {
        user_warn = await getUserPreWarn(guild_member.id, interaction.guild.id, client.timestamp())
        id_warn = "pre_warn_create"
    }

    const warns_recebidos = await listAllUserWarns(guild_member.id, interaction.guild.id)
    const indice_warn = warns_recebidos.length >= guild_warns.length ? guild_warns.length - 1 : warns_recebidos.length

    // Atualizando os dados da advertência do usuário
    user_warn.valid = false
    user_warn.relatory = descricao_warn
    user_warn.nick = guild_member.user.username
    user_warn.assigner = interaction.user.id
    user_warn.assigner_nick = interaction.user.username
    user_warn.timestamp = client.timestamp()

    await user_warn.save()

    const embed = new EmbedBuilder()
        .setTitle(`${!guild.warn.hierarchy.status ? client.tls.phrase(user, "mode.warn.criando_advertencia") : "> Registrando uma anotação"} :inbox_tray:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(!guild.warn.hierarchy.status ? client.tls.phrase(user, "mode.warn.descricao_inclusao_warn", null, descricao_warn) : `Ao prosseguir com essa inclusão, o usuário receberá uma nova anotação neste servidor.\`\`\`fix\n📃 Descrição fornecida:\n\n${descricao_warn}\`\`\`${client.emoji("banidos")} | Após diversas anotações, um card para aplicar as penalidades da ${warns_recebidos.length + 1}° advertência será disponibilizado.`)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${guild_member.id}\`\n\`${user_warn.nick}\`\n( <@${guild_member.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${interaction.user.id}\`\n\`${interaction.user.username}\`\n( <@${interaction.user.id}> )`,
                inline: true
            }
        )

    if (!guild.warn.hierarchy.status) {

        // Verificando se existem advertências para as próximas punições do usuário
        const indice_matriz = client.verifyGuildWarns(guild_warns) // Indice marcador do momento de expulsão/banimento do membro pelas advertências

        embed.addFields(
            {
                name: `${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.advertencias_em_registro")}**`,
                value: `\`( ${user_warns.length} + 1 ) / ${indice_matriz}\``,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **${client.tls.phrase(user, "menu.botoes.penalidade")}**`,
                value: client.verifyWarnAction(guild_warns[indice_warn], user),
                inline: true
            }
        )
    } else {

        // Coletando todas as anotações de advertência criadas para o membro no servidor
        const user_notes = await listAllUserPreWarns(guild_member.id, interaction.guild.id)
        const notas_requeridas = guild_warns[indice_warn].strikes !== 0 ? guild_warns[indice_warn].strikes : guild.warn.hierarchy.strikes

        embed.addFields(
            {
                name: `${client.defaultEmoji("pen")} **${user_notes.length > 0 ? `${user_notes.length} / ${notas_requeridas} Anotações` : "Sem anotações"}**`,
                value: user_notes.length < 1 ? `**${default_emoji["numbers"][notas_requeridas]} Anotações requeridas**` : "⠀",
                inline: true
            },
            {
                name: `${warns_recebidos.length + 1}° Advertência a ser concedida`,
                value: `${client.defaultEmoji("guard")} **Penalidades:**\n${client.verifyWarnAction(guild_warns[indice_warn], user)}`,
                inline: false
            }
        )
    }

    // Advertência com prazo de expiração
    if (id_warn === "create_warn")
        if (guild.warn.timed) {
            embed.addFields({
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}**`,
                value: `**${client.tls.phrase(user, "mode.warn.remocao_em")} \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**\n( <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:f> )`,
                inline: true
            })

            texto_rodape = client.tls.phrase(user, "mode.warn.dica_expiracao_rodape")
        } else
            embed.addFields({ name: "⠀", value: "⠀", inline: true })

    // Anotações de advertência com prazo de expiração
    if (id_warn === "pre_warn_create" && guild.warn.hierarchy.timed) {
        embed.addFields({
            name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "menu.botoes.expiracao")}**`,
            value: `**${client.tls.phrase(user, "mode.warn.remocao_em")} \`${client.tls.phrase(user, `menu.times.${defaultEraser[guild.warn.hierarchy.reset]}`)}\`**\n( <t:${client.timestamp() + defaultEraser[guild.warn.hierarchy.reset]}:f> )`,
            inline: true
        })

        texto_rodape = "Essa anotação de advertência possui expiração, você pode configurar prazos através do /panel guild, em advertências -> hierarquia."
    }

    embed.setFooter({
        text: texto_rodape,
        iconURL: interaction.user.avatarURL({ dynamic: true })
    })

    // Criando os botões para o menu de advertências
    const row = client.create_buttons([
        { id: id_warn, name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${guild_member.id}` },
        { id: id_warn, name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0|${guild_member.id}` }
    ], interaction)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}