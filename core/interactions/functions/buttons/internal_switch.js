module.exports = async ({ client, user, interaction, dados }) => {

    let operacao = dados.split(".")[1]
    const bot = await client.getBot()

    // Invertendo o status de ativação da função
    bot.conf[operacao] = !bot.conf[operacao]
    client.x[operacao] = bot.conf[operacao]

    await bot.save()

    dados = `0.1`
    require("./internal_conf_panel")({ client, user, interaction, dados })
}