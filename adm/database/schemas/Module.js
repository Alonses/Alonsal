const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    type: { type: Number, default: null },
    stats: {
        price: { type: Number, default: 20 },
        days: { type: Number, default: null },
        hour: { type: String, default: null },
        active: { type: Boolean, default: false }
    }
})

const model = mongoose.model("Module", schema)

async function getModule(uid, type) {
    if (!await model.exists({ uid: uid, type: type })) await model.create({ uid: uid, type: type })

    return model.findOne({ uid: uid, type: type })
}

async function dropModule(uid, type) {
    await model.findOneAndDelete({ uid: uid, type: type })
}

async function getActiveModules() {
    // Lista todos os usuários com módulos ativos
    return model.find({ "stats.active": true })
}

async function getModulePrice(uid) {
    // Retorna um preço pelos módulos ativos de determinado usuário
    let modulos = await model.find({ uid: uid, "stats.active": true })
    let total = 0

    modulos.forEach(element => {
        total += element.stats.price
    })

    return total
}

module.exports.Badge = model
module.exports = {
    getModule,
    dropModule,
    getModulePrice,
    getActiveModules
}