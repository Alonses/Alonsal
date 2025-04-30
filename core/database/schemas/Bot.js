const { prisma } = require("../../../lib/prisma")

async function getBot(id) {
    let bot = await prisma.bot.findUnique({
        where: { id },
        include: {
            currentDaily: true
        }
    })

    if (!bot) {
        bot = await prisma.bot.create({
            data: { id }
        })
        dailyReset(id)
    }

    if (!bot.currentDaily) {
        dailyReset(id)
    }

    return bot;
}

async function updateBot(id, data) {
    const bot = await prisma.bot.findUnique({
        where: { id }
    });
    if (!bot) return;

    await prisma.bot.update({
        where: { id },
        data
    });
}

async function dailyReset(id) {
    const bot = await prisma.bot.findUnique({
        where: { id }
    });
    if (!bot) return;

    const newDaily = await prisma.daily.create({ data: {} });

    await prisma.bot.update({
        where: { id },
        data: {
            currentDaily: {
                connect: { id: newDaily.id }
            }
        }
    });
}

async function dropBot(id) {
    await prisma.bot.delete({
        where: { id }
    })
}

module.exports = {
    getBot,
    updateBot,
    dropBot,
    dailyReset
}