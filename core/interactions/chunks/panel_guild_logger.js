const { EmbedBuilder } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")
const { languagesMap } = require("../../formatters/translate")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.0" }]
    const idioma = guild.lang !== "al-br" ? `:flag_${guild.lang.slice(3, 5)}:` : ":pirate_flag:"

    const eventos = {
        total: 0,
        ativos: 0
    }

    Object.keys(guild.logger).forEach(evento => {
        if (evento !== "channel") {
            if (guild.logger[evento])
                eventos.ativos++ // Apenas eventos ativos

            eventos.total++
        }
    })

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.log_eventos")} :scroll:`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```🧻 Funcionamento do log de eventos\n\nO Log de eventos do servidor registra os eventos diversos que são vistos pelo registro de auditoria de forma mais dinâmica!\n\nAtravés dos eventos ouvidos, é possível definir quais eventos eu poderei avisar através do canal (escolhido abaixo) quando ocorrer!\n\nPor padrão, o mesmo canal do log de eventos será usado para eventos considerados como spam, utilizados pelo módulo do Anti-spam.```")
        .setFields(
            {
                name: `${emoji_button(guild?.conf.logger)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: `${idioma} **${client.tls.phrase(user, "mode.anuncio.idioma")}**`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("telephone")} **${client.tls.phrase(user, "mode.logger.eventos_ouvidos")}**`,
                value: `\`${eventos.ativos} / ${eventos.total}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "mode.report.canal_de_avisos")}**`,
                value: `${client.emoji("icon_id")} \`${guild.logger.channel}\`\n( <#${guild.logger.channel}> )`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_logger_button", name: client.tls.phrase(user, "manu.painel.log_eventos"), type: type_button(guild?.conf.logger), emoji: emoji_button(guild?.conf.logger), data: "1" },
        { id: "guild_logger_button", name: client.tls.phrase(user, "mode.logger.eventos_ouvidos"), type: 1, emoji: client.defaultEmoji("telephone"), data: "2" },
        { id: "guild_logger_button", name: client.tls.phrase(user, "mode.report.canal_de_avisos"), type: 1, emoji: client.defaultEmoji("channel"), data: "3" },
        { id: "guild_logger_button", name: client.tls.phrase(user, "mode.anuncio.idioma"), type: 1, emoji: languagesMap[guild.lang.slice(0, 2)][3], data: "4" }
    ])

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}