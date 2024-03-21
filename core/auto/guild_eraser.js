const fs = require('fs')

const { writeFileSync } = require('fs')

const { getEraseGuilds, dropGuild } = require('../database/schemas/Guild.js')
const { dropAllRankGuild } = require('../database/schemas/Rank_s.js')
const { updateGuildReport } = require('../database/schemas/Report.js')
const { updateGuildSuspectLink } = require('../database/schemas/Spam_link.js')
const { dropAllGuildWarns } = require('../database/schemas/Warns_guild.js')
const { dropAllGuildTickets } = require('../database/schemas/Tickets.js')
const { dropRoleAssigner } = require('../database/schemas/Role_assigner.js')
const { dropAllGuildStrikes } = require('../database/schemas/Strikes.js')
const { dropAllUserGuilds } = require('../database/schemas/User_guilds.js')

async function atualiza_eraser() {

    const dados = await getEraseGuilds()

    // Salvando os servidores marcados para exclusão no cache do bot
    writeFileSync("./files/data/erase_guild.txt", JSON.stringify(dados))
}

async function verifica_eraser(client) {

    fs.readFile('./files/data/erase_guild.txt', 'utf8', async (err, data) => {

        data = JSON.parse(data)

        // Interrompe a operação caso não haja advertências salvas em cache
        if (data.length < 1) return

        for (let i = 0; i < data.length; i++) {

            const servidor = data[i]

            if (client.timestamp() > servidor.erase.timestamp) {

                // Excluindo todos os rankings registrados no servidor
                await dropAllRankGuild(servidor.sid)

                // Excluindo todas as advertências criadas no servidor
                await dropAllGuildWarns(servidor.sid)

                // Excluindo todos os tickets criados no servidor
                await dropAllGuildTickets(servidor.sid)

                // Excluindo a configuração de cargos automáticos do servidor
                await dropRoleAssigner(servidor.sid)

                // Excluindo todos os strikes criados no servidor
                await dropAllGuildStrikes(servidor.sid)

                // Excluindo todas as advertências criadas no servidor
                await dropAllGuildWarns(servidor.sid)

                // Excluindo todos os servidores salvos em cache que referênciam o servidor excluído
                await dropAllUserGuilds(servidor.sid)

                // Atualizando o reportes gerados no servidor
                await updateGuildReport(servidor.sid)

                // Atualizando os links suspeitos no servidor
                await updateGuildSuspectLink(servidor.sid)

                // Exclui o servidor por completo
                await dropGuild(servidor.sid)
            }
        }

        // Atualizando as solicitações de exclusão em cache
        atualiza_eraser()
    })
}

module.exports.atualiza_eraser = atualiza_eraser
module.exports.verifica_eraser = verifica_eraser