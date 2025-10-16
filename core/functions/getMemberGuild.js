module.exports = async ({ client, data }) => {

    // Retorna o objeto do membro no servidor
    const interaction = data?.interaction || data?.message
    const id_user = data.id_user
    let membro

    if (interaction.guild) // Coletando a partir de uma interação ou evento
        membro = interaction.guild.members.fetch(id_user)
            .catch(() => { return null })
    else if (interaction.members)// Coletando direto da guild
        membro = interaction.members.fetch(id_user)
            .catch(() => { return null })
    else {
        // Procurando a guild e o membro usando um ID do servidor
        const guild = await client.guilds(interaction)

        if (guild)
            membro = guild.members.fetch(id_user)
                .catch(() => { return null })
    }

    return membro
}