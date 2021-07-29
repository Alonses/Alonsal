module.exports = {
    name: "server",
    description: "O Hub multiconectado do alonsal",
    aliases: [ "hub" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');

        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }
        
        let emoji_rainha = emoji('854830529928757269');

        const embed = new MessageEmbed()
        .setColor(0x29BB8E)
        .setTitle("> Hub do Alonsal "+ emoji_rainha)
        .setURL('https://discord.gg/MPyTzWa')
        .setImage('https://i.imgur.com/Lr6cChX.png')
        .setDescription("Um server várias utilidades, o Hub do Alonsal é uma central de informações, chega+ e se divirta!");

        const m = await message.channel.send(`${message.author} despachei o convite para o Hub alonsal no seu privado :handshake:`);
        m.react('📫');

        client.users.cache.get(message.author.id).send(embed);
    }
};