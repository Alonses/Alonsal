module.exports = async ({ client, user, interaction, dados }) => {

    // Relação de eventos
    // 0 -> Página anterior
    // 1 -> Próxima página
    const operacao = parseInt(dados.split(".")[1])
    let pagina = parseInt(dados.split(".")[2])
    let reback = dados.split(".")[4]

    const cached = dados

    // Dados da operação escolhida
    dados = `${interaction.user.id}.${dados.split(".")[3]}`
    pagina = operacao ? pagina + 1 : pagina - 1

    // Utilizado para navegar pelos menus de cargos
    if (cached.includes("x/")) {
        dados += `.${cached.split("x/")[1]}`
        reback = reback.split("x/")[0]
    }

    // Redirecionando o evento
    require(`./${reback}`)({ client, user, interaction, dados, pagina })
}