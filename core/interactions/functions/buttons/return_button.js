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

    if (dados.includes("remove_report") || dados.includes("remove_warn") || dados.includes("browse_user")) { // Utilizado para a paginação do painel de reportados do servidor
        const pagina = dados.split(".")[2]
        const operador = dados.split(".")[1]
        dados = `${interaction.user.id}.3`

        if (operador == "remove_report") // Outro endpoint ( menu para escolher usuários reportados )
            return require('./report_remove_user')({ client, user, interaction, dados, pagina })

        if (operador === "remove_warn") // Outro endpoint ( menu para escolher usuários com advertências )
            return require('./warn_remove_user')({ client, user, interaction, dados, pagina })

        return require(`./${operador}`)({ client, user, interaction, dados, pagina })
    }

    if (dados.includes("verify_module")) { // Utilizado para retornar a guia de visualização do módulo
        dados = `${interaction.user.id}.${dados.split(".")[2]}`
        return require('../../chunks/verify_module')({ client, user, interaction, dados })
    }

    require(`../../chunks/${operacao}`)({ client, user, interaction, pagina_guia, operador, autor_original })
}