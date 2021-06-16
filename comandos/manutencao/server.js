const { MessageEmbed } = require('discord.js');

module.exports = async function({client, message}){

    function emoji(id){
        return client.emojis.cache.get(id).toString();
    }
    
    emoji_rainha = emoji('854171515641659402')

    const embed = new MessageEmbed()
    .setColor(0x29BB8E)
    .setTitle("> Hub do Alonsal "+ emoji_rainha)
    .setURL('https://discord.gg/MPyTzWa')
    .setImage('https://i.imgur.com/Lr6cChX.png')
    .setDescription("Um server várias utilidades, o Hub do Alonsal é uma central de informações, chega+ e se divirta!");

    const m = await message.channel.send(`${message.author} despachei o convite para o Hub alonsal no seu privado :handshake:`)
    m.react('📫')

    client.users.cache.get(message.author.id).send(embed)
}