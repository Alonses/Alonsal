const { PermissionsBitField } = require("discord.js");

async function syncTimedRole({ client, dados, user_roles }) {

    const interaction = dados

    if (await client.execute("permissions", { interaction, id_user: client.id(), permissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ModerateMembers] })) {

        // Cargo do bot no servidor, e membro no servidor
        const bot_member = await client.execute("getMemberGuild", { interaction, id_user: client.id() })
        const membro_guild = await client.execute("getMemberGuild", { interaction, id_user: dados.user.id })

        user_roles.forEach(async cargo => {

            const role = client.getGuildRole(interaction, client.decifer(cargo.rid))

            // Verificando se o cargo informado possui menos hierarquia que o cargo do bot
            if (role.position < bot_member.roles.highest.position) {

                // Verificando se cargo informado não possui permissões moderativas
                if (!await client.execute("rolePermissions", { interaction, id_role: client.decifer(cargo.rid), permissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.Administrator] })) {

                    // Adicionando o cargo temporário ao membro
                    membro_guild.roles.add(client.decifer(cargo.rid))
                }
            }
        })
    }
}

module.exports.syncTimedRole = syncTimedRole