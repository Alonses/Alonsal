const mongoose = require("mongoose")

// qid -> Question ID

const schema = new mongoose.Schema({
    qid: { type: Number, default: 0 },
    question: { type: String, default: null },
    answer: { type: String, default: null }
})

const model = mongoose.model("Charada", schema)

var counter = 0

async function createCharada(value) {
    await model.create({ qid: counter, question: value.pergunta, answer: value.resposta })
    counter = counter++
}

async function getCharada() {

    // Coletando uma charada aleatória do banco
    return model.aggregate([{ $sample: { size: 1 } }])
}

async function migrateCharadas() {

    return

    const { features } = require('./charadas.json')

    features.forEach(async valor => {
        await createCharada(valor.properties)
    })
}

module.exports.Charada = model
module.exports = {
    getCharada,
    createCharada,
    migrateCharadas
}