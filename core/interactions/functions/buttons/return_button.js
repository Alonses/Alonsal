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
        operacao = "panel_guild"
        operador = parseInt(dados.split(".")[2])
    }

    // Utilizado para retornar a cor customizada escolhida anteriormente
    if (dados.includes("static_color")) {
        const valor = dados.split(".")[2]
        return require('../../chunks/static_color')({ client, user, interaction, valor })
    }

    if (dados.includes("remove_report")) { // Utilizado para a paginação do painel de reportados do servidor
        const pagina = dados.split(".")[2]
        dados = `${interaction.user.id}.3`

        return require('./report_remove_user')({ client, user, interaction, dados, pagina })
    }

    require(`../../chunks/${operacao}`)({ client, user, interaction, operador, autor_original })
}