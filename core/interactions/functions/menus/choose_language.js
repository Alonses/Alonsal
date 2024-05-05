const { languagesMap } = require('../../../formatters/patterns/user')

module.exports = async ({ client, user, interaction, dados }) => {

    // Alterando o idioma do usuário para a nova escolha
    user.lang = languagesMap[dados][0]
    await user.save()

    // Redirecionando o evento
    require('../../chunks/browse_help')({ client, user, interaction })
}