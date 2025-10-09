module.exports = async ({ client, user, interaction }) => {
    // Extrai dados do menu
    let funcao, dados, criador

    if (interaction.isStringSelectMenu()) {
        // Menus de seleção baseados em textos
        const [fn, dt] = interaction.values[0].split("|")
        funcao = fn
        dados = dt
        criador = dt?.split(".")[0] || ''
    } else {
        // Menus de seleção baseados em usuários
        const [fn, cr] = interaction.customId.split("|")
        funcao = fn
        dados = interaction.values
        criador = cr
    }

    // Registrando experiência recebida pelo usuário
    client.registryExperience(interaction, "menu")

    // Verifica se o criador do menu é o mesmo usuário que ativou a interação
    const autor_original = client.decifer(criador) === interaction.user.id

    // Funções de módulos
    if (funcao === "modules_browse" && !autor_original) {
        try {
            return require('./chunks/modulos')({ client, user, interaction, autor_original })
        } catch (error) {
            console.error('🛑 | Erro ao importar módulo:', error)
            return
        }
    }

    // Reutilizando a função de exibir tarefas
    if (funcao === "tarefas") funcao = "tarefa_visualizar"

    // Enviando todas as funções de menus de sons para um único arquivo
    if (["norbit", "faustop", "galerito"].includes(funcao)) {
        dados = `${funcao}|${dados}`
        funcao = "frases"
    }

    // Acionado ao utilizar comando em DM
    const user_command = interaction.guild ? 0 : 1

    // Solicitando a função e executando
    try {
        require(`./functions/menus/${funcao}`)({ client, user, interaction, dados, autor_original, user_command })
    } catch (error) {
        console.error(`🛑 | Erro ao importar função de menu '${funcao}':`, error)
    }
}