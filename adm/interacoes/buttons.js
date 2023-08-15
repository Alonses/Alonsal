module.exports = async ({ client, user, interaction }) => {

    let funcao = interaction.customId.split("|")[0] // Nome da função que será importada
    let dados = interaction.customId.split("|")[1] // Dados para a função
    const criador = dados.split(".")[0] // ID do criador do menu

    // Validando se o criador do menu é o mesmo usuário que interagiu com o menu
    if (criador !== interaction.user.id && funcao !== "vote_button")
        return client.tls.reply(interaction, user, "menu.menus.criador_botoes", true, 7)

    // Dados extras
    if (interaction.customId.split("|")[2])
        dados = `${dados}.${interaction.customId.split("|")[2]}`

    // Solicitando a função e executando
    require(`./functions/buttons/${funcao}`)({ client, user, interaction, dados })

    const message = interaction, caso = "botao"
    await require('../data/ranking')({ client, message, caso })
}