const handler = require("wax-command-handler");
const discord = require("discord.js");
require('discord-reply');

const { readdirSync } = require("fs");
let { token, prefix, pastas, comandos_musicais } = require('./config.json');
const client = new discord.Client();
const { MessageEmbed } = require('discord.js');

let ult_comand;
let ult_message;
let conexoes_ativas = 0;

canais_conectados = new Map();
servers_conectados = new Map();

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

    if(message.author.bot || message.webhookId) return;

    let content = message.content;

    if(message.content == "<@"+ client.user.id + ">" || message.content == "<@!"+ client.user.id + ">"){ // Responde mensagens que é marcado
        
        const { emojis_dancantes } = require('./arquivos/json/text/emojis.json');
        let dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        message.lineReply(dancando + " | Aoba! Digite `.ahelp` ou `.ah` para ver a lista de comandos :D");
        return;
    }

    if(content !== prefix && content.includes(prefix)){ // Previne que mensagens aleatórias acionem comandos
        ult_comand = content;

        if(content.startsWith(prefix))
            console.log("Comando exec: "+ message.author.username +", "+ message.guild.name +", "+ content);

        let comando_musical = content.replace(".a", "");
        comando_musical = comando_musical.split(" ");

        if(comandos_musicais.includes(comando_musical[0])){ // Apenas utilizado em comandos musicais
            ult_message = message;

            const args = content.slice(prefix.length).trim().split(' ');
            require('./comandos/musicas/play.js')({message, client, args});
        }else
            if(content.startsWith(prefix))
                handler.messageReceived(message); // Invoca o comando
    }else{
        if(content === prefix)
            require('./adm/comando.js')({client, message, content}); // Alerta o usuário que está faltando
        return;
    }

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

client.on("voiceStateUpdate", guild => {
        
    if(guild.guild.client.voice.connections.size < conexoes_ativas){
        // Processa quando o bot é desconectado do canal por um usuário manualmente
        conexoes_ativas--;

        const id_canal_desconectado = guild.channelID; // Canal de voz
        
        let id_canal_comando = servers_conectados.get(guild.guild.id); // Canal de texto 
        let id_mensagem = canais_conectados.get(guild.guild.id);
        
        const channel = client.channels.cache.get(id_canal_comando);
        const message = channel.messages.cache.get(id_mensagem);

        const args = message.content.slice(prefix.length).trim().split(' ');
        
        require('./comandos/musicas/play.js')({message, client, args, id_canal_desconectado});

        servers_conectados.set(guild.guild.id, []);
        canais_conectados.set(guild.guild.id, []);
    }else{ // Salva num mapa os comandos quando há atualizações nos canais de voz
        if(typeof ult_message.guild.id !== "undefined"){
            conexoes_ativas = guild.guild.client.voice.connections.size;
        
            servers_conectados.set(ult_message.guild.id, ult_message.channel.id);
            canais_conectados.set(ult_message.guild.id, ult_message.id);
        }
    }
});

client.on("rateLimit", limit => {
    const embed = new MessageEmbed()
    .setTitle("> RateLimit :name_badge:")
    .setColor(0xff0000)
    .setDescription("Command: `"+ ult_comand +"`\nTimeout: `"+ limit.timeout +"`\nLimit: `"+ limit.limit +"`\nMethod: `"+ limit.method +"`\n\nPath: `"+ limit.path +"`\nRoute: `"+ limit.route +"`");

    client.channels.cache.get('872865396200452127').send(embed);
});

client.login(token);