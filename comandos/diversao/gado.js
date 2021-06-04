const frases = require('./gado.json')

module.exports = async({message, args}) => {

    if(typeof args[0] != "undefined" && args[0].includes("<@")){
        var num = 1 + Math.round(31 * Math.random())
        
        const gado = args[0];
        var alvo = gado.replace("!", "")

        if(alvo != `${message.author}`)
            message.channel.send("O "+ gado +" "+ frases[num]);
        else
            message.channel.send(`Você ${message.author}`+" "+ frases[num]);
    }else
        message.channel.send(`O SEU GADO ${message.author} :cow:, kd o @ do usuário?`);
}
