module.exports = async ({ message, args }) => {
    let jooj = ["pedra", "papel", "tesoura", "pedra"];
    let emojis = [":rock:", ":roll_of_paper:", ":scissors:", ":rock:"]
    let player = Math.round(2 * Math.random())
    
    if(typeof args[0] != "undefined")
        player = jooj.indexOf(args[0].toLowerCase())

    if(player === -1){
        message.channel.send("Envie como `.ajkp papel` ou como `.ajkp` para uma partida randômica.")
        return
    }

    let bot = Math.round(2 * Math.random())
    let ganhador = ":thumbsdown:"

    if (player === 0) player = 3
    if (bot === 0) bot = 3

    if(player === 3 && bot === 1)
        player = 0
        
    if (bot < player || (player === 1 && bot === 3)) ganhador = ":trophy:"
    if (bot === player) ganhador = ":infinity:"

    const mensagem = "Jokenpô! \n[ " + emojis[bot] + " ] Bot\n" + "[ " + emojis[player] + " ] <- Você\n[ " + ganhador +" ]";

    await message.channel.send(mensagem)
}