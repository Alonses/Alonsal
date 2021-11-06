module.exports = {
    name: "gado",
    description: "Teste a gadisse de alguém",
    aliases: [ "ga" ],
    usage: "gado <member>",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const lang = client.idioma.getLang(message.guild.id);
        const { diversao } = require(`../../arquivos/idiomas/${lang}.json`);
        const { gadisissimo } = require(`../../arquivos/json/text/${lang}/gado.json`);

        const num = Math.round((gadisissimo.length - 1) * Math.random());
        const alvo = args[0].value;

        if(client.user.id === alvo.id)
            return message.channel.send(`${message.author} ${diversao[3]["error_2"]}`);

        if(alvo.id !== message.author.id)
            if(lang === "pt-br")
                message.channel.send(`O <@${alvo.id}> ${gadisissimo[num]}`);
            else
                message.channel.send(`The <@${alvo.id}> ${gadisissimo[num]}`);
        else
            if(lang === "pt-br")
                message.channel.send(`Você ${message.author} ${gadisissimo[num]}`);
            else
                message.channel.send(`You ${message.author} ${gadisissimo[num]}`);

        const permissions = message.channel.permissionsFor(message.client.user);
        
        if(permissions.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            message.delete();
    }
};