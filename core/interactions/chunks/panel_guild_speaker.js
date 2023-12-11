const { EmbedBuilder } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.2" }]

    const canais_limitados = guild.speaker.channels ? `${guild.speaker.channels.split(";").length} canais permitidos` : 'nenhum canal selecionado';

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.alonsal_falador")} ${client.emoji(52)}`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```🧻 Como funciona\n\nO Alon falador é um recurso que poder ser usado para conversar com o bot através do servidor de forma dinâmica, os retornos que ele te mostrará não são filtrados, sendo assim, nós não temos controle do que ele dirá!\n\nVocê pode limitar esse recurso para funcionar em apenas alguns canais, ou ativar no servidor inteiro!```")
        .setFields(
            {
                name: `${emoji_button(guild?.conf.conversation)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${emoji_button(guild?.speaker.regional_limit)} **Limitar canais**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "util.server.canais")}**`,
                value: `${client.defaultEmoji("metrics")} \`${canais_limitados}\``,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_speaker_button", name: client.tls.phrase(user, "manu.painel.alonsal_falador"), type: type_button(guild?.conf.conversation), emoji: emoji_button(guild?.conf.conversation), data: "1" },
        { id: "guild_speaker_button", name: "Limitar canais", type: type_button(guild?.speaker.regional_limit), emoji: emoji_button(guild?.speaker.regional_limit), data: "2" },
        { id: "guild_speaker_button", name: "Canais de conversação", type: 1, emoji: client.defaultEmoji("channel"), data: "3" }
    ])

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}