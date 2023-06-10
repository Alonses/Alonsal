module.exports = async ({ client, user, interaction, dados }) => {

    // Códigos de operação
    // 0 -> Perfil
    // 1 -> Permissões
    // 2 -> Badges
    // 3 -> Histórico de reportes

    require('../../../formatadores/chunks/model_user_info')(client, user, interaction, dados)
}