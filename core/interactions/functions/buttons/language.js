const { languagesMap } = require("../../../formatters/patterns/user")

module.exports = async ({ client, user, interaction, dados }) => {

    const idiomas = []

    Object.keys(languagesMap).forEach(language => {
        idiomas.push(`${language}.${languagesMap[language][2]}.${languagesMap[language][3]}`)
    })

    const data = {
        title: { tls: "Choose a language!" },
        pattern: "choose_language",
        alvo: "choose_language",
        values: idiomas
    }

    // Botão para retornar até a tela principal do help
    let row = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "browse_help" }
    ], interaction, user)

    interaction.update({
        components: [client.create_menus({ interaction, user, data }), row],
        flags: "Ephemeral"
    })
}