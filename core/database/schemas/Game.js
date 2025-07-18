const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    nome: { type: String, default: null },
    tipo: { type: String, default: "game" },
    link: { type: String, default: null },
    preco: { type: Number, default: 0 },
    expira: { type: Number, default: null },
    thumbnail: { type: String, default: null }
})

const model = mongoose.model("Game", schema)

async function getGames() {
    return model.find().sort({
        expira: 1
    })
}

// Verifica se um game já foi registrado
async function verifyGame(game) {
    if (await model.exists({ nome: game.nome }))
        return true

    return false
}

async function createGame(game) {

    if (!await model.exists({ nome: game.nome, expira: game.expira }))
        await model.create({
            nome: game.nome,
            tipo: game.tipo,
            link: game.link,
            preco: game.preco,
            expira: game.expira,
            hora_expira: game.hora_expira,
            thumbnail: game.thumbnail
        })

    return model.findOne({
        nome: game.nome,
        expira: game.expira
    })
}

// Apagando um game
async function dropGame(game) {
    await model.findOneAndDelete({
        nome: game.nome,
        expira: game.expira
    })
}

async function verifyInvalidGames() {

    const games = await getGames()
    if (games.length < 1) return

    let games_invalidos = []

    // Listando os games que já expiraram
    games.forEach(game => {
        if (game.expira < parseInt(new Date().getTime() / 1000))
            games_invalidos.push(game)
    })

    if (games_invalidos.length < 1) return

    // Excluíndo do banco os games que já expiraram
    games_invalidos.forEach(async game => {
        await dropGame(game)
    })
}

module.exports.Game = model
module.exports = {
    getGames,
    verifyGame,
    createGame,
    dropGame,
    verifyInvalidGames
}