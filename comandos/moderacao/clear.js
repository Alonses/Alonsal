module.exports = {
    name: "clear",
    description: "apaga mensagens de chat",
    aliases: [ "cl", "limpar", "apagar" ],
    cooldown: 3,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {
  
        const permissions = message.channel.permissionsFor(message.client.user);

        if(!permissions.has("MANAGE_MESSAGES")){ // Permissão para gerenciar mensagens
            message.lineReply(':octagonal_sign: | Eu não tenho permissão para gerenciar mensagens');
            return;
        }

        if(args.length != 1 || isNaN(args[0])){
            message.lineReply("Informe o número de mensagens q deseja remover\nPor exemplo, `.acl 20`");
            return;
        }
    
        if(args[0] < 1 || args[0] > 100){
            message.lineReply(':warning: | Informe um número entre `0` e `100` para remover');
            return;
        }
    
        texto = "mensagens` foram removidas";
    
        if(args[0] == 1)
            texto = "mensagem` foi removida";
        
        message.delete() // apaga a mensagem do comando

        message.channel.bulkDelete(parseInt(args[0]))
        .then(() => {
            message.channel.send(`:hotsprings: | ${message.author}, \``+ args[0] +' '+ texto, ).then(message => message.delete({timeout: 3000}));
        })
        .catch(err =>
            message.reply(":octagonal_sign: | Não foi possível executar este comando, pois há mensagens fixadas ou mensagens muito antigas, diminua a quantidade e tente novamente").then(message => message.delete({timeout: 3000})));
    }
};