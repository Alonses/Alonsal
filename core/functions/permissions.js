module.exports = async ({ client, data }) => {

    // Verifica se o membro informado possui as permissões listadas no servidor ou canal
    const interaction = data?.interaction || data?.message
    const id_user = data.id_user
    const permissao = data.permissions
    const canal = data?.canal || null

    if (interaction) {

        // Permissões do usuário no servidor
        const membro_sv = await client.execute("getMemberGuild", { interaction, id_user })

        if (!membro_sv) return false // Membro não localizado

        // Verificando se o usuário possui a permissão
        if (membro_sv.permissions.has(permissao)) return true
    } else // Permissões em canais específicos
        if (canal.channel) {
            if (canal.channel.permissionsFor(id_user).has(permissao)) return true
        } else if (canal.permissionsFor(id_user)?.has(permissao)) return true

    return false
}