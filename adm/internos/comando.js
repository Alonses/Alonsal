module.exports = async ({client, message}) => {
    
    const { messages } = require(`../../arquivos/json/text/${client.idioma.getLang(message.guild.id)}/comando.json`);

    const num = Math.round((messages.length - 1) * Math.random());
    let key = Object.keys(messages[num]);
    
    let prefix = client.prefixManager.getPrefix(message.guild.id);
    if(!prefix)
        prefix = ".a";

    let marcacao = `<@${message.author.id}>`;
    const frase = key[0].replace("autor_msg", marcacao);
    
    // Frase
    await message.react('🤡');
    await message.channel.send(frase.replace(".a", prefix));
    
    // Imagem
    if(messages[num][key] !== null)
        message.channel.send(messages[num][key]);
}