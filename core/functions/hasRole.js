/**
 * Verifica se o membro do servidor possui o cargo informado
 * @param {object} data - possui as chaves id_user, role_id e interaction
 * @returns {boolean} Verdadeiro se possuir o cargo, falso se não possuir
 */
module.exports = async ({ client, data }) => {

    const { id_user, id_role, interaction } = data

    // Verificando se o usuário possui o cargo informado
    const user_member = await client.execute("getMemberGuild", { interaction, id_user })
    if (user_member.roles.cache.has(id_role)) return true
    return false
}