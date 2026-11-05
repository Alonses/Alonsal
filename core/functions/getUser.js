const { getEncryptedUser } = require("../database/schemas/User")

module.exports = async ({ client, data }) => {

    if (!data?.id_user) return

    // Aceita tanto o ID original quanto o já criptografado
    const id_user = data.id_user.startsWith("d.") ? data.id_user : client.encrypt(data.id_user)

    return getEncryptedUser(id_user)
}