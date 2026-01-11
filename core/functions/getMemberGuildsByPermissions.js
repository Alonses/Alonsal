const { listAllUserGuilds, registerUserGuild, dropUserGuild } = require("../database/schemas/User_guilds")

module.exports = async ({ client, data }) => {

    const { user, interaction } = data
    const permissions = data.permissions || []

    const guilds_user = []
    let servidores = await listAllUserGuilds(user.uid)

    if (servidores.length < 1) // Membro não possui servidores salvos em cache
        servidores = await client.guilds()

    for await (let server of servidores) {

        const guild = server.sid ? await client.guilds(client.decifer(server.sid)) : server[1]

        if (guild?.id) // verificando se o servidor possui os dados corretos
            if (guild.id !== interaction.guild.id) {
                const membro_guild = await guild.members.fetch(client.decifer(user.uid))
                    .catch(() => {
                        // Removendo o servidor vinculado ao usuário por não encontrá-lo
                        dropUserGuild(user.uid, client.encrypt(guild.id))
                        return null
                    })

                if (membro_guild) { // Listando as guilds que o usuário é moderador
                    if (membro_guild.permissions.has(permissions)) {
                        const internal_guild = await client.getGuild(guild.id)
                        internal_guild.name = guild.name

                        guilds_user.push(internal_guild)
                    }

                    // Registrando os servidores que o usuário faz parte
                    registerUserGuild(user.uid, client.encrypt(guild.id))
                }
            }
    }

    // Ordenando alfabeticamente os servidores
    return guilds_user.sort((a, b) => (client.normalizeString(a.name) > client.normalizeString(b.name)) ? 1 : ((client.normalizeString(b.name) > client.normalizeString(a.name)) ? -1 : 0))
}