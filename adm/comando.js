module.exports = async ({message}) => {

    const { idioma_servers } = require('../arquivos/json/dados/idioma_servers.json');

    const { messages } = require("../arquivos/json/text/"+ idioma_servers[message.guild.id] +"/comando.json");

    const num = Math.round((messages.length - 1) * Math.random());

    let key = Object.keys(messages[num]);

    let marcacao = "<@" + message.author.id + ">";
    frase = key[0].replace("autor_msg", marcacao);
    
    // Frase
    message.react('🤡');
    await message.channel.send(frase);
    
    // Imagem
    if(messages[num][key] !== null)
        message.channel.send(messages[num][key]);
}