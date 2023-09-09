const { EmbedBuilder } = require("discord.js")

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Informações
    // 1 -> Funções

    let row
    const embed = new EmbedBuilder()
        .setTitle("> Selecione uma operação")
        .setColor(0x29BB8E)
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
            { id: "button_conf_panel", name: "Resumo diário", type: 1, emoji: client.defaultEmoji("paper"), data: "z|journal" },
            { id: "button_conf_panel", name: "RAM", type: 1, emoji: client.emoji("ds_slash_command"), data: "z|ram" },
            { id: "button_conf_panel", name: "Emojis", type: 1, emoji: client.emoji("emojis_dancantes"), data: "z|emojis" },
            { id: "button_conf_panel", name: "Status da APISAL", type: 1, emoji: client.emoji(38), data: "z|apisal" }
        ], interaction)
    else
        row = client.create_buttons([
            { id: "return_button", name: "Retornar", type: 0, emoji: client.emoji(19), data: "panel_geral" },
            { id: "button_conf_panel", name: "Sincronizar Idioma", type: 1, emoji: client.emoji(37), data: "z|update_language" },
            { id: "button_conf_panel", name: "Enviar jogos gratuitos", type: 1, emoji: client.emoji(29), data: "z|send_announce" }
        ], interaction)

    interaction.update({
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}