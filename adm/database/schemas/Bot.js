const mongoose = require("mongoose")

// bit -> Bot ID

// Transmission assets
// id_broad -> Canal que será usado para enviar mensagens "manuais" pelo bot
// id_cast -> Canal que o bot irá usar para enviar respostas do chat
// id_author -> ID do usuário que ativou o recurso

const schema = new mongoose.Schema({
    bit: { type: String, default: null },
    persis: {
        version: { type: String, default: "1.0" },
        commands: { type: Number, default: 0 },
        ranking: { type: Number, default: 5 },
        alondioma: { type: String, default: null }
    },
    cmd: {
        ativacoes: { type: Number, default: 0 },
        botoes: { type: Number, default: 0 },
        menus: { type: Number, default: 0 },
        erros: { type: Number, default: 0 }
    },
    exp: {
        exp_concedido: { type: Number, default: 0 },
        msgs_lidas: { type: Number, default: 0 },
        msgs_validas: { type: Number, default: 0 }
    },
    transmission: {
        status: { type: Boolean, default: false },
        id_broad: { type: String, default: null },
        id_cast: { type: String, default: null },
        author: { type: String, default: null }
    },
    bfu: {
        gerado: { type: Number, default: 0 },
        movido: { type: Number, default: 0 },
        reback: { type: Number, default: 0 }
    }
})

const model = mongoose.model("Bot", schema)

async function getBot(bit) {
    if (!await model.exists({ bit: bit })) await model.create({ bit: bit })

    return model.findOne({ bit: bit })
}

async function dailyReset(bit) {

    // Reseta os dados diários do bot
    const bot = await getBot(bit)

    bot.cmd.ativacoes = 0
    bot.cmd.botoes = 0
    bot.cmd.menus = 0
    bot.cmd.erros = 0

    bot.exp.exp_concedido = 0
    bot.exp.msgs_validas = 0
    bot.exp.msgs_lidas = 0

    bot.bfu.gerado = 0
    bot.bfu.movido = 0
    bot.bfu.reback = 0

    await bot.save()
}

async function dropBot(bit) {
    await model.findOneAndDelete({ bit: bit })
}

async function migrateData(client) {

    // Migrando os dados do json para o banco de dados externo
    const { comandos_disparados, exp_concedido, msgs_lidas, msgs_validas, epic_embed_fails, bufunfas, movimentado } = require(`../../../arquivos/data/relatorio.json`)

    const bot = await client.getBot()

    bot.cmd.ativacoes = comandos_disparados
    bot.cmd.erros = epic_embed_fails

    bot.exp.exp_concedido = exp_concedido
    bot.exp.msgs_validas = msgs_validas
    bot.exp.msgs_lidas = msgs_lidas

    bot.bfu.gerado = bufunfas
    bot.bfu.movido = movimentado

    await bot.save()
}

module.exports.User = model
module.exports = {
    getBot,
    dropBot,
    dailyReset,
    migrateData
}