const { PermissionsBitField } = require('discord.js')

const { listAllGuildWarns } = require('../database/schemas/Guild_warns')
const { listAllUserWarns } = require('../database/schemas/User_warns')

module.exports = async ({ client, data }) => {

    // Separando dados
    const { id_user, id_guild } = data

    // Verifica as advertências do usuário e os cargos que foram vinculados
    const guild = await client.guilds(client.decifer(id_guild))
    const guild_warns = await listAllGuildWarns(id_guild)
    const user_warns = await listAllUserWarns(id_user, id_guild)

    let i = 0

    guild_warns.forEach(async guild_warn => {

        if (guild_warn.role) {

            // Permissões do bot no servidor
            const membro_sv = await client.execute("getMemberGuild", { interaction: client.decifer(id_guild), id_user: client.id() })
            const membro_guild = await client.execute("getMemberGuild", { interaction: client.decifer(id_guild), id_user: client.decifer(id_user) })

            if (!membro_sv || !membro_guild) return // Sem dados

            // Removendo o cargo do usuário que recebeu a advertência
            if (membro_sv.permissions.has(PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.Administrator)) {
                if (i >= user_warns.length || user_warns.length === 0) {

                    const role = guild.roles.cache.get(client.decifer(guild_warn.role))

                    if (role.editable) // Verificando se o cargo é editável
                        membro_guild.roles.remove(role).catch(console.error)
                }
            }
        }

        i++
    })
}
