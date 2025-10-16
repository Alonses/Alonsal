const { writeFileSync, readFile } = require('fs')

const { listAllUserValidRoles, dropUserTimedRole } = require('../../database/schemas/User_roles')

async function atualiza_roles() {

    const dados = await listAllUserValidRoles()

    // Salvando os cargos temporários no cache do bot
    writeFileSync("./files/data/user_timed_roles.txt", JSON.stringify(dados))
}

async function verifica_roles(client) {

    readFile('./files/data/user_timed_roles.txt', 'utf8', async (err, data) => {

        data = JSON.parse(data)
        const timestamp_atual = client.execute("timestamp")

        // Interrompe a operação caso não haja cargos salvos em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {

            const role = data[i]

            // Verificando se o cargo ultrapassou o tempo de exclusão
            if (timestamp_atual > role.timestamp) {

                // Atualiza o tempo de inatividade do servidor
                client.execute("updateGuildIddleTimestamp", { sid: role.sid })

                // Excluindo o vinculo do cargo com o membro
                await dropUserTimedRole(role.uid, role.sid, role.rid)

                // Descriptografando os dados para desvinculo com o membro do servidor
                if ((role.rid).length > 20) {
                    role.rid = client.decifer(role.rid)
                    role.uid = client.decifer(role.uid)
                    role.sid = client.decifer(role.sid)
                }

                // Removendo o cargo temporário do membro no servidor
                const guild = await client.guilds(role.sid)
                if (!guild) return

                const cached_role = guild.roles.cache.get(role.rid)
                const membro_guild = await client.execute("getMemberGuild", { interaction: role.sid, id_user: role.uid })

                if (cached_role && membro_guild)
                    membro_guild.roles.remove(cached_role).catch(console.error)
            }
        }

        // Atualizando os cargos em cache
        atualiza_roles()
    })
}

module.exports.atualiza_roles = atualiza_roles
module.exports.verifica_roles = verifica_roles