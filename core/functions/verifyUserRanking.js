module.exports = async ({ client, data }) => {

    // Valida se o usuário possui ranking ativo
    const id_user = data.id_user

    let user = await client.execute("getUser", { id_user })
    let user_ranking = true

    if (typeof user.conf.ranking !== "undefined") user_ranking = user.conf.ranking

    return user_ranking
}