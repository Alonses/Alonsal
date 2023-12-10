module.exports = async ({ client, user, interaction }) => {

    let funcao = interaction.customId.split("|")[0] // Nome da função que será importada
    let dados = interaction.customId.split("|")[1] // Dados para a função
    const criador = dados.split(".")[0] // ID do criador do menu
    let autor_original = true

    const message = interaction, caso = "botao"
    await require('../data/ranking')({ client, message, caso })

    // Validando se o criador do menu é o mesmo usuário que interagiu com o menu
    if (criador !== interaction.user.id)
        autor_original = false

    if (funcao.includes("module") && !autor_original && funcao !== "module") // Funções de módulos
        return require('./chunks/modulos')({ client, user, interaction, autor_original })

    if (interaction.customId.split("|")[2]) // Dados extras
        dados = `${dados}.${interaction.customId.split("|")[2]}`

    // Solicitando a função e executando
    require(`./functions/buttons/${funcao}`)({ client, user, interaction, dados, autor_original })
}