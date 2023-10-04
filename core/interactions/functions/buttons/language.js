const { languagesMap } = require("../../../formatters/translate")

module.exports = async ({ client, user, interaction, dados }) => {

    const idiomas = []

    Object.keys(languagesMap).forEach(language => {
        idiomas.push(`${language}.${languagesMap[language][2]}.${languagesMap[language][3]}`)
    })

    const data = {
        alvo: "choose_language",
        values: idiomas
    }

    // Botão para retornar até a tela principal do help
    let row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "browse_help" }
    ], interaction)

    interaction.update({
        components: [client.create_menus(client, interaction, user, data), row],
        ephemeral: true
    })
}