const { EmbedBuilder } = require('discord.js')

const { spamTimeoutMap } = require("../../database/schemas/Strikes")

const { getUserWarn } = require('../../database/schemas/Warns')
const { listAllGuildWarns } = require('../../database/schemas/Warns_guild')

module.exports = async ({ client, user, interaction, guild, user_warns, guild_member, guild_executor }) => {

    const descricao_warn = interaction.options.getString("reason")
    const guild_warns = await listAllGuildWarns(interaction.guild.id)
    let texto_rodape = "⠀", user_warn

    if (user_warns.length < guild_warns.length)
        user_warn = await getUserWarn(guild_member.id, interaction.guild.id, client.timestamp())
    else
        user_warn = user_warns[user_warns.length - 1]

    // Atualizando os dados da advertência do usuário
    user_warn.valid = false
    user_warn.relatory = descricao_warn
    user_warn.nick = guild_member.user.username
    user_warn.assigner = interaction.user.id
    user_warn.assigner_nick = interaction.user.username
    user_warn.timestamp = client.timestamp()

    await user_warn.save()

    // Verificando se existem advertências para as próximas punições do usuário
    let indice_warn = user_warns.length

    if (!guild_warns[user_warns.length + 1])
        indice_warn = guild_warns.length - 1

    let indice_matriz = client.verifyGuildWarns(guild_warns) // Indice marcador do momento de expulsão/banimento do membro pelas advertências

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.warn.criando_advertencia")} :inbox_tray:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${client.replace(client.tls.phrase(user, "mode.warn.descricao_inclusao_warn"), descricao_warn)}`)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${guild_member.id}\`\n\`${user_warn.nick}\`\n( <@${guild_member.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${guild_executor.id}\`\n\`${guild_executor.user.username}\`\n( <@${guild_executor.id}> )`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.advertencias_em_registro")}**`,
                value: `\`( ${user_warns.length} + 1 ) / ${indice_matriz}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.emoji("banidos")} **Penalidade**`,
                value: client.verifyWarnAction(guild_warns[indice_warn], user),
                inline: true
            }
        )

    if (guild.warn.timed) { // Advertência com prazo de expiração
        embed.addFields({
            name: `${client.defaultEmoji("time")} **Expiração**`,
            value: `**Será removida em \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\`**\n( <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:f> )`,
            inline: true
        })

        texto_rodape = "Você pode desligar a expiração de advertências no /painel guild pela guia de \"🛑 Advertências\""
    } else
        embed.addFields({ name: "⠀", value: "⠀", inline: true })

    embed.addFields({ name: "⠀", value: "⠀", inline: true })
        .setFooter({
            text: texto_rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Criando os botões para o menu de advertências
    const row = client.create_buttons([
        { id: "warn_create", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${guild_member.id}` },
        { id: "warn_create", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0|${guild_member.id}` }
    ], interaction)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}