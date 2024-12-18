const { writeFileSync, readFile } = require('fs')

const { defaultEraser } = require('../../formatters/patterns/timeout.js')

const { getTimedPreGuilds } = require('../../database/schemas/Guild.js')
const { checkUserGuildPreWarned, removeUserPreWarn } = require('../../database/schemas/User_pre_warns.js')

async function atualiza_pre_warns() {

    const dados = await getTimedPreGuilds(), warns = []

    dados.forEach(async guild => {
        const guild_warns = await checkUserGuildPreWarned(guild.sid)

        // Listando todas as anotações de advertências do servidor
        guild_warns.forEach(warn => { warns.push(warn) })
    })

    // Salvando as anotações de advertências no cache do bot
    writeFileSync("./files/data/user_timed_pre_warns.txt", JSON.stringify(warns))
}

async function verifica_pre_warns(client) {

    readFile('./files/data/user_timed_pre_warns.txt', 'utf8', async (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja anotações de advertências salvas em cache
        if (data.length < 1) return

        const guilds_map = {}

        for (let i = 0; i < data.length; i++) {

            const warn = data[i]
            const guild = guilds_map[warn.sid] ? guilds_map[warn.sid] : await client.getGuild(warn.sid)

            if (!guilds_map[warn.sid]) // Salvando a guild em cache
                guilds_map[warn.sid] = guild

            // Verificando se a anotação de advertência ultrapassou o tempo de exclusão
            if (client.timestamp() > (warn.timestamp + defaultEraser[guild.warn.hierarchy.reset])) {

                // Atualiza o tempo de inatividade do servidor
                client.updateGuildIddleTimestamp(warn.sid)

                // Excluindo o registro da anotação de advertência caso tenha zerado e verificando os cargos do usuário
                await removeUserPreWarn(warn.uid, warn.sid, warn.timestamp)
            }
        }

        // Atualizando as anotações de advertência em cache
        atualiza_pre_warns()
    })
}

module.exports.atualiza_pre_warns = atualiza_pre_warns
module.exports.verifica_pre_warns = verifica_pre_warns