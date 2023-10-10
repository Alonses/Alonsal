module.exports = async ({ client, user, interaction, dados }) => {

    // Relação de eventos
    // 0 -> Página anterior
    // 1 -> Próxima página
    const operacao = parseInt(dados.split(".")[1])
    let pagina = parseInt(dados.split(".")[2])
    const reback = dados.split(".")[4]

    // Dados da operação escolhida
    dados = `${interaction.user.id}.${dados.split(".")[3]}`
    pagina = operacao ? pagina + 1 : pagina - 1

    // Redirecionando o evento
    require(`./${reback}`)({ client, user, interaction, dados, pagina })
}