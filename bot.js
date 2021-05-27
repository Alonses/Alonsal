const Discord = require('discord.js');
const { fs, existsSync } = require('fs');
const config = require('./config.json');
const bot = new Discord.Client();
require('dotenv').config();

prefix = config.prefix;
usos = config.usos;
usos_anterior = config.usos_anteriores;

const talkedRecently = new Set();

const PORT = process.env.PORT || 3000;

const comandos = ["help", "curio", "musica", "info", "briga", "joke", "cazalbe", "morse", "binario", "ping", "dado", "reproducao", "wiki", "hora", "mail", "baidu", "rps", "coin", "paz", "esfiha", "gado", "ceira", "piao"];
const aliases = ["h", "c", "st", "i", "b", "j", "caz", "m", "b", "p", "da", "rep", "w", "ho", "ma", "du", "jkp", "co", "pz", "sf", "ga", "ceira", "pi"];
const pastas = ["diversao", "jogos", "manutencao", "utilitarios"];

bot.on("ready", () => {
    console.log(`Caldeiras aquecidas!`);
    console.log(`Ativo para ${bot.users.cache.size} usuários em ${bot.channels.cache.size} canais em ${bot.guilds.cache.size} servidores diferentes!`);

    bot.user.setActivity('Vapor p/ fora!', 'COMPETING')
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
    setInterval(() => bot.user.setActivity(`${activities[i++ % activities.length]}`), 5000);
});

bot.on("guildCreate", guild => {
    const embed_sv = new Discord.MessageEmbed()
        .setTitle("> Server update ( New )")
        .setColor(0x29BB8E)
        .setDescription(":globe_with_meridians: (ID) Server: `"+ `${guild.id}` +"`\n:label: Server name: `"+ `${guild.name}` + "`\n\n:busts_in_silhouette: Members: `"+ `+${guild.memberCount}`+ "`");

    bot.channels.cache.get(config.log_servers).send(embed_sv);
});

bot.on("guildDelete", guild => {
    const embed_sv = new Discord.MessageEmbed()
        .setTitle("> Server update ( Left )")
        .setColor(0xd4130d)
        .setDescription(":globe_with_meridians: (ID) Server: `"+ `${guild.id}` +"`\n:label: Server name: `"+ `${guild.name}` + "`\n\n:busts_in_silhouette: Members: `"+ `-${guild.memberCount}`+ "`");

    bot.channels.cache.get(config.log_servers).send(embed_sv);
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

    const args = content.slice(prefix.length).trim().split(' ');

    for(var i = 0; i < comandos.length; i++){
        if(aliases[i] == args[0]){
            args[0] = comandos[i];
            break;
        }
    }

    const command = args.shift().toLowerCase();    
    for(var i = 0; i < pastas.length; i++){
        path = `./comandos/${pastas[i]}/${command}.js`;
        if (existsSync(path)){
            usos++;
            require(path)({ bot, message, args });
            break;
        }
    }

    if(content == prefix){

        const comando = new Discord.MessageAttachment('arquivos/img/sem_comando.jpg');

        message.channel.send(`${message.author} Kd o comando fiote!`, comando);
    }

    if(usos == usos_anterior){
        message.channel.send(`${message.author} erroooouuuuuuuuuuuuuuuuu`+ " use `.h` ou `.help` caso queira ver todos os comandos ;)");
    }else{

        try{
            var data = fs.readFileSync("usos.txt", 'utf8');
            console.log(data.toString());
        }catch(e){
            console.log('Não foi possível abrir o arquivo');
        }

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
        .setDescription(":man_raising_hand: (ID) User: `"+ message.author +"`\n:label: Username: `"+ message.author.username +"`\n\n:link: (ID) Server: `"+ message.guild.id +"`\n:label: Server name: `"+ message.guild.name +"`\n:link: (ID) Channel: `"+ message.channel.id + "`\n:label: Channel name: `"+ message.channel.name +"`\n:link: (ID) Message: `"+ message.id +"`\n\n:pencil: Command: `"+ content +"`\n:alarm_clock: Date/time: `"+ day + " " + hr + ":" + min + ampm + " " + date + " " + month + " " + year +"`");

        bot.channels.cache.get(config.log_commands).send(embed);
    }

    usos_anterior = usos;
});

module.exports = bot;