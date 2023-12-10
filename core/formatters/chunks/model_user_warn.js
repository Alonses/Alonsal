const { EmbedBuilder } = require('discord.js')

const { getUserWarns } = require('../../database/schemas/Warns')
const { spamTimeoutMap } = require("../../database/schemas/Strikes")

module.exports = async ({ client, user, interaction, guild, guild_member, guild_executor }) => {

    const user_warns = await getUserWarns(guild_member.id, interaction.guild.id)
    const descricao_warn = interaction.options.getString("reason")
    let penalidades_server = "", texto_rodape = client.tls.phrase(user, "mode.warn.rodape_penalidade"), info_advertencia

    // Salvando os dados do usuário
    user_warns.relatory = descricao_warn
    user_warns.nick = guild_member.user.username
    user_warns.timestamp = client.timestamp()

    await user_warns.save()

    // Penalidades do servidor
    if (guild.warn.progressive) {
        penalidades_server = `${client.emoji("dancando_mod")} **Por advertência:**\n\`${client.tls.phrase(user, `menu.events.${guild.warn.warned}`)}\`\n`
        texto_rodape = "Uma penalidade será aplicada ao membro caso confirma essa inclusão!"
    }

    if ((user_warns.total + 1) >= guild.warn.cases)
        info_advertencia = `Essa advertência resultará em "${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}".`
    else if (guild.warn.progressive)
        info_advertencia = `Essa advertência resultará em "${client.tls.phrase(user, `menu.events.${guild.warn.warned}`)}".`
    else
        info_advertencia = `Essa advertência não terá penalidades para o membro.`

    info_advertencia = `\`\`\`fix\n${info_advertencia}\`\`\``

    if (guild.warn.timed) // Servidor com tempo definido para remoção da advertência
        info_advertencia += `\n${client.defaultEmoji("time")} | Essa advertência será removida de forma automática <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:R>!\n( <t:${client.timestamp() + spamTimeoutMap[guild.warn.reset]}:f> )\nVocê pode desligar a remoção de advertências automática no </panel guild:1107163338930126869> pela guia de \`🛑 Advertências\``

    penalidades_server += `${client.emoji("banidos")} **Final:**\n\`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\``

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.warn.criando_advertencia")} :inbox_tray:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`${client.replace(client.tls.phrase(user, "mode.warn.descricao_inclusao_warn"), descricao_warn)}${info_advertencia}`)
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
                value: `\`( ${user_warns.total} + 1 ) / ${guild.warn.cases}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: `${client.emoji("banidos")} **Penalidades**`,
                value: penalidades_server,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **Tempos**`,
                value: `${client.defaultEmoji("time")} **Mute:** \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.timeout]}`)}\`\n:wastebasket: **Cronometrado:** \`${client.tls.phrase(user, `menu.times.${spamTimeoutMap[guild.warn.reset]}`)}\``,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
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