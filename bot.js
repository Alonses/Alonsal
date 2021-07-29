const handler = require("wax-command-handler");
const discord = require("discord.js");

const { readdirSync } = require("fs");
const { ping_me_gif } = require('./arquivos/json/gifs/ping_me.json');
const { token, prefix, pastas } = require('./config.json');
const client = new discord.Client();

// (client: Discord.Client, prefix: string, ignore_bot: boolean, cooldown_message: string, permission_message: string, wrong_usage_message: string)
const commandConfig = new handler.CommandConfig(
    client,
    prefix,
    true,
    "aguarde %TIME% segundos para enviar o comando `.a%CMD%` novamente",
    "você não tem a permissão `%PERM%` para executar este comando",
    "o uso correto deste comando é `%USAGE%`");

handler.setup(commandConfig);

client.on("ready", async () => {

    require("./adm/status.js")({client});

    for(let i = 0; i < pastas.length; i++){
        for(const file of readdirSync(__dirname + `/comandos/${pastas[i]}`).filter(file => file.endsWith('.js'))) {
            const command = require(`./comandos/${pastas[i]}/${file}`);

            handler.addCommand(command);
        }
    }
});

client.on('message', message => {

    if(message.author.bot) return;
    
    let content = message.content;

    if((content === "<@833349943539531806>" || content === "<@!833349943539531806>") && !message.author.bot){
        const ping_me = Math.round((ping_me_gif.length - 1) * Math.random());
        message.channel.send(ping_me_gif[ping_me]);
        return;
    }

    if(content != ".a") // Previne que comandos sem aliases sejam acionados
        handler.messageReceived(message);
    else{
        require('./adm/comando.js')({client, message, content});
        return;
    }

    if(content.startsWith(".a"))
        require('./adm/log.js')({client, message, content});
});

client.on("guildCreate", guild => {
    let caso = 'New';
    require("./adm/servers.js")({client, caso, guild});
});

client.on("guildDelete", guild => {
    let caso = 'Left';
    require("./adm/servers.js")({client, caso, guild});
});

client.login(token);