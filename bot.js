const handler = require("wax-command-handler");
const discord = require("discord.js");
require('discord-reply');

const { readdirSync } = require("fs");
let { token, prefix, pastas, comandos_musicais } = require('./config.json');
const client = new discord.Client();

String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
    return this.split(needle).join(replacement);
};

// Configurando o wax e salvando os comandos para uso posterior
const commandConfig = new handler.CommandConfig(
    client,
    prefix,
    true,
    __dirname + "\\prefixes"
);

handler.setup(commandConfig);

client.on("ready", async () => {

    require("./adm/status.js")({client});
    
    for(let i = 0; i < pastas.length; i++){
        for(const file of readdirSync(__dirname + `/comandos/${pastas[i]}`).filter(file => file.endsWith('.js'))) {
            const command = require(`./comandos/${pastas[i]}/${file}`);

            handler.addCommand(command);
        }
    }

    console.log("Caldeiras aquecidas, pronto para operar");
});

client.on('message', message => {

    let prefix = client.prefixManager.getPrefix(message.guild.id);
    
    console.log(typeof prefix);

    if(typeof prefix == "undefined"){
        client.prefixManager.setPrefix(message.guild.id, ".a");    
        prefix = ".a";
    }

    if(message.author.bot || message.webhookId) return;

    if(message.channel.type == "text"){
        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal
    }

    let content = message.content;
    args = content.slice(prefix.length).trim().split(' ');
    
    var reload = require('auto-reload');
    const { idioma_servers } = reload('./arquivos/json/dados/idioma_servers.json');
    
    if(content.startsWith(prefix+"lang") || content.startsWith(prefix+"ram") || typeof idioma_servers[message.guild.id] == "undefined"){
        let requisicao_auto = true;

        return require('./adm/requisitor.js')({client, message, args, requisicao_auto});  
    }

    if(message.content.includes(client.user.id)){ // Responde as mensagens em que é marcado
        
        const { emojis_dancantes } = require('./arquivos/json/text/emojis.json');
        let dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        let { inicio } = require('./arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        
        return message.lineReply(dancando + " | "+ inicio[0]["menciona"].replaceAll(".a", prefix));
    }

    if(content !== prefix && content.includes(prefix)){ // Previne que mensagens aleatórias acionem comandos
        
        let auto = true;
        let ult_comand = content;
        require('./adm/eventos.js')({client, auto, ult_comand});

        if(content.startsWith(prefix)){
         
            let hora_comando = message.createdTimestamp;
            data = new Date(hora_comando);

            console.log("Comando -> Data: "+ data +", Autor: "+ message.author.username +", Server: "+ message.guild.name +", Comando: "+ content);
        }

        let comando_musical = content.replace(prefix, "");
        comando_musical = comando_musical.split(" ");

        if(comandos_musicais.includes(comando_musical[0])){ // Apenas utilizado em comandos musicais
            let ult_message = message;
            require('./adm/eventos.js')({client, auto, ult_message});

            require('./comandos/musicas/play.js')({message, client, args});
        }else
            if(content.startsWith(prefix))
                handler.messageReceived(message); // Invoca o comando
    }else{
        if(content === prefix){
            require('./adm/comando.js')({client, message, content}); // Alerta o usuário que está faltando
            return;
        }
    }

    if(content.startsWith(prefix)) // Registra num log todos os comandos
        require('./adm/log.js')({client, message, content});
});

// Eventos secundários
require('./adm/eventos.js')({client});

handler.events.on("command_error", e => { client.channels.cache.get('862015290433994752').send(e); console.log(e); });

handler.events.on("cooldown", (message, timeleft) => {
    var reload = require('auto-reload');
    const { idioma_servers } = reload('./arquivos/json/dados/idioma_servers.json');
    let { inicio } = require('./arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
    message.lineReply(`${inicio[0]["aguarde"]} \`${timeleft}\` ${inicio[0]["cooldown"]}`);
});

handler.events.on("no_perm", (message, permission) => {
    var reload = require('auto-reload');
    const { idioma_servers } = reload('./arquivos/json/dados/idioma_servers.json');
    let { inicio } = require('./arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
    message.lineReply(`${inicio[0]["permissao_1"]} \`${permission}\` ${inicio[0]["permissao_2"]}`);
});

client.login(token);