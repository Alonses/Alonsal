module.exports = {
    name: "clear",
    description: "apaga mensagens de chat",
    aliases: [ "cl", "limpar", "apagar" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const permissions_user = message.channel.permissionsFor(message.author);
        const permissions_bot = message.channel.permissionsFor(message.client.user);

        if(!permissions_user.has("MANAGE_MESSAGES"))
            return message.reply(`:octagonal_sign: | ${moderacao[1]["permissao_1"]}`).then(msg => setTimeout(() => msg.delete(), 5000));
            
        if(!permissions_bot.has("MANAGE_MESSAGES")) // Permissão para gerenciar mensagens
            return message.reply(`:octagonal_sign: | ${moderacao[1]["permissao_2"]}`).then(msg => setTimeout(() => msg.delete(), 5000));

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";

        if(args.length !== 1 || isNaN(args[0])) // Caracteres de texto ou sem entradas suficientes
            return message.reply(moderacao[1]["aviso_1"].replaceAll(".a", prefix));
    
        if(args[0] < 1 || args[0] > 100) // Valor maior que 100 ou menor que 1
            return message.reply(moderacao[1]["aviso_2"]);
    
        let texto = moderacao[1]["apagado_1"];
    
        if(args[0].value === 1)
            texto = moderacao[1]["apagado_2"];
        
        message.channel.bulkDelete(parseInt(args[0]))
        .then(() => {
            message.channel.send(`:hotsprings: | ${message.author}, \`${args[0]} ${texto}`).then(msg => setTimeout(() => msg.delete(), 5000));
        })
        .catch(err => {
            message.reply(`:octagonal_sign: | ${moderacao[1]["error"]}`).then(msg => setTimeout(() => msg.delete(), 5000))
        });
        
        message.delete() // apaga a mensagem do comando
    }
};