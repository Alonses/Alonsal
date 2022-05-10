const handler = require("wax-command-handler");
const idioma = require("./adm/idioma");
const { Client, MessageEmbed, Intents } = require("discord.js");
const { emojis_negativos } = require('./arquivos/json/text/emojis.json');

const { readdirSync } = require("fs");
const {token, token_2, prefix, owner_id} = require('./config.json');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS ]
});

String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
    return this.split(needle).join(replacement);
};
    
// Configurando o wax e salvando os comandos para uso posterior
const commandConfig = new handler.CommandConfig(
    client,
    prefix,
    true,
    `${__dirname}/arquivos/data/prefixes`
);

handler.setup(commandConfig);

client.on("ready", async () => {

    try{
        await require("./adm/internos/status.js")({client});
        await handler.useSlashHandler();
        
        for (const folder of readdirSync(`${__dirname}/comandos/`)){
            for (const file of readdirSync(`${__dirname}/comandos/${folder}`).filter(file => file.endsWith('.js'))) {
                const command = require(`./comandos/${folder}/${file}`);
                handler.addCommand(command);

                if(command.slash) handler.addSlashCommand(command);
            }
        }

        idioma.setPath(`${__dirname}/arquivos/data/idiomas`);
        idioma.setDefault("pt-br");

        client.idioma = idioma;
        client.owners = owner_id;

        console.log("Caldeiras aquecidas, pronto para operar");
    }catch(err){
        console.log(err);
    }
});

client.on("messageCreate", async message => {

    try{ // Detectador de ceiras extremas
        if (message.author.bot || message.webhookId) return;
        
        if(client.user.id === "833349943539531806")
            if(message.content.length >= 7) await require('./adm/ranking.js')({client, message}); // Ranking de XP

        const prefix = client.prefixManager.getPrefix(message.guild.id);

        if (message.channel.type === "GUILD_TEXT") {
            const permissions = message.channel.permissionsFor(message.client.user);

            if (!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal
        }
        
        if (message.content.includes(client.user.id) && !message.content.startsWith(`${prefix}usinfo`) && !message.content.startsWith(`${prefix}userinfo`) && !message.content.startsWith(`${prefix}gado`) && !message.content.startsWith(`${prefix}ga`)) { // Responde as mensagens em que é marcado

            const { emojis_dancantes } = require('./arquivos/json/text/emojis.json');
            const dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();
            const idioma_selecionado = idioma.getLang(message.guild.id);

            const { inicio } = require(`./arquivos/idiomas/${idioma_selecionado}.json`);

            return message.reply(`${dancando} | ${inicio[0]["menciona"].replaceAll(".a", prefix)}`);
        }

        if (message.content !== prefix)
            handler.messageReceived(message);
        else
            await require('./adm/internos/comando.js')({client, message});
        
        if(!message.content.startsWith(prefix)){
            const caso = "msg_enviada";
            await require('./adm/relatorio.js')({client, caso});
        }
    }catch(e){
        console.log(e);
    }
});

// client.ws.on("INTERACTION_CREATE", async (data, interaction) => {
//     try{
//         handler.wsInteractionReceived(data, interaction);
//     }catch(err){
//         console.log(err);
//     }
// });

// Eventos secundários
require('./adm/internos/eventos.js')({client});

handler.events.on("command_executed", async (command, discord_client, message, args) => {

    try{
        if (message.author.bot || message.webhookId) return;

        if (message.channel.type === "GUILD_TEXT") {
            const permissions = message.channel.permissionsFor(message.client.user);

            if (!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal
        }

        const content = message.content;
        await handler.executeCommand(command, discord_client, message, args);
        await require('./adm/internos/log.js')({client, message, content});
    }catch(err){
        console.log(err);
    }
});

handler.events.on("command_error", async (e, command, client, message) => {

    try{
        if(typeof message !== "undefined"){
            const { inicio } = require(`./arquivos/idiomas/${idioma.getLang(message.guild.id)}.json`);
            const epic_embed_fail = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();

            message.reply(`${epic_embed_fail} | ${inicio[0]["epic_embed_fail"]}`); // Notificando o usuário
        }

        const embed = new MessageEmbed({
            title: "> CeiraException",
            description: `\`\`\`${e.toString().substr(0, 2000)}\`\`\``,
            color: "RED"
        });

        await client.channels.cache.get('862015290433994752').send({ embeds: [embed] }); // Notificando o canal de erros
        console.log(e);
    }catch(err){
        console.log(err);
    }
});

handler.events.on("cooldown", (message, timeleft) => {
    const { inicio } = require(`./arquivos/idiomas/${idioma.getLang(message.guild.id)}.json`);
    message.reply(`${inicio[0]["aguarde"]} \`${timeleft.toFixed(2)}\` ${inicio[0]["cooldown"]}`);
});

handler.events.on("no_perm", (message, permission) => {
    const { inicio } = require(`./arquivos/idiomas/${idioma.getLang(message.guild.id)}.json`);
    message.reply(`${inicio[0]["permissao_1"]} \`${permission}\` ${inicio[0]["permissao_2"]}`);
});

handler.events.on("no_args", (message, command) => {
    const { inicio } = require(`./arquivos/idiomas/${idioma.getLang(message.guild.id)}.json`);
    message.reply(`${inicio[0]["error_1"]}: \`${prefix}${command.usage}\``);
});

handler.events.on("invalid_args", (args, message, command) => {
    const { inicio } = require(`./arquivos/idiomas/${idioma.getLang(message.guild.id)}.json`);
    message.reply(`${inicio[0]["error_1"]}: \`${prefix}${command.usage}\``);
});
 
client.login(token);