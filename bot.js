const Discord = require('discord.js');
const { existsSync } = require('fs');
const config = require('./config.json');
const commands = require('./comandos.json');
const ping_me_gif = require('./ping_me.json');
const client = new Discord.Client();
require('dotenv').config();

prefix = config.prefix;
usos = config.usos;
usos_anterior = config.usos_anteriores;
local_server = config.log_servers;
local_comando = config.log_commands;

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
    var caso = 'New';

    require("./adm/servers.js")({client, caso, guild, local_server});
});

client.on("guildDelete", guild => {
    var caso = 'Left';

    require("./adm/servers.js")({client, caso, guild, local_server});
});

client.on('message', (message) => {
    
    var content = message.content;

    if((content == "<@!846472827212136498>" || content == "<@846472827212136498>") && !message.author.bot){
        var ping_me = 1 + Math.round(9 * Math.random())
        ping_me = ping_me.toString()
        message.channel.send(ping_me_gif[ping_me])
    }

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

            if(message.content == prefix +"i" || message.content == prefix +"info")
                args.push(usos);

            require(path)({client, message, args});
            break;
        }
    }

    if(content == prefix){
        const comando = new Discord.MessageAttachment('arquivos/img/sem_comando.jpg');

        message.channel.send(`${message.author} Kd o comando fiote!`, comando);
    }

    if(usos == usos_anterior)
        message.channel.send(`${message.author} erroooouuuuuuuuuuuuuuuuu`+ " use `.h` ou `.help` caso queira ver todos os comandos ;)");
    else
        require('./adm/log.js')({client, message, content, local_comando});

    usos_anterior = usos;
});

client.login(process.env.TOKEN);
