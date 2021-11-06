module.exports = {
    name: "prefixo",
    description: "Altere o prefixo do alonsal",
    cooldown: 5,
    aliases: [ "setprefix", "prefix", "px" ],
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        
        if(!message.member.permissions.has('MANAGE_GUILD') && !client.owners.includes(message.author.id)) return message.reply(`:octagonal_sign: | ${moderacao[5]["moderadores"]}`); // Libera configuração para o proprietários e adms apenas

        if(args.length !== 1)
            return message.reply(`:interrobang: | ${moderacao[5]["error_1"]} \`+px\``).then(msg => setTimeout(() => msg.delete(), 5000));
        
        client.prefixManager.setPrefix(message.guild.id, args[0])
        message.reply(`:asterisk: | ${moderacao[5]["att_prefix"]} \`${args[0]}\``);

        client.channels.cache.get('872865396200452127').send(`:asterisk: | Prefixo do servidor ( \`${message.guild.name}\` | \`${message.guild.id}\` ) alterado para : \`${args[0]}\``);
    }
};