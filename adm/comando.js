const comando = require("./comando.json")

module.exports = async ({message}) => {

    num = 1 + Math.round(5 * Math.random())

    frase = comando[num]

    marcacao = "<@"+ message.author.id + ">"
    frase = frase.replace("autor_msg", marcacao)
    
    // Frase
    message.react('🤡')
    await message.channel.send(frase)

    // Imagem
    if(num != 6 && num != 2)
        message.channel.send(comando[num + 6])

}