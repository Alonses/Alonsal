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

    // Utilizado para retornar a cor customizada escolhida anteriormente
    if (dados.split(".")[1] === "static_color") {
        const valor = dados.split(".")[2]
        return require('../../chunks/static_color')({ client, user, interaction, valor })
    }

    require(`../../chunks/${operacao}`)({ client, user, interaction, operador, autor_original })
}