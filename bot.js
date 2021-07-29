const handler = require("wax-command-handler");
const discord = require("discord.js");

const { readdirSync } = require("fs");
const { ping_me_gif } = require('./arquivos/json/gifs/ping_me.json');
let { token, prefix, pastas } = require('./config.json');
// const { prefix_server } = require('./prefix_servers.json');
const client = new discord.Client();

// let prefix = ".a";
// const sqlite = require("sqlite3").verbose();

// (client: Discord.Client, prefix: string, ignore_bot: boolean, cooldown_message: string, permission_message: string, wrong_usage_message: string)
client.on("ready", async () => {

    console.log("Caldeiras aquecidas, pronto para operar");

    // let db = new sqlite.Database('./adm/base_dados.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);

    require("./adm/status.js")({client});

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

    // prefix = prefix_server[message.guild.id];

    let content = message.content;
    // let guild = message.guild;
    // require('./adm/banco.js')({client, message, content, guild}); // Conexão com o banco

    // let db = new sqlite.Database('./adm/base_dados.db', sqlite.OPEN_READONLY);
    //     let query = `SELECT prefix FROM servers WHERE id_server = ?`;
    //     db.get(query, [guild.id], (err, row) => {
            
    //         if(row !== undefined)
    //             prefix = row.prefix;
    //         else
    //             prefix = ".a";

    //         db.close();
    //     });

    // console.log(message.content);

    // if(!content.startsWith(prefix))
    //     return;
    // else
    //     message.content = message.content.replace(prefix, ".a");

    if((content === "<@833349943539531806>" || content === "<@!833349943539531806>") && !message.author.bot){
        const ping_me = Math.round((ping_me_gif.length - 1) * Math.random());
        message.channel.send(ping_me_gif[ping_me]);
        return;
    }

    if(content !== prefix && content.includes(prefix)) // Previne que comandos sem aliases sejam acionados
        handler.messageReceived(message);
    else{
        if(content === prefix)
            require('./adm/comando.js')({client, message, content}); // Alerta o usuário que está faltando
        return;
    }

    if(content.startsWith(prefix))
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