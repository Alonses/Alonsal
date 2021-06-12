const { MessageEmbed } = require('discord.js');

module.exports = async function({client, message, content, local_comando}){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    const day = days[d.getDay()];
    let hr = d.getHours();
    let min = d.getMinutes();

    if(min < 10)
        min = "0" + min;

    let ampm = "am";
    if(hr > 12){
        hr -= 12;
        ampm = "pm";
    }

    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    const embed = new MessageEmbed()
    .setTitle("> New interaction")
    .setColor(0x29BB8E)
    .setDescription(":man_raising_hand: (ID) User: `"+ message.author +"`\n:label: Username: `"+ message.author.username +"`\n\n:link: (ID) Server: `"+ message.guild.id +"`\n:label: Server name: `"+ message.guild.name +"`\n:link: (ID) Channel: `"+ message.channel.id + "`\n:label: Channel name: `"+ message.channel.name +"`\n:link: (ID) Message: `"+ message.id +"`\n\n:pencil: Command: `"+ content +"`\n:alarm_clock: Date/time: `"+ day + " " + hr + ":" + min + ampm + " " + date + " " + month + " " + year +"`");

    client.channels.cache.get(local_comando).send(embed);
}