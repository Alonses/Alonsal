const { EmbedBuilder } = require('discord.js')

const { getUserWarns } = require('../../database/schemas/Warns')

module.exports = async ({ client, user, interaction, guild, guild_member, guild_executor, bot_member }) => {

    const user_warns = await getUserWarns(guild_member.id, interaction.guild.id)
    const descricao_warn = interaction.options.getString("reason")

    // Salvando os dados do usuário
    user_warns.relatory = descricao_warn
    user_warns.nick = guild_member.user.username
    user_warns.timestamp = client.timestamp()

    await user_warns.save()

    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.warn.criando_advertencia")} :inbox_tray:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription(client.replace(client.tls.phrase(user, "mode.warn.descricao_inclusao_warn"), descricao_warn))
        .addFields(
            {
                name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                value: `${client.emoji("icon_id")} \`${guild_member.id}\`\n( <@${guild_member.id}> )`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportador")}**`,
                value: `${client.emoji("icon_id")} \`${guild_executor.id}\`\n( <@${guild_executor.id}> )`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
        .addFields(
            {
                name: `${client.emoji(47)} **${client.tls.phrase(user, "mode.warn.advertencias_em_registro")}**`,
                value: `\`( ${user_warns.total} + 1 ) / ${guild.warn.cases}\``,
                inline: true
            },
            {
                name: `${client.emoji("banidos")} **${client.tls.phrase(user, "mode.warn.penalidade_server")}**`,
                value: `\`${client.tls.phrase(user, `menu.events.${guild.warn.action}`)}\`${client.guildAction(guild, user)}`,
                inline: true
            },
            { name: "⠀", value: "⠀", inline: true }
        )
        .setFooter({
            text: client.tls.phrase(user, "mode.warn.rodape_penalidade"),
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