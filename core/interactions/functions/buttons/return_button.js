module.exports = async ({ client, user, interaction, dados }) => {
    let operacao = dados.split(".")[1]
    let operador = "", autor_original = true, pagina_guia = 0

    if (interaction.user.id !== dados.split(".")[0])
        autor_original = false

    // Utilizado para navegar entre tarefas que foram acionadas por listas anteriomente
    if (dados.split(".").length === 3) {
        operacao = "tarefas"
        operador = `${dados.split(".")[1]}|${dados.split(".")[2]}`
    }

    // Utilizado para a paginação do painel guild
    if (dados.includes("panel_guild")) {
        operador = null
        operacao = dados.split(".")[1]
        pagina_guia = parseInt(dados.split(".")[2])
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

        if (operador == "remove_report") // Outro endpoint
            return require('./report_remove_user')({ client, user, interaction, dados, pagina })

        return require(`./${operador}`)({ client, user, interaction, dados, pagina })
    }

    require(`../../chunks/${operacao}`)({ client, user, interaction, pagina_guia, operador, autor_original })
}