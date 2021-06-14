module.exports = async({message, args}) => {
    let dado = []; 
    let resultado = "";

    if(typeof args[0] === "undefined")
        args[0] = 1;

    if(args.length > 0){
        if(args[0] > 50){
            message.channel.send(`:warning: ${message.author} não é possivel rodar mais que 50 dados ao mesmo tempo.`);
            return
        }

        if(typeof args[1] === "undefined")
            args[1] = 5;
        else
            if(args[1] > 10000){
                message.channel.send(`:warning: ${message.author} não é possivel rodar dados com mais de 10.000 faces.`);
                return
            }

        for(let i = 0; i < args[0]; i++){
            dado.push(1 + Math.round(args[1] * Math.random()))
        }
    }else
        dado.push(1 + Math.round(5 * Math.random()));

    for(let i = 0; i < dado.length; i++){
        resultado += "`"+ dado[i] +"`";

        if(typeof dado[i + 1] != "undefined")
            resultado += ", "
    }

    if(args[1] == 5)
        args[1]++
    
    let mensagem = 'Foram rodados `'+ args[0] +'` dados com `'+ parseInt(args[1]) +'` faces\n\n Resultados [ '+ resultado +' ]';

    if(args[0] == 1)
        mensagem = 'Foi rodado `'+ args[0] +'` dado com `'+ parseInt(args[1]) +'` faces\n\n Resultado [ '+ resultado +' ]';

    message.channel.send(`:game_die: ${message.author}, `+ mensagem);
}