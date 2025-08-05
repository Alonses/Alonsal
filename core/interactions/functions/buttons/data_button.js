const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1]) || dados

    // Códigos de operação
    // 1 -> Exclusão personalizada
    // 2 -> Exclusão por níveis
    // 3 -> Remover todos os dados do usuário

    const data = {
        title: { tls: "menu.menus.escolher_tipo_dado" },
        pattern: "data_browse",
        alvo: "dados_navegar",
        values: []
    }

    if (operacao === 1 || operacao === "uni")
        for (let i = 1; i < 10; i++)
            data.values.push(`uni.${i}`)
    else if (operacao === 2 || operacao === "combo")
        for (let i = 1; i < 7; i++)
            data.values.push(`combo.${i}`)

    if (operacao === 3) {

        const embed = new EmbedBuilder()
            .setTitle(`> ${client.tls.phrase(user, "manu.data.dados_salvos")} ${client.defaultEmoji("person")}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.tls.phrase(user, "manu.data.descricao_tempo_inatividade"))

        const row = [
            { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "data" },
            { id: "data_confirm_button", name: { tls: "menu.botoes.confirmar", alvo: user }, type: 2, emoji: client.emoji(10), data: "3" },
            { id: "data_confirm_button", name: { tls: "menu.botoes.cancelar", alvo: user }, type: 3, emoji: client.emoji(0), data: "0" }
        ]

        return client.reply(interaction, {
            content: "",
            embeds: [embed],
            components: [client.create_buttons(row, interaction)],
            flags: "Ephemeral"
        })
    }

    const row = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "dados_navegar" }
    ], interaction)

    interaction.update({
        content: client.tls.phrase(user, "manu.data.tipo_dado"),
        embeds: [],
        components: [client.create_menus({ interaction, user, data }), row],
        flags: "Ephemeral"
    })
}