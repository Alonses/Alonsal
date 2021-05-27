module.exports = async ({ message, args }) => {
    
    var possibilidades = ["cara", "coroa"]
    var moeda = Math.round(1 * Math.random())
    var escolha = args[0].toLowerCase();
    
    if (possibilidades.indexOf(args[0]) == -1) {
        await message.channel.send('Informe cara ou coroa como `ãco cara` ou `ãco coroa` para testar sua sorte!')
        return
    }

        if (escolha == possibilidades[moeda])
            message.channel.send("[ :coin: ] Deu " + escolha + "! Você acertou!");
        else
            message.channel.send("[ :coin: ] Deu " + possibilidades[moeda] + ", perdeu playboy :v")
}