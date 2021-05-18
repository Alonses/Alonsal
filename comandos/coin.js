module.exports = async ({ message, args }) => {
    
    if(typeof args[0] != "undefined"){
        var possibilidades = ["cara", "coroa"];
        var moeda = Math.round(1 * Math.random())
        var escolha = args[0].toLowerCase();
    }
    
    if(escolha == "cara" || escolha == "coroa"){
        if(escolha == possibilidades[moeda])
            message.channel.send("[ :coin: ] Deu "+ escolha +"! Hack!");
        else
            message.channel.send("[ :coin: ] Deu "+ possibilidades[moeda] +", perdeu playboy :v");
    }else
        message.channel.send("Informe cara ou coroa como `ãco cara` ou `ãco coroa` para testar sua sorte!");
}