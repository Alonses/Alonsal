module.exports = async ({ client, user, interaction, dados }) => {
    let operacao = dados.split(".")[1]
    let operador = "", autor_original = true

    if (interaction.user.id !== dados.split(".")[0])
        autor_original = false

    // Utilizado para navegar entre tarefas que foram acionadas por listas anteriomente
    if (dados.split(".").length === 3) {
        operacao = "tarefas"
        operador = `${dados.split(".")[1]}|${dados.split(".")[2]}`
    }

    // Utilizado para a paginação do painel guild
    if (dados.includes("panel_guild")) {
        operacao = dados.split(".")[1]
        operador = parseInt(dados.split(".")[2]) || 0
    }

    // Utilizado para retornar a cor customizada escolhida anteriormente
    if (dados.includes("static_color")) {
        const valor = dados.split(".")[2]
        return require('../../chunks/static_color')({ client, user, interaction, valor })
    }

    if (dados.includes("remove_report") || dados.includes("browse_user")) { // Utilizado para a paginação do painel de reportados do servidor
        const pagina = dados.split(".")[2]
        const operador = dados.split(".")[1]
        dados = `${interaction.user.id}.3`

        if (operador == "remove_report")
            return require(`../../chunks/remove_report`)({ client, user, interaction, dados, pagina })

        return require(`./${operador}`)({ client, user, interaction, dados, pagina })
    }

    require(`../../chunks/${operacao}`)({ client, user, interaction, operador, autor_original })
}