module.exports = ({ message }) => {
    
    var reload = require('auto-reload');
    const { idioma_servers } = reload('../arquivos/json/dados/idioma_servers.json');

    const used = process.memoryUsage();
    let text = 'Uso de RAM:\n';
    
    if(idioma_servers[message.guild.id] == "en-us")
        text = 'RAM usage:\n';

    for (let key in used) {
        text += `${key}: **${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB**\n`;
    }

    message.channel.send(text);
}