

module.exports = async ({ message, args }) => {
    
    var num = Math.round(2 * Math.random());
    var jooj = ["pedra", "papel", "tesoura"];

    if(typeof args[0] != "undefined")
        var escolha = args[0];
    else{
        var num2 = Math.round(2 * Math.random());
        var escolha = jooj[num2];
    }

    if(!escolha.includes("ceira") && !escolha.includes("Ceira")){
        const maquina = jooj[num].charAt(0).toUpperCase() + jooj[num].slice(1)
        const format = escolha.charAt(0).toUpperCase() + escolha.slice(1);
        
        message.channel.send("Jokenpô!\nAlonso: [ "+ maquina + " ]");
        message.channel.send('Você: [ '+ format +' ]');

        if(escolha == jooj[num])
            message.channel.send("Empate :v");
        else if((escolha == "pedra" && jooj[num] == "tesoura") || (escolha == "tesoura" && jooj[num] == "papel") || (escolha == "papel" && jooj[num] == "pedra"))
            message.channel.send("Você ganhou!");
        else
            message.channel.send("Você perdeu!");
    }else
        message.channel.send("Sai pra lá com essa ceira!\nIsso é trabalho do <@843623764570800148> :v");
}