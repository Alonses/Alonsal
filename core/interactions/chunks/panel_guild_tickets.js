const { EmbedBuilder } = require("discord.js")

const { emoji_button, type_button } = require("../../functions/emoji_button")

module.exports = async ({ client, user, interaction }) => {

    const guild = await client.getGuild(interaction.guild.id)
    let botoes = [{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_guild.1" }]

    const embed = new EmbedBuilder()
        .setTitle(`> ${client.tls.phrase(user, "manu.painel.denuncias_server")} ${client.defaultEmoji("guard")}`)
        .setColor(client.embed_color(user.misc.color))
        .setDescription("```🧻 Como funciona\n\nAs denúncias in-server usam uma categoria separada para criar canais de denúncia de forma automática!\n\nOs membros do servidor poderão utilizar o comando /denuncia iniciar para abrir um canal visível apenas para os adms e o requisitante.\n\nPor padrão, os canais não são excluídos, mas o requisitante pode deixar de ver o canal de denúncias se desejar.```")
        .setFields(
            {
                name: `${emoji_button(guild?.conf.tickets)} **${client.tls.phrase(user, "mode.report.status")}**`,
                value: "⠀",
                inline: true
            },
            {
                name: `${client.defaultEmoji("channel")} **${client.tls.phrase(user, "util.server.categoria")}**`,
                value: `${client.emoji("icon_id")} \`${guild.tickets.category}\`\n( <#${guild.tickets.category}> )`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "manu.painel.rodape"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    botoes = botoes.concat([
        { id: "guild_tickets_button", name: client.tls.phrase(user, "manu.painel.denuncias_server"), type: type_button(guild?.conf.tickets), emoji: emoji_button(guild?.conf.tickets), data: "1" },
        { id: "guild_tickets_button", name: client.tls.phrase(user, "util.server.categoria"), type: 1, emoji: client.defaultEmoji("channel"), data: "2" }
    ])

    interaction.update({
        content: "",
        embeds: [embed],
        components: [client.create_buttons(botoes, interaction)],
        ephemeral: true
    })
}