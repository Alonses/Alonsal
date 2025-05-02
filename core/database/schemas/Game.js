const {prisma} = require("../../../lib/prisma");

async function getGames() {
    return prisma.game.findMany({
        where: {
            expirationDate: {
                gte: new Date()
            }
        },
        orderBy: {
            expirationDate: "asc"
        }
    })
}

async function verifyGame(game) {
    return prisma.game.findFirst({
        where: {
            name: game.name
        }
    })
}

async function createGame(game) {
    const result = await prisma.game.findUnique({
        where: {
            key: {
                name: game.name,
                expirationDate: game.expirationDate
            }
        }
    })

    if (result) return result

    return prisma.game.create({
        data: {
            name: game.name,
            type: game.type,
            url: game.url,
            price: game.price,
            expirationDate: game.expirationDate,
            description: game.description,
            thumbnailUrl: game.thumbnailUrl
        }
    })
}

async function dropGame(game) {
    await prisma.game.delete({
        where: {
            name: game.name,
            expirationDate: game.expirationDate
        }
    })
}

async function verifyInvalidGames() {
    await prisma.game.deleteMany({
        where: {
            expirationDate: {
                lt: new Date()
            }
        }
    })
}

module.exports = {
    getGames,
    verifyGame,
    createGame,
    dropGame,
    verifyInvalidGames
}