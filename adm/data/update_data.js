function update_data(user) {

    if (user.badges)
        delete user.badges

    if (user.conquistas)
        delete user['conquistas']

    if (user.misc?.ghost_mode)
        delete user['misc']['ghost_mode']

    return user
}

function clear_data(user, value) {

    // Atualizando os dados do usuário
    user = update_data(user)

    // Limpa os dados conforme o nível de escolha do usuário
    for (let i = value; i > 0; i--) {

        if (i == 1) {
            user.social.steam = null
            user.social.lastfm = null
            user.social.pula_predios = null
        }

        if (i == 2) {
            user.misc.locale = null
        }

        if (i == 3) {
            user.social.steam = null
            user.social.lastfm = null
            user.social.pula_predios = null
        }
    }
}

module.exports = {
    clear_data,
    update_data
}