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

      let texto = "mensagens";

      if(args.length != 1 || isNaN(args[0])){
        message.lineReply("Informe o número de mensagens q deseja remover\nPor exemplo, `.acl 20`");
        return;
      }

      if(args[0] < 1 || args[0] > 100){
        message.lineReply(':warning: | Informe um número entre `0` e `100` para remover');
        return;
      }

      if(args[0] == 1)
        texto = "mensagem";

      message.lineReply('Apagando `'+ args[0] +' '+ texto +'` em 2 segundos');

      texto = "mensagens` foram removidas";

      if(args[0] == 1)
        texto = "mensagem` foi removida";

      setTimeout( async () => {
            message.channel.bulkDelete(2); // apaga a mensagem do comando e o aviso
            message.channel.bulkDelete(parseInt(args[0]));

            const m = await message.channel.send(`${message.author}, \``+ args[0] +' '+ texto +' :white_check_mark:');

            setTimeout(() => {
              m.delete();
            }, 3000);
      }, 2000);
    }
};
