const LIMIT = 5
const DIFF = 5000
const CALDEIRA = 60000

const fs = require('fs')
const { existsSync, mkdirSync, writeFileSync } = require('fs')

module.exports = async ({ client, message, caso }) => {

    if (!existsSync(`./arquivos/data/rank/${message.guild.id}`)) {
        mkdirSync(`./arquivos/data/rank/${message.guild.id}`, { recursive: true })
        return;
    }

    if (caso !== "comando") {
        user = {
            id: message.author.id,
            nickname: message.author.username,
            lastValidMessage: 0,
            warns: 0,
            caldeira_de_ceira: false,
            xp: 0
        }
    } else {
        user = {
            id: message.user.id,
            nickname: message.user.username,
            lastValidMessage: 0,
            warns: 0,
            caldeira_de_ceira: false,
            xp: 0
        }
    }

    if (existsSync(`./arquivos/data/rank/${message.guild.id}/${user.id}.json`)) {
        delete require.cache[require.resolve(`../../arquivos/data/rank/${message.guild.id}/${user.id}.json`)];
        const { xp, lastValidMessage, warns, caldeira_de_ceira } = require(`../../arquivos/data/rank/${message.guild.id}/${user.id}.json`);

        user.xp = xp
        user.warns = warns
        user.lastValidMessage = lastValidMessage
        user.caldeira_de_ceira = caldeira_de_ceira
    }

    if (caso === 'messages')
        if (user.warns >= LIMIT) {
            user.caldeira_de_ceira = true
            user.warns = 0
            writeFileSync(`./arquivos/data/rank/${message.guild.id}/${user.id}.json`, JSON.stringify(user))
            return
        }

    // Limitando o ganho de XP por span no chat
    if (user.caldeira_de_ceira) {
        if (message.createdTimestamp - user.lastValidMessage > CALDEIRA)
            user.caldeira_de_ceira = false
        else if (caso === 'messages') return
    }

    if (caso === 'messages')
        if (message.createdTimestamp - user.lastValidMessage < DIFF) {
            user.warns++
            writeFileSync(`./arquivos/data/rank/${message.guild.id}/${user.id}.json`, JSON.stringify(user))
            return
        }

    // Coletando o XP atual e somando ao total do usuário
    fs.readFile('./arquivos/data/rank_value.txt', 'utf8', function (err, data) {

        if (caso === 'messages') {
            user.xp += parseInt(data)
            user.lastValidMessage = message.createdTimestamp
            user.warns = 0
        } else // Experiência obtida executando comandos
            user.xp += (parseInt(data) * 1.5)

        require('../automaticos/relatorio.js')({ client, caso })

        writeFileSync(`./arquivos/data/rank/${message.guild.id}/${user.id}.json`, JSON.stringify(user))
        delete require.cache[require.resolve(`../../arquivos/data/rank/${message.guild.id}/${user.id}.json`)]
    })
}