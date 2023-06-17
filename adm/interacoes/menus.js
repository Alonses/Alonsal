module.exports = async ({ client, user, interaction }) => {

    let funcao = interaction.values[0].split("|")[0] // Nome da função que será importada
    let dados = interaction.values[0].split("|")[1] // Dados para a função
    const criador = dados.split(".")[0] // ID do criador do menu

    // Validando se o criador do menu é o mesmo usuário que interagiu com o menu
    if (criador !== interaction.user.id)
        return client.tls.reply(interaction, user, "menu.menus.criador_menu", true, 7)

    // Reutilizando a função de exibir tarefas
    if (funcao === "tarefas")
        funcao = "tarefa_visualizar"

    // Enviando todas as funções de menus de sons para um único arquivo
    if (funcao === "norbit" || funcao === "faustop" || funcao === "galerito") {
        dados = `${funcao}|${dados}`
        funcao = "frases"
    }

    // Solicitando a função e executando
    require(`./functions/menus/${funcao}`)({ client, user, interaction, dados })

    const message = interaction, caso = "menu"
    await require('../data/ranking')({ client, message, caso })
}