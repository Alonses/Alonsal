const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1]) || dados

    // Códigos de operação
    // 1 -> Exclusão personalizada
    // 2 -> Exclusão por níveis
    // 3 -> Remover todos os dados do usuário

    const data = {
        title: client.tls.phrase(user, "manu.data.escolher_opcoes"),
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
            .setTitle(`> Dados salvos de você ${client.defaultEmoji("person")}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription("Todos os seus dados serão marcados para exclusão.\n\nApós a confirmação, o Alonsal irá mover seus dados para uma quarentena de 14 dias, e após isso, todos os dados relacionados a você serão removidos de nossa base de dados.\n\nAntes do prazo se expirar, você deverá usar um comando nosso novamente para evitar que seus dados sejam removidos.\n\nPor padrão, todos os usuários possuem um tempo de inatividade que aciona essa funcionalidade de expiração, caso deseje manter seus dados por mais tempo, considere retornar e aumentar o tempo de inatividade.")

        const row = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "data" },
            { id: "data_confirm_button", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: "3" },
            { id: "data_confirm_button", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: "0" }
        ]

        return client.reply(interaction, {
            content: "",
            embeds: [embed],
            components: [client.create_buttons(row, interaction)],
            ephemeral: true
        })
    }

    const row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "dados_navegar" }
    ], interaction)

    interaction.update({
        content: data.title,
        embeds: [],
        components: [client.create_menus({ client, interaction, user, data }), row],
        ephemeral: true
    })
}