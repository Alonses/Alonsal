module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    // Códigos de operação
    // 0 -> Geral
    // 1 -> Cargos
    // 2 -> Estatísticas

    // Redirecionando o evento
    require('../../../formatters/chunks/model_server_info')({ client, user, interaction, dados, autor_original })
}