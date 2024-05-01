const fs = require('fs')

const { writeFileSync } = require('fs')

const { spamTimeoutMap } = require("../../database/schemas/User_strikes.js")
const { getTimedGuilds } = require('../../database/schemas/Guild.js')
const { checkUserGuildWarned, removeUserWarn } = require('../../database/schemas/User_warns.js')

async function atualiza_warns() {

    const dados = await getTimedGuilds()
    const warns = []

    dados.forEach(async guild => {
        const guild_warns = await checkUserGuildWarned(guild.sid)

        // Listando todas as advertências do servidor
        guild_warns.forEach(warn => {
            warns.push(warn)
        })

        // Salvando as advertências no cache do bot
        writeFileSync("./files/data/user_timed_warns.txt", JSON.stringify(warns))
    })
}

async function verifica_warns(client) {

    fs.readFile('./files/data/user_timed_warns.txt', 'utf8', async (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja advertências salvas em cache
        if (data.length < 1) return

        const guilds_map = {}

        for (let i = 0; i < data.length; i++) {

            const warn = data[i]
            const guild = guilds_map[warn.sid] ? guilds_map[warn.sid] : await client.getGuild(warn.sid)

            if (!guilds_map[warn.sid]) // Salvando a guild em cache
                guilds_map[warn.sid] = guild

            // Verificando se a advertência ultrapassou o tempo de exclusão
            if (client.timestamp() > (warn.timestamp + spamTimeoutMap[guild.warn.reset])) {

                // Excluindo o registro da advertência caso tenha zerado e verificando os cargos do usuário
                await removeUserWarn(warn.uid, warn.sid, warn.timestamp)
                client.verifyUserWarnRoles(warn.uid, warn.sid)
            }
        }

        // Atualizando as advertências em cache
        atualiza_warns()
    })
}

module.exports.atualiza_warns = atualiza_warns
module.exports.verifica_warns = verifica_warns