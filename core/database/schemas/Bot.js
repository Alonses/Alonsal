const mongoose = require("mongoose")

// bit -> Bot ID

const schema = new mongoose.Schema({
    bit: { type: String, default: null },
    persis: {
        version: { type: String, default: "1.0" },
        commands: { type: Number, default: 0 },
        ranking: { type: Number, default: 5 },
        alondioma: { type: String, default: null },
        last_interaction: { type: Number, default: null },
        subscriber_discount: { type: Number, default: 0.2 },
        spam: { type: Number, default: 0 },
        bufunfas: { type: Number, default: 0 }
    },
    cmd: {
        ativacoes: { type: Number, default: 0 },
        botoes: { type: Number, default: 0 },
        menus: { type: Number, default: 0 },
        erros: { type: Number, default: 0 },
        voice_channels: { type: Number, default: 0 }
    },
    exp: {
        exp_concedido: { type: Number, default: 0 },
        msgs_lidas: { type: Number, default: 0 },
        msgs_validas: { type: Number, default: 0 }
    },
    bfu: {
        gerado: { type: Number, default: 0 },
        movido: { type: Number, default: 0 },
        reback: { type: Number, default: 0 }
    },
    conf: {
        voice_channels: { type: Boolean, default: true },
        modules: { type: Boolean, default: true },
        ranking: { type: Boolean, default: true },
        daily_announce: { type: Boolean, default: false },
        logger: { type: Boolean, default: true },
        guild_timeout: { type: Boolean, default: false },
        relatorio: { type: Boolean, default: true }
    }
})

const model = mongoose.model("Bot", schema)

async function getBot(bit) {
    if (!await model.exists({ bit: bit }))
        await model.create({
            bit: bit
        })

    return model.findOne({
        bit: bit
    })
}

async function dailyReset(bit) {

    // Reseta os dados diários do bot
    const bot = await getBot(bit)

    bot.cmd.ativacoes = 0
    bot.cmd.botoes = 0
    bot.cmd.menus = 0
    bot.cmd.erros = 0
    bot.cmd.voice_channels = 0

    bot.exp.exp_concedido = 0
    bot.exp.msgs_validas = 0
    bot.exp.msgs_lidas = 0

    bot.bfu.gerado = 0
    bot.bfu.movido = 0
    bot.bfu.reback = 0

    await bot.save()
}

async function dropBot(bit) {
    await model.findOneAndDelete({
        bit: bit
    })
}

module.exports.User = model
module.exports = {
    getBot,
    dropBot,
    dailyReset
}