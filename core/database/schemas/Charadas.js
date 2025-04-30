const { prisma } = require("../../../lib/prisma")

async function createCharada(charade) {
    await prisma.charade.create({
        data: {
            question: charade.question,
            answer: charade.answer,
        }
    })
}

async function getCharade() {
    return prisma.$queryRawUnsafe(
        `SELECT *
         FROM "Charade"
         ORDER BY RANDOM() LIMIT 1;`
    );
}

module.exports = {
    getCharade,
    createCharada
}