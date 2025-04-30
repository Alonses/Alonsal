module.exports = async ({ client, caso, quantia }) => {
    if (!client.x?.relatorio) return

    // Movimentações de bufunfas
    if (caso === "gerado" || caso === "movido" || caso === "reback") {
        const updateData = {
            currentDaily: {
                update: {
                    [`${caso === "gerado" ? "created" : caso === "movido" ? "transfered" : "reback"}Bufunfas`]: {increment: quantia}
                }
            }
        }

        if (caso === "gerado") {
            updateData.bufunfas = {increment: quantia}
        }

        await client.updateBot(updateData)
    } else {
        const updateData = {
            currentDaily: {
                update: {}
            }
        }

        const bot = await client.getBot()

        if (caso === "messages") {
            updateData.currentDaily.update.experience = {increment: Math.round(bot.ranking)}
            updateData.currentDaily.update.messages = {increment: 1}
            updateData.currentDaily.update.readMessages = {increment: 1}
        }

        if (caso === "comando") {
            updateData.currentDaily.update.experience = {increment: Math.round(bot.ranking * 1.5)}
            updateData.currentDaily.update.activations = {increment: 1}
        }

        if (caso === "botao") {
            updateData.currentDaily.update.experience = {increment: Math.round(bot.ranking * 0.5)}
            updateData.currentDaily.update.buttons = {increment: 1}
        }

        if (caso === "menu") {
            updateData.currentDaily.update.experience = {increment: Math.round(bot.ranking * 0.5)}
            updateData.currentDaily.update.menus = {increment: 1}
        }

        if (caso === "msg_enviada")
            updateData.currentDaily.update.readMessages = {increment: 1}

        if (caso === "epic_embed")
            updateData.currentDaily.update.errors = {increment: 1}


        if (Object.keys(updateData.currentDaily.update).length > 0)
            await client.updateBot(updateData)
    }
}