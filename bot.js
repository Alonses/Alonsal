const handler = require("wax-command-handler");
const discord = require("discord.js");
require('discord-reply');

const { readdirSync } = require("fs");
const { ping_me_gif } = require('./arquivos/json/gifs/ping_me.json');
let { token, prefix, pastas } = require('./config.json');
const client = new discord.Client();

let ultima_message;

function alerta_user(){ // Método rutes
    ultima_message.lineReply(':octagonal_sign: | O limite de emojis foi atingido, remova alguns para poder adicionar novos');
};

// (client: Discord.Client, prefix: string, ignore_bot: boolean, cooldown_message: string, permission_message: string, wrong_usage_message: string)
client.on("ready", async () => {

    console.log("Caldeiras aquecidas, pronto para operar");

    require("./adm/status.js")({client});

    // Configurando o wax e salvando os comandos para uso posterior
    let commandConfig = new handler.CommandConfig(
        client,
        prefix,
        true,
        "aguarde %TIME% segundos para enviar o comando `.a%CMD%` novamente",
        "você não tem a permissão `%PERM%` para executar este comando",
        "o uso correto deste comando é `"+ prefix +"%USAGE%`");
    
    handler.setup(commandConfig);
    
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

    const { emojis_dancantes } = require('./arquivos/json/text/emojis.json');

    let dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

    if(content.includes("<@833349943539531806>") || content.includes("<@!833349943539531806>")){ // Responde mensagens que é marcado
        
        message.lineReply(dancando +' | Aoba! Digite `.ahelp` ou `.ah` para ver a lista de comandos :D');

        // const ping_me = Math.round((ping_me_gif.length - 1) * Math.random());
        // message.channel.send(ping_me_gif[ping_me]);
        return;
    }

    if(content !== prefix && content.includes(prefix)){ // Previne que comandos sem aliases sejam acionados
        console.log("Comando exec: "+ content); // Temporário

        handler.messageReceived(message); // Invoca o comando
    }else{
        if(content === prefix)
            require('./adm/comando.js')({client, message, content}); // Alerta o usuário que está faltando
        return;
    }

    ultima_message = message;

    if(content.startsWith(prefix)) // Registra num log todos os comandos
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

process.on('unhandledRejection', res => { // Notifica em caso de erro por limite de emojis atingidos
    alerta_user();
});

client.login(token);