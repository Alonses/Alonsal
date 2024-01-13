const fs = require('fs')

const { writeFileSync } = require('fs')

const { spamTimeoutMap } = require("../database/schemas/Strikes")
const { getTimedGuilds } = require('../database/schemas/Guild.js')
const { checkUserGuildWarned, removeUserWarn } = require('../database/schemas/Warns.js')

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
        writeFileSync("./files/data/warns.txt", JSON.stringify(warns))
    })
}

async function verifica_warns(client) {

    fs.readFile('./files/data/warns.txt', 'utf8', async (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja advertências salvas em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {

            const warn = data[i]
            const guild = await client.getGuild(warn.sid)

            // Verificando se a advertência ultrapassou o tempo de exclusão
            if (client.timestamp() > (warn.timestamp + spamTimeoutMap[guild.warn.reset])) {

                // Excluindo o registro da advertência caso tenha zerado
                await removeUserWarn(warn.uid, warn.sid)

                atualiza_warns()
            }
        }
    })
}

module.exports.atualiza_warns = atualiza_warns
module.exports.verifica_warns = verifica_warns