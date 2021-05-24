const Discord = require('discord.js');
const { existsSync } = require("fs");
const config = require('./config.json');
const bot = new Discord.Client();
require('dotenv').config();

prefix = config.prefix;
log_alonsal = config.log_alonsal;
usos = config.usos;
usos_anterior = config.usos_anteriores;

const talkedRecently = new Set();

const PORT = process.env.PORT || 3000;

// Ativar o bot [ npm test ]
// Hospedando ${bot.users.size} usuários em ${bot.channels.size} canais e em ${bot.guilds.size} servidores diferentes!

bot.on("ready", () => {
    console.log(`Caldeiras aquecidas!`);
    console.log(`Ativo para ${bot.users.cache.size} usuários em ${bot.channels.cache.size} canais em ${bot.guilds.cache.size} servidores diferentes!`);

    bot.user.setActivity('Vapor p/ fora!', 'COMPETING')
    let activities = [
        "ãh | ãhelp",
        "Binário na fogueira",
        "Músicas no ar",
        "Mesas p/ cima",
        "ãh | ãhelp",
        "Código morse para o mundo",
        "Bugs infinitos no sistema",
        "Vapor p/ fora!"
    ]
    
    i = 0;
    setInterval(() => bot.user.setActivity(`${activities[i++ % activities.length]}`), 5000);
});

bot.on("guildCreate", guild => {
    console.log(`O Alonso entrou no servidor: ${guild.name} ( ID: ${guild.id} ), que contém: ${guild.memberCount} membros`);
    bot.user.setActivity(`Estou em ${bot.guilds.cache.size}`);
});

bot.on("guildDelete", guild => {
    console.log(`O Alonso foi removido de um servidor: ${guild.name} ( ID: ${guild.id} )`);
    bot.user.setActivity(`Estou em ${bot.guilds.cache.size}`);
});

bot.on('message', (message) => {
    
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

    if(content == "ãc")
        content = "ãcurio";
    else if(content == "ãi"){
        content = "ãinfo";
        content += " "+ usos;
    }else if(content == "ãb")
        content = "ãbriga";
    else if(content.includes("ãst"))
        content = content.replace("ãst", "ãmusica");
    else if(content == "ãj")
        content = "ãjoke";
    else if(content == "ãh")
        content = "ãhelp";
    else if(content == "ãcaz")
        content = "ãcazalbe";
    else if(content.includes("ãw") && !content.includes("ãwiki"))
        content = content.replace("ãw", "ãwiki");
    else if(content.includes("ãm") && !content.includes("ãmorse"))
        content = content.replace("ãm", "ãmorse");
    else if(content.includes("ãb") && !content.includes("ãbinario"))
        content = content.replace("ãb", "ãbinario");
    else if(content.includes("ãco"))
        content = content.replace("ãco", "ãcoin");
    else if(content.includes("ãjkp"))
        content = content.replace("ãjkp", "ãrps");
    else if(content.includes("ãga") && !content.includes("ãgado"))
        content = content.replace("ãga", "ãgado");
    else if(content == "ãp")
        content = "ãping";

    const args = content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    
    const path = `./comandos/${command}.js`;
    if (existsSync(path)){
        usos++;
        require(path)({ bot, message, args });
    }

    if(content == 'ã'){

        const comando = new Discord.MessageAttachment('arquivos/img/sem_comando.jpg');

        message.channel.send(`${message.author} Kd o comando fiote!`, comando);
    }

    if(content == 'ãda' || content == 'ãdado'){
        
        usos++;
        var dado = 1 + Math.round(5 * Math.random());

        message.channel.send('O dado caiu no [ '+ dado + ' ]');
    }

    if(content == 'ãpaz' || content == 'ãpz'){
        
        usos++;
        message.channel.send('https://tenor.com/view/galerito-gil-das-esfihas-meme-br-slondo-gif-15414263');
    }

    if(content == 'ãsf' || content == 'ãsfiha'){

        usos++;
        message.channel.send(`Vai uma esfiha ae? :yum: :yum: :yum:`);
        message.channel.send('https://tenor.com/view/gil-das-esfihas-galerito-esfiha-meme-brasil-gif-21194713');
    }

    if(content == 'ãpi' || content == 'ãpiao'){

        usos++;
        message.channel.send(`Roda o pião! ${message.author}`);
        message.channel.send('https://tenor.com/view/pi%C3%A3o-da-casa-propria-silvio-santos-dona-maria-slondo-loop-gif-21153780');
    }

    if(content == "ãbaidu" || content == "ãdu"){

        usos++;
        const baidu = new Discord.MessageAttachment('arquivos/img/baidu.png');

        message.channel.send(`${message.author} Louvado seja!!`, baidu);
    }

    if(content == 'ãho' || content == 'ãhora'){

        usos++;
        const hora = new Discord.MessageAttachment('arquivos/sng/hora_certa.mp3');

        message.channel.send(`${message.author} Hora certa!`, hora);
    }

    if(content.includes("ãrep")){

        usos++;
        content = content.replace("ãrep", "");

        message.channel.send(content, {
            tts: true
           });
    }

    if(content == "ãsds"){
        usos++;
        const silvio = new Discord.MessageAttachment('arquivos/img/sss.png');

        message.channel.send(silvio);
    }

    if(content.includes("ãceira") || content.includes("ceira")){
        usos++;

        message.channel.send("Sai pra lá com essa ceira!\nIsso é trabalho do <@843623764570800148> :v");
    }

    if(usos == usos_anterior){
        message.channel.send(`${message.author} erroooouuuuuuuuuuuuuuuuu`+ " use `ãh` ou `ãhelp` caso queira ver todos os comandos ;)");
    }else{

        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var d = new Date();
        var day = days[d.getDay()];
        var hr = d.getHours();
        var min = d.getMinutes();

        if (min < 10) {
            min = "0" + min;
        }
        
        var ampm = "am";
        if( hr > 12 ) {
            hr -= 12;
            ampm = "pm";
        }

        var date = d.getDate();
        var month = months[d.getMonth()];
        var year = d.getFullYear();

        const embed = new Discord.MessageEmbed()
        .setTitle("> New interaction")
        .setColor(0x29BB8E)
        .setDescription(":man_raising_hand: (ID) User: `"+ message.author +"`\n:label: Username: `"+ message.author.username +"`\n\n:link: (ID) Server: `"+ message.guild.id +"`\n:link: (ID) Channel: `"+ message.channel.id + "`\n:link: (ID) Message: `"+ message.id +"`\n\n:pencil: Command: `"+ content +"`\n:alarm_clock: Date/time: `"+ day + " " + hr + ":" + min + ampm + " " + date + " " + month + " " + year +"`");

        bot.channels.cache.get(log_alonsal).send(embed);
    }

    usos_anterior = usos;
});

module.exports = bot;