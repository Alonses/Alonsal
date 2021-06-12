const { Client } = require('discord.js');
const { existsSync } = require("fs");
const { ping_me_gif } = require('./arquivos/json/text/ping_me.json');
const { token, prefix, local_server, local_comando, ids_ignorados } = require('./config.json');
const commands = require('./comandos.json');
const client = new Client();

usos = 1708;
usos_anterior = 1708;

const talkedRecently = new Set();
const pastas = ["diversao", "jogos", "manutencao", "utilitarios"];

client.on("ready", () => {
    require("./adm/status.js")({client});
});

client.on("guildCreate", guild => {
    if(local_server === null) return;
    let caso = 'New';
    require("./adm/servers.js")({client, caso, guild, local_server});
});

client.on("guildDelete", guild => {
    if(local_server === null) return;
    let caso = 'Left';
    require("./adm/servers.js")({client, caso, guild, local_server});
});

client.on('message', (message) => {
    
    let content = message.content;
   
    if((content == "<@833349943539531806>" || content == "<@!833349943539531806>") && !message.author.bot){
        const ping_me = Math.round((ping_me_gif.length - 1) * Math.random());
        message.channel.send(ping_me_gif[ping_me])
    }

    // impede que o bot responda outros bots e ignora mensagens que não começem com o prefixo
    if (!content.startsWith(prefix) || message.author.bot) return
    if (!message.channel.name) return
    
    if(talkedRecently.has(message.author.id) && !ids_ignorados.includes(message.author.id)){
        message.channel.send(`:name_badge: ${message.author} Aguarde 3 segundos para enviar um comando novamente.`);
        return
    }else{
        talkedRecently.add(message.author.id);
        setTimeout(() => {
            talkedRecently.delete(message.author.id);
        }, 3000);
    }

    if(content === prefix){
        require("./adm/comando.js")({message});
        return;
    }
    
    const args = content.slice(prefix.length).trim().split(' ');
    
    const command = args.shift().toLowerCase();
    for(let i = 0; i < pastas.length; i++){
        path = `./comandos/${pastas[i]}/${commands[command]}`;
        if (existsSync(path)){
            usos++;

            if(message.content === prefix +"i" || message.content === prefix + "info")
                args.push(usos);

            require(path)({ client, message, args});
            break
        }
    }

    if(usos === usos_anterior)
        message.channel.send(`${message.author} erroooouuuuuuuuuuuuuuuuu`+ " use `.ah` ou `.ajuda` para ver todos os comandos.");
    else
        if (local_comando !== null)
            require('./adm/log.js')({client, message, content, local_comando});

    usos_anterior = usos;
});

client.login(token);