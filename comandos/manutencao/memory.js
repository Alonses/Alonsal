module.exports = {
    name: "memory",
    description: "Veja seu ping local",
    aliases: [ "ram" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');

        const used = process.memoryUsage();
        let text = 'Uso de RAM:\n';

        if(idioma_servers[message.guild.id] === "en-us")
            text = 'RAM usage:\n';

        for (let key in used) {
            text += `${key}: **${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB**\n`;
        }

        message.channel.send(text);
    }
};