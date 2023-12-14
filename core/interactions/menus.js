module.exports = async ({ client, user, interaction }) => {

    let funcao = interaction.values[0].split("|")[0] // Nome da função que será importada
    let dados = interaction.values[0].split("|")[1] // Dados para a função
    const criador = dados.split(".")[0] // ID do criador do menu
    let autor_original = true

    // Experiência recebida pelo usuário
    client.registryExperience(interaction, "menu")

    // Validando se o criador do menu é o mesmo usuário que interagiu com o menu
    if (criador !== interaction.user.id)
        autor_original = false

    if (funcao === "modules_browse" && !autor_original) // Funções de módulos
        return require('./chunks/modulos')({ client, user, interaction, autor_original })

    if (funcao === "tarefas") // Reutilizando a função de exibir tarefas
        funcao = "tarefa_visualizar"

    // Enviando todas as funções de menus de sons para um único arquivo
    if (funcao === "norbit" || funcao === "faustop" || funcao === "galerito") {
        dados = `${funcao}|${dados}`
        funcao = "frases"
    }

    // Solicitando a função e executando
    require(`./functions/menus/${funcao}`)({ client, user, interaction, dados, autor_original })
}