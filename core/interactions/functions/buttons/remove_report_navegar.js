module.exports = async ({ client, user, interaction, dados }) => {

    let pagina = parseInt(dados.split(".")[2])
    const operacao = parseInt(dados.split(".")[1])

    if (operacao)
        pagina++
    else
        pagina--

    require('../../chunks/remove_report')({ client, user, interaction, pagina })
}