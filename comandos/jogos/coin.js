module.exports = async ({ message, args }) => {

    const possibilidades = ["cara", "coroa"];
    const moeda = Math.round(Math.random());
    let escolha = "";

    if(typeof args[0] != "undefined")
        escolha = args[0].toLowerCase();

    if(possibilidades.indexOf(escolha) === -1 || typeof args[0] == "undefined") {
        await message.channel.send('Informe cara ou coroa como `.aco cara` ou `.aco coroa` para testar sua sorte!')
        return
    }
    
    if(escolha === possibilidades[moeda])
        message.channel.send("[ :coin: ] Deu " + escolha + "! Você acertou!");
    else
        message.channel.send("[ :coin: ] Deu " + possibilidades[moeda] + ", perdeu playboy :v")
}