module.exports = async ({ client, user, interaction, dados }) => {
    let operacao = dados.split(".")[1]
    let operador = ""

    // Utilizado para navegar entre tarefas que foram acionadas por listas anteriomente
    if (dados.split(".").length === 3) {
        operacao = "tarefas"
        operador = `${dados.split(".")[1]}|${dados.split(".")[2]}`
    }

    require(`../../chunks/${operacao}`)({ client, user, interaction, operador })
}