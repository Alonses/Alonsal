module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    // Selecionando uma lista para visualizar as tarefas incluídas nela
    const lista_timestamp = dados.split(".")[1]
    const operador = `x|${lista_timestamp}`

    require('../../chunks/tarefas')({ client, user, interaction, operador, autor_original })
}