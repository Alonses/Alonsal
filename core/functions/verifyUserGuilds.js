const { registerUserGuild } = require("../database/schemas/User_guilds")

module.exports = async ({ client, data }) => {

    // Salva todos os servidores que um usuário está no cache do bot
    const { user, id_alvo, interaction } = data

    const servidores = await client.guilds()
    let qtd_servidores = 0

    for await (let server of servidores) {

        const guild = server[1]
        const membro_guild = await guild.members.fetch(id_alvo)
            .catch(() => { return null })

        if (membro_guild) { // Registrando os servidores que o usuário faz parte
            registerUserGuild(id_alvo, guild.id)
            qtd_servidores++
        }
    }

    if (interaction)
        interaction.editReply({
            content: client.tls.phrase(user, "manu.data.salvos_cache", 61, qtd_servidores),
            flags: "Ephemeral"
        })
}