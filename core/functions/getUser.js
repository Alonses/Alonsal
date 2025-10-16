const { getUser, getEncryptedUser } = require("../database/schemas/User")

module.exports = async ({ client, data }) => {

    if (!data?.id_user) return

    let id_user = data.id_user
    const cript_user_id = client.encrypt(id_user)
    let user = await getUser(id_user)

    if (user && id_user.length < 20) {

        // Criptografando outros dados sensíveis do usuário
        user.uid = cript_user_id

        if (user.nick)
            user.nick = client.encrypt(user.nick)

        if (user.profile.avatar)
            user.profile.avatar = client.encrypt(user.profile.avatar)

        if (user?.misc.locale > 0)
            user.misc.locale = client.encrypt(user.misc.locale)

        if (user?.social.steam > 0)
            user.social.steam = client.encrypt(user.social.steam)

        if (user?.social.lastfm > 0)
            user.social.lastfm = client.encrypt(user.social.lastfm)

        if (user?.profile.about > 0)
            user.profile.about = client.encrypt(user.profile.about)

        user.save()
    } else { // ID já criptografado

        if (id_user.length < 20)
            id_user = cript_user_id

        user = await getEncryptedUser(id_user)
    }

    return user
}