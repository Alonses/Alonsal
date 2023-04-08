const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    uid: { type: String, default: null },
    type: { type: Number, default: 0 },
    data: {
        text: { type: String, default: null }
    },
    stats: {
        price: { type: Number, default: 0 },
        days: { type: Number, default: 0 },
        hour: { type: String, default: null },
        active: { type: Boolean, default: true }
    }
})

const model = mongoose.model("Module", schema)

async function getModules(uid) {
    if (!await model.exists({ uid: uid })) await model.create({ uid: uid })

    return model.find({ uid: uid })
}

async function getFilteredModules() {
    let modulos = model.find({ "stats.active": true })

    modulos.map(valor => valor.uid)

    console.log(modulos)
}

async function getActiveModules() {
    // Lista todos os usuários com módulos ativos
    return model.find({ "stats.active": true })
}

async function getModulePrice(uid) {
    // Retorna um preço pelos módulos ativos de determinado usuário
    let modulos = model.find({ uid: uid, "stats.active": true })
    let total = 0;

    modulos.forEach(element => {
        total += element.stats.price
    })

    return total
}

module.exports.Badge = model
module.exports.getModules = getModules
module.exports.getModulePrice = getModulePrice
module.exports.getActiveModules = getActiveModules
module.exports.getFilteredModules = getFilteredModules