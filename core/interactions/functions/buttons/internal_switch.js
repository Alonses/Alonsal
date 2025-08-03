const { verifica_canais_dinamicos } = require("../../../auto/triggers/guild_voice_channels")

module.exports = async ({ client, user, interaction, dados }) => {

    let operacao = dados.split(".")[1]
    const bot = await client.getBot()

    // Invertendo o status de ativação da função
    bot.conf[operacao] = !bot.conf[operacao]
    client.x[operacao] = bot.conf[operacao]

    // Verificando se há canais dinâmicos sem membros conectados para poder excluir
    if (operacao === "voice_channels" && bot.conf[operacao] && !client.x.guild_timeout)
        verifica_canais_dinamicos(client)

    await bot.save()

    dados = `0.1`
    require("./internal_conf_panel")({ client, user, interaction, dados })
}