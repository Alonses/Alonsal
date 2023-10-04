module.exports = async ({ client, user, interaction, dados }) => {

    const caso = dados.split(".")[1]

    // Redirecionando o evento com a nova janela
    require('../../chunks/browse_info')({ client, user, interaction, caso })
}