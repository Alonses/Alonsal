const handler = require("wax-command-handler");
const discord = require("discord.js");
require('discord-reply');

const { readdirSync } = require("fs");
let { token, prefix, pastas, comandos_musicais } = require('./config.json');
const client = new discord.Client();

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

    if(message.channel.type == "text"){
        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(!permissions.has("SEND_MESSAGES")) // Permissão para enviar mensagens no canal
            return;
    }

    let content = message.content;
    const args = content.slice(prefix.length).trim().split(' ');

    var reload = require('auto-reload');
    const { idioma_servers } = reload('./arquivos/json/dados/idioma_servers.json');
        
    if(content.startsWith(".alang") || content.startsWith(".aram") || typeof idioma_servers[message.guild.id] == "undefined"){
        let requisicao_auto = true;

        require('./adm/requisitor.js')({client, message, args, requisicao_auto});  
        return;
    }

    if(message.content.includes(client.user.id)){ // Responde as mensagens em que é marcado
            
        const { emojis_dancantes } = require('./arquivos/json/text/emojis.json');
        let dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        const { inicio } = require('./arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        
        message.lineReply(dancando + " | "+ inicio[0]["menciona"]);
        return;
    }

    if(content !== prefix && content.includes(prefix)){ // Previne que mensagens aleatórias acionem comandos
        
        let auto = true;
        let ult_comand = content;
        require('./adm/eventos.js')({client, auto, ult_comand});

        if(content.startsWith(prefix)){
         
            let hora_comando = message.createdTimestamp;
            data = new Date(hora_comando);

            console.log("Comando exec/ Autor: "+ message.author.username +", Server: "+ message.guild.name +", Hora: "+ data +", Comando: "+ content);
        }
        let comando_musical = content.replace(".a", "");
        comando_musical = comando_musical.split(" ");

        if(comandos_musicais.includes(comando_musical[0])){ // Apenas utilizado em comandos musicais
            let ult_message = message;
            require('./adm/eventos.js')({client, auto, ult_message});

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

// Eventos secundários
require('./adm/eventos.js')({client});

client.login(token);