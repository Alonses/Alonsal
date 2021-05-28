module.exports = async ({ message, args }) => {
    let jooj = ["pedra", "papel", "tesoura", "pedra"];
    let player = Math.round(2 * Math.random())
    
    if(typeof args[0] != "undefined")
        player = jooj.indexOf(args[0].toLowerCase())

    let bot = Math.round(2 * Math.random())
    let ganhador = "Perdeu!"
    
    if (player == 0) player = 3
    if (bot == 0) bot = 3

    if (bot < player) ganhador = "Ganhou!"
    if (bot == player) ganhador = "Empatou!"

    const mensagem = "Jokenpo! \nBot[" + jooj[bot] + "]\n" + "Voce[" + jooj[player] + "]\nVoce " + ganhador

    await message.channel.send(mensagem)
}
