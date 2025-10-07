module.exports = async ({ client, user, interaction }) => {

    // Extraindo dados do customId
    const [funcao, dadosRaw, extra] = interaction.customId.split("|")
    let dados = dadosRaw

    const criador = dadosRaw?.split(".")[0] || ''
    const autor_original = criador === interaction.user.id

    // Registrando experiência recebida pelo usuário
    client.registryExperience(interaction, "botao")

    // Funções de módulos
    if (funcao.includes("module") && funcao !== "module_button" && funcao !== "module_config" && funcao !== "module_history_button") {
        try {
            return require('./chunks/modulos')({ client, user, interaction })
        } catch (error) {
            console.error('Erro ao importar módulo:', error)
            return
        }
    }

    // Dados extras
    if (extra) dados = `${dados}.${extra}`

    // Botões que retornam para paineis principais
    if (funcao.includes("chunks_")) {
        try {
            return require(`./chunks/${funcao.replace("chunks_", "")}`)({ client, user, interaction })
        } catch (error) {
            console.error('Erro ao executar o chunk:', error)
            return
        }
    }

    // Redirecionando a função e executando
    try {
        require(`./functions/buttons/${funcao}`)({ client, user, interaction, dados, autor_original })
    } catch (error) {
        console.error(`Erro ao importar função de botão '${funcao}':`, error)
    }
}