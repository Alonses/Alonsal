module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    // Códigos de operação
    // 0 -> Perfil
    // 1 -> Permissões
    // 2 -> Badges
    // 3 -> Histórico de reportes

    require('../../../formatters/chunks/model_user_info')({ client, user, interaction, dados, autor_original })
}