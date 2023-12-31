const { EmbedBuilder } = require('discord.js')

const { loggerMap } = require("../../database/schemas/Guild")
const { spamTimeoutMap } = require("../../database/schemas/Strikes")

const { getUserWarns } = require('../../database/schemas/Warns')
const { listAllGuildWarns } = require('../../database/schemas/Warns_guild')

module.exports = async ({ client, user, interaction, guild, user_warns, guild_member, guild_executor }) => {

    const descricao_warn = interaction.options.getString("reason")
    const guild_warns = await listAllGuildWarns(interaction.guild.id)
    let texto_rodape = "⠀"

    // Salvando os dados do usuário
    user_warns.relatory = descricao_warn
    user_warns.nick = guild_member.user.username
    user_warns.timestamp = client.timestamp()
    await user_warns.save()

    // Verificando se existem advertências para as próximas punições do usuário
    let indice_warn = user_warns.total + 1

    if (!guild_warns[user_warns.total + 1])
        indice_warn = guild_warns.length - 1

    let indice_matriz = client.verifyGuildWarns(guild_warns) // Indice marcador do momento de expulsão/banimento do membro pelas advertências

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.warn.criando_advertencia")} :inbox_tray:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${client.replace(client.tls.phrase(user, "mode.warn.descricao_inclusao_warn"), descricao_warn)}`)
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${guild_member.id}\`\n\`${user_warns.nick}\`\n( <@${guild_member.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${guild_executor.id}\`\n\`${guild_executor.user.username}\`\n( <@${guild_executor.id}> )`,
                inline: true
            },
            {
                name: `${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.advertencias_em_registro")}**`,
                value: `\`( ${user_warns.total + 1} + 1 ) / ${indice_matriz}\``,
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