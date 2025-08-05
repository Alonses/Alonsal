const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

function create_buttons(client, lista, interaction) {

    const row_buttons = new ActionRowBuilder()
    const tipos = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger, ButtonStyle.Link] // Tipos de botão disponíveis

    // Cores de botões
    // 0 -> Azul
    // 1 -> Cinza
    // 2 -> Verde
    // 3 -> Vermelho
    // 4 -> Cinza ( link )

    // Passando pelo array de botões e criando novos
    lista.forEach(dados => {

        let texto

        if (dados.name?.tls) texto = client.tls.phrase(dados.name.alvo, dados.name.tls) // Traduzindo o texto do botão
        else texto = dados.name // Utilizando os nome sem tradução

        dados.name = texto.length > 25 ? `${texto.slice(0, 25)}...` : texto

        const botao = new ButtonBuilder()
            .setLabel(dados.name)
            .setStyle(tipos[dados.type])

        if (dados.type === 4) // Botão de link
            botao.setURL(dados.value)
        else {
            if (dados.data) // Botão normal com dados anexados
                botao.setCustomId(`${dados.id}|${interaction?.user?.id || interaction}.${dados.data}`)
            else // Botão normal sem dados anexados
                botao.setCustomId(`${dados.id}|${interaction?.user?.id || interaction}`)
        }

        if (dados.emoji) // Botão com emoji declarado
            botao.setEmoji(dados.emoji || "👻")

        if (dados.disabled) // Botão com click desativado
            botao.setDisabled(dados.disabled)

        row_buttons.addComponents(botao)
    })

    return row_buttons
}

module.exports.create_buttons = create_buttons