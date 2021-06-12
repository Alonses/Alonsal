const comando = require("./comando.json")

module.exports = async ({message}) => {

    let num = 1 + Math.round(5 * Math.random())

    let frase = comando[num]

    let marcacao = "<@" + message.author.id + ">"
    frase = frase.replace("autor_msg", marcacao)
    
    // Frase
    message.react('🤡')
    await message.channel.send(frase)

    // Imagem
    if(num !== 6 && num !== 2)
        message.channel.send(comando[num + 7])

}