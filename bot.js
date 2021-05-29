const Discord = require('discord.js');
const { existsSync } = require('fs');
const config = require('./config.json');
const commands = require('./comandos.json');
const client = new Discord.Client();
require('dotenv').config();

prefix = config.prefix;
usos = config.usos;
usos_anterior = config.usos_anteriores;

const talkedRecently = new Set();
const pastas = ["diversao", "jogos", "manutencao", "utilitarios"];

client.on("ready", () => {
    console.log(`Caldeiras aquecidas!`);
    console.log(`Ativo para ${client.users.cache.size} usuários em ${client.channels.cache.size} canais em ${client.guilds.cache.size} servidores diferentes!`);

    client.user.setActivity('Vapor p/ fora!', 'COMPETING')
    let activities = [
        ".h | .help",
        "Binário na fogueira",
        "Músicas no ar",
        "Mesas p/ cima",
        ".h | .help",
        "Código morse para o mundo",
        "Bugs infinitos no sistema",
        "Vapor p/ fora!"
    ]
    
    i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`), 5000);
});

client.on("guildCreate", guild => {
    const embed_sv = new Discord.MessageEmbed()
        .setTitle("> Server update ( New )")
        .setColor(0x29BB8E)
        .setDescription(":globe_with_meridians: (ID) Server: `"+ `${guild.id}` +"`\n:label: Server name: `"+ `${guild.name}` + "`\n\n:busts_in_silhouette: Members: `"+ `+${guild.memberCount}`+ "`");

    client.channels.cache.get(config.log_servers).send(embed_sv);
});

client.on("guildDelete", guild => {
    const embed_sv = new Discord.MessageEmbed()
        .setTitle("> Server update ( Left )")
        .setColor(0xd4130d)
        .setDescription(":globe_with_meridians: (ID) Server: `"+ `${guild.id}` +"`\n:label: Server name: `"+ `${guild.name}` + "`\n\n:busts_in_silhouette: Members: `"+ `-${guild.memberCount}`+ "`");

    client.channels.cache.get(config.log_servers).send(embed_sv);
});

client.on('message', (message) => {
    
    var content = message.content;

    // impede que o bot responda outros bots e ignora mensagens que não começem com o prefixo
    if (!content.startsWith(prefix) || message.author.bot) return;
    if (!message.channel.name) return;

    if(talkedRecently.has(message.author.id) && message.author.id != "665002572926681128"){
        message.channel.send(`:name_badge: ${message.author} Aguarde 3 segundos para enviar um comando novamente.`);
        return;
    }else{
        talkedRecently.add(message.author.id);
        setTimeout(() => {
            talkedRecently.delete(message.author.id);
        }, 3000);
    }

    const args = content.slice(prefix.length).trim().split(' ');

    const command = args.shift().toLowerCase();
    for(var i = 0; i < pastas.length; i++){
        path = `./comandos/${pastas[i]}/${commands[command]}`;
        if (existsSync(path)){
            usos++;
            require(path)({ client, message, args });
            break;
        }
    }

    if(content == prefix){
        const comando = new Discord.MessageAttachment('arquivos/img/sem_comando.jpg');

        message.channel.send(`${message.author} Kd o comando fiote!`, comando);
    }

    if(usos == usos_anterior)
        message.channel.send(`${message.author} erroooouuuuuuuuuuuuuuuuu`+ " use `.h` ou `.help` caso queira ver todos os comandos ;)");
    else{
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var d = new Date();
        var day = days[d.getDay()];
        var hr = d.getHours();
        var min = d.getMinutes();

        if(min < 10){
            min = "0" + min;
        }
        
        var ampm = "am";
        if(hr > 12){
            hr -= 12;
            ampm = "pm";
        }

        var date = d.getDate();
        var month = months[d.getMonth()];
        var year = d.getFullYear();

        const embed = new Discord.MessageEmbed()
        .setTitle("> New interaction")
        .setColor(0x29BB8E)
        .setDescription(":man_raising_hand: (ID) User: `"+ message.author +"`\n:label: Username: `"+ message.author.username +"`\n\n:link: (ID) Server: `"+ message.guild.id +"`\n:label: Server name: `"+ message.guild.name +"`\n:link: (ID) Channel: `"+ message.channel.id + "`\n:label: Channel name: `"+ message.channel.name +"`\n:link: (ID) Message: `"+ message.id +"`\n\n:pencil: Command: `"+ content +"`\n:alarm_clock: Date/time: `"+ day + " " + hr + ":" + min + ampm + " " + date + " " + month + " " + year +"`");

        client.channels.cache.get(config.log_commands).send(embed);
    }

    usos_anterior = usos;
});

client.login(process.env.TOKEN);