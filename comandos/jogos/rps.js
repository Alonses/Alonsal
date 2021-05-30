module.exports = async ({ message, args }) => {
    let jooj = ["pedra", "papel", "tesoura", "pedra"];
    let player = Math.round(2 * Math.random())
    
    if(typeof args[0] != "undefined")
        player = jooj.indexOf(args[0].toLowerCase())

    let bot = Math.round(2 * Math.random())
    let ganhador = "Perdeu!"
    
    if (player == 0) player = 3
    if (bot == 0) bot = 3

    if (bot < player || (player == 1 && bot == 3)) ganhador = "Ganhou!"
    if (bot == player) ganhador = "Empate!"

    const mensagem = "Jokenpô! \nBot [" + jooj[bot] + "]\n" + "Você [" + jooj[player] + "]\nResultado: " + ganhador

    await message.channel.send(mensagem)
}
