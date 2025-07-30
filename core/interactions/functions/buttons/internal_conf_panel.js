const { EmbedBuilder } = require("discord.js")

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Informações
    // 1 -> Funções

    let row, botoes
    const embed = new EmbedBuilder()
        .setTitle("> Selecione uma operação")
        .setColor(client.embed_color("turquesa"))
        .setFooter({
            text: "Selecione uma das opções abaixo para navegar",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Interação gerada por um botão de endpoint
    if (dados.includes("z")) {
        const endpoint = dados.split(".")[2]
        return require(`../../internal/${endpoint}`)({ client, user, interaction })
    }

    if (operacao === 0)
        row = client.create_buttons([
            { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" },
            { id: "internal_conf_panel", name: "Resumo diário", type: 1, emoji: client.defaultEmoji("paper"), data: "z|journal" },
            { id: "internal_conf_panel", name: "RAM", type: 1, emoji: client.emoji("ds_slash_command"), data: "z|ram" },
            { id: "internal_conf_panel", name: "Emojis", type: 1, emoji: client.emoji("emojis_dancantes"), data: "z|emojis" }
        ], interaction)
    else if (operacao === 1) {

        // Listandos os recursos ativos globais do bot
        const bot = await client.getBot()

        embed.addFields(
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", bot.conf.ranking)} **Rankeamento**`,
                value: `\`\`\`Operações de ranking de membros.\`\`\``,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", bot.conf.voice_channels)} **Faladeros dinâmicos**`,
                value: `\`\`\`Operações de canais de voz dinâmicos.\`\`\``,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", bot.conf.modules)} **Módulos**`,
                value: `\`\`\`Operações de módulos customizados.\`\`\``,
                inline: true
            },
            {
                name: `${client.execute("functions", "emoji_button.emoji_button", bot.conf.logger)} **Log de eventos**`,
                value: `\`\`\`Operações do log de eventos dos servidores.\`\`\``,
                inline: true
            }
        )

        botoes = client.create_buttons([
            { id: "internal_switch", name: "Rankeamento", type: bot.conf.ranking ? 2 : 1, emoji: client.execute("functions", "emoji_button.emoji_button", bot.conf.ranking), data: "ranking" },
            { id: "internal_switch", name: "Faladeros", type: bot.conf.voice_channels ? 2 : 1, emoji: client.execute("functions", "emoji_button.emoji_button", bot.conf.voice_channels), data: "voice_channels" },
            { id: "internal_switch", name: "Módulos", type: bot.conf.modules ? 2 : 1, emoji: client.execute("functions", "emoji_button.emoji_button", bot.conf.modules), data: "modules" },
            { id: "internal_switch", name: "Log de eventos", type: bot.conf.logger ? 2 : 1, emoji: client.execute("functions", "emoji_button.emoji_button", bot.conf.logger), data: "logger" }
        ])

        row = client.create_buttons([
            { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" },
            { id: "internal_conf_panel", name: "Sincronizar Idioma", type: 1, emoji: client.emoji(37), data: "z|update_language" },
            { id: "internal_conf_panel", name: "Enviar jogos gratuitos", type: 1, emoji: client.emoji(29), data: "z|send_announce" }
        ], interaction)
    } else
        row = client.create_buttons([
            { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" },
            { id: "internal_conf_panel", name: "Status da APISAL", type: 1, emoji: client.emoji(38), data: "z|apisal" },
            { id: "internal_conf_panel", name: "Status de Reportes", type: 1, emoji: client.defaultEmoji("guard"), data: "z|reports" }
        ], interaction)

    const obj = {
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    }

    if (botoes) // Botões de função inclusos
        obj.components.unshift(botoes)

    interaction.update(obj)
}