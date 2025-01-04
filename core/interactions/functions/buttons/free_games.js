module.exports = async ({ client, user, interaction, dados }) => {

    const operador = parseInt(dados.split(".")[1])
    let pagina_guia = parseInt(dados.split(".")[2])

    operador === 1 ? pagina_guia++ : pagina_guia = 0

    // Redirecionando o evento
    require('../../../formatters/chunks/model_free_games')({ client, user, interaction, pagina_guia })
}