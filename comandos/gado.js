module.exports = async({message, args}) => {

    var frases = ["é Gado com chifre e tudo! :cow2:", "não é gado", "faz parte do rebanho.", ", eu conto ou você conta? :cow:", "é uma pessoa simpática, aGadável, que no entanto... é :cow2:", "é Gadissíssimo! :cow:", "é :cow2:", "a regra é clara! Mugiu, é :cow:", ", pelo ronco e pelo berro, esse :cow: já foi marcado a ferro!", "é GADO D+ :cow2:", "não é gado, mas não deixa de ser :cow2:", "é GADÃO Mané :cow:", "raspa o chifre no chão todo dia :cow2:", "tem q abaixar a cabeça para passar o chifre pela porta :cow:", "é especilista em pastar :cow2:"];

    if(typeof args[0] != "undefined"){
        var num = Math.round(frases.length * Math.random());
        
        if(num == frases.length)
            num = 0;

        const gado = args[0];
        message.channel.send("O "+ gado +" "+ frases[num]);
    }else
        message.channel.send(`O seu gado ${message.author} :cow:, kd o @ do usuário?`);
}