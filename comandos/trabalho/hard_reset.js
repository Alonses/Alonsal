const fs = require('fs')
const { existsSync } = require('fs');

module.exports = {
    name: "reset_historico",
    description: "Limpa a pasta de dias do usuário",
    aliases: [ "htl" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        if (!existsSync(`./arquivos/data/trabalho/${message.author.id}`)) return message.reply(":mag: | Você não possui dados registrados")

        fs.rm(`./arquivos/data/trabalho/${message.author.id}`, { recursive: true }, function (err) {
            if(err)
                console.log(err);

            message.reply(":file_folder: | Dados resetados");
        });
    }
}