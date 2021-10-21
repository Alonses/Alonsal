const handler = require("wax-command-handler");
const { Client, MessageEmbed, Intents } = require("discord.js");

const { readdirSync } = require("fs");
let { token_2, prefix, pastas, comandos_musicais } = require('./config.json');
const {idioma_servers} = require("./arquivos/json/dados/idioma_servers.json");
const client = new Client({ intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]
});

String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
    return this.split(needle).join(replacement);
};

// Configurando o wax e salvando os comandos para uso posterior
const commandConfig = new handler.CommandConfig(
    client,
    prefix,
    true,
    __dirname + "/prefixes"
);

handler.setup(commandConfig);

client.on("ready", async () => {

    await require("./adm/status.js")({client});
    
    for(let i = 0; i < pastas.length; i++){
        for(const file of readdirSync(__dirname + `/comandos/${pastas[i]}`).filter(file => file.endsWith('.js'))) {
            const command = require(`./comandos/${pastas[i]}/${file}`);

            handler.addCommand(command);
        }
    }

    console.log("Caldeiras aquecidas, pronto para operar");
});

client.on("messageCreate", async message => {

    if (message.channel.type === "GUILD_TEXT") {

        const permissions = message.channel.permissionsFor(message.client.user);

        if (!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal
    }
    
    if (message.content.includes(client.user.id) && !message.content.includes("usinfo") && !message.content.includes("userinfo")) { // Responde as mensagens em que é marcado

        let prefix = client.prefixManager.getPrefix(message.guild.id);

        const {emojis_dancantes} = require('./arquivos/json/text/emojis.json');
        let dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();
        let idioma_selecionado = idioma_servers[message.guild.id]
        
        if(typeof idioma_selecionado == "undefined")
            idioma_selecionado = "pt-br";

        let {inicio} = require('./arquivos/idiomas/' + idioma_selecionado + '.json');

        message.reply(dancando + " | " + inicio[0]["menciona"].replaceAll(".a", prefix));

        delete require.cache[require.resolve("./arquivos/json/dados/idioma_servers.json")];
        return;
    }

    handler.messageReceived(message);
});

// Eventos secundários
require('./adm/eventos.js')({client});

handler.events.on("command_executed", async (command, discord_client, message, args) => {
    let prefix = client.prefixManager.getPrefix(message.guild.id);

    if (message.author.bot || message.webhookId) return;

    if (message.channel.type === "GUILD_TEXT") {
        const permissions = message.channel.permissionsFor(message.client.user);

        if (!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal
    }

    const content = message.content;

    if (content !== prefix) { // Previne que mensagens aleatórias acionem comandos
        let auto = true;
        let ult_comand = content;

        await require('./adm/eventos.js')({client, auto, ult_comand});

        let hora_comando = message.createdTimestamp;
        const data = new Date(hora_comando);

        console.log("Comando - Data: " + data + ", Autor: " + message.author.username + ", Server: " + message.guild.name + ", Comando: " + content);

        let comando_musical = content.replace(prefix, "");
        comando_musical = comando_musical.split(" ");

        try{
            if (comandos_musicais.includes(comando_musical[0])) { // Apenas utilizado em comandos musicais
                let ult_message = message;
                await require('./adm/eventos.js')({client, auto, ult_message});

                await require('./comandos/musicas/play.js')({message, client, args});
            } else await handler.executeCommand(command, discord_client, message, args);
        }catch(err){
            const embed = new MessageEmbed({
                title: "CeiraException",
                description: `\`\`\`${err.toString().substring(0, 2000)}\`\`\``,
                color: "RED"
            });
        
            await channel.send({ embeds: [embed] });
        }
    } else {
        if (content === prefix) {
            await require('./adm/comando.js')({client, message, content}); // Alerta o usuário que está faltando o comando
            return;
        }
    }

    await require('./adm/log.js')({client, message, content});

    delete require.cache[require.resolve("./arquivos/json/dados/idioma_servers.json")];
});

handler.events.on("command_error", async e => {
    console.log(e);

    const channel = client.channels.cache.get('862015290433994752');

    const embed = new MessageEmbed({
        title: "CeiraException",
        description: `\`\`\`${e.toString().substring(0, 2000)}\`\`\``,
        color: "RED"
    });

    await channel.send({ embeds: [embed] });
});

handler.events.on("cooldown", (message, timeleft) => {
    const { idioma_servers } = require('./arquivos/json/dados/idioma_servers.json');
    let { inicio } = require('./arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
    message.reply(`${inicio[0]["aguarde"]} \`${timeleft}\` ${inicio[0]["cooldown"]}`);
});

handler.events.on("no_perm", (message, permission) => {
    const { idioma_servers } = require('./arquivos/json/dados/idioma_servers.json');
    let { inicio } = require('./arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
    message.reply(`${inicio[0]["permissao_1"]} \`${permission}\` ${inicio[0]["permissao_2"]}`);
});

client.login(token_2);