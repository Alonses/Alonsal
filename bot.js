const handler = require("wax-command-handler");
const idioma = require("./adm/idioma");
const { Client, MessageEmbed, Intents } = require("discord.js");

const { readdirSync } = require("fs");
const {token, prefix, owner_id} = require('./config.json');
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
    __dirname + "/arquivos/data/prefixes"
);

handler.setup(commandConfig);

client.on("ready", async () => {

    await require("./adm/status.js")({client});
    
    await handler.useSlashHandler();

    for (const folder of readdirSync(__dirname + "/comandos/")){
        for (const file of readdirSync(__dirname + "/comandos/" + folder).filter(file => file.endsWith('.js'))) {
            const command = require(`./comandos/${folder}/${file}`);
            handler.addCommand(command);

            if(command.slash) handler.addSlashCommand(command);
        }
    }

    idioma.setPath(__dirname + "/arquivos/data/idiomas");
    idioma.setDefault("pt-br");

    client.idioma = idioma;
    client.owners = owner_id;

    console.log("Caldeiras aquecidas, pronto para operar");
});

client.on("messageCreate", async message => {

    let prefix = client.prefixManager.getPrefix(message.guild.id);
    if(!prefix)
        prefix = ".a";

    if (message.channel.type === "GUILD_TEXT") {
        const permissions = message.channel.permissionsFor(message.client.user);

        if (!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal
    }
    
    if (message.content.includes(client.user.id) && !message.content.startsWith(prefix +"usinfo") && !message.content.startsWith(prefix +"userinfo") && !message.content.startsWith(prefix +"gado") && !message.content.startsWith(prefix +"ga")) { // Responde as mensagens em que é marcado

        const { emojis_dancantes } = require('./arquivos/json/text/emojis.json');
        let dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();
        let idioma_selecionado = idioma.getLang(message.guild.id);

        let { inicio } = require('./arquivos/idiomas/' + idioma_selecionado + '.json');

        await message.reply(dancando + " | " + inicio[0]["menciona"].replaceAll(".a", prefix));
        return;
    }

    if (message.content !== prefix)
        handler.messageReceived(message);
    else
        await require('./adm/comando.js')({client, message});
});

client.ws.on("INTERACTION_CREATE", async data => {
    handler.wsInteractionReceived(data);
});

// Eventos secundários
require('./adm/eventos.js')({client});

handler.events.on("command_executed", async (command, discord_client, message, args) => {

    if (message.author.bot || message.webhookId) return;

    if (message.channel.type === "GUILD_TEXT") {
        const permissions = message.channel.permissionsFor(message.client.user);

        if (!permissions.has("SEND_MESSAGES")) return; // Permissão para enviar mensagens no canal
    }

    const content = message.content;

    let ult_comand = content;

    await require('./adm/eventos.js')({client, auto: true, ult_comand});

    let hora_comando = message.createdTimestamp;
    const data = new Date(hora_comando);

    await handler.executeCommand(command, discord_client, message, args);

    console.log("Comando - Data: " + data + ", Autor: " + message.author.username + ", Server: " + message.guild.name + ", Comando: " + content);

    await require('./adm/log.js')({client, message, content});
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
    let { inicio } = require('./arquivos/idiomas/'+ idioma.getLang(message.guild.id) +'.json');
    message.reply(`${inicio[0]["aguarde"]} \`${timeleft.toFixed(2)}\` ${inicio[0]["cooldown"]}`);
});

handler.events.on("no_perm", (message, permission) => {
    const { inicio } = require('./arquivos/idiomas/'+ idioma.getLang(message.guild.id) +'.json');
    message.reply(`${inicio[0]["permissao_1"]} \`${permission}\` ${inicio[0]["permissao_2"]}`);
});

handler.events.on("no_args", (message, command) => {
    const { inicio } = require('./arquivos/idiomas/'+ idioma.getLang(message.guild.id) +'.json');
    message.reply(inicio[0]["error_1"] + ": `" + prefix + command.usage + "`");
});

client.login(token);