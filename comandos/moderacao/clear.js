module.exports = {
    name: "clear",
    description: "apaga mensagens de chat",
    aliases: [ "cl", "limpar", "apagar" ],
    cooldown: 3,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {
  
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { moderacao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');

        const permissions = message.channel.permissionsFor(message.client.user);

        if(!permissions.has("MANAGE_MESSAGES")){ // Permissão para gerenciar mensagens
            message.lineReply(':octagonal_sign: | ' + moderacao[1]["permissao"]);
            return;
        }

        if(args.length != 1 || isNaN(args[0])){
            message.lineReply(moderacao[1]["aviso_1"]);
            return;
        }
    
        if(args[0] < 1 || args[0] > 100){
            message.lineReply(moderacao[1]["aviso_2"]);
            return;
        }
    
        texto = moderacao[1]["apagado_1"];
    
        if(args[0] == 1)
            texto = moderacao[1]["apagado_2"];
        
        message.channel.bulkDelete(parseInt(args[0]))
        .then(() => {
            message.channel.send(`:hotsprings: | ${message.author}, \``+ args[0] +' '+ texto).then(message => message.delete({timeout: 3000}));
        })
        .catch(err =>
            message.reply(":octagonal_sign: | "+ moderacao[1]["error"]).then(message => message.delete({timeout: 3000})));
        
        message.delete() // apaga a mensagem do comando
    }
};