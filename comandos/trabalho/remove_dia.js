const { existsSync, unlink } = require('fs');

module.exports = {
    name: "remover_dia",
    description: "Remover um dia de trabalho",
    aliases: [ "rbp" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        if (!existsSync(`./arquivos/data/trabalho/${message.author.id}`)) return message.reply(`:octagonal_sign: | ${trabalho[2]["sem_dados"]}`);
        
        let data_atual = new Date();
        let data_storage = `${data_atual.getFullYear()}${("0"+ data_atual.getDate()).substring(-2)}${("0"+ (data_atual.getMonth() + 1)).substr(-2)}`;

        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const { trabalho } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        if(args.length > 0){
            if(args[0].raw === "h"){
                require('../manutencao/menu_trampo.js')({client, message});
                return;
            }
    
            if(isNaN(isValidDate(args[0].raw))) return message.reply(`:octagonal_sign: | ${trabalho[2]["error_1"].replace(".a", prefix)}`);

            dia_status = args[0].raw;
            let data_custom = (args[0].raw).replaceAll("/", "");
            data_custom = data_custom.replaceAll("-", "");
            data_storage = `${data_custom.slice(4, 8)}${data_custom.slice(2, 4)}${data_custom.slice(0, 2)}`;

            if(!existsSync(`./arquivos/data/trabalho/${message.author.id}/${data_storage}.json`)) return message.reply(`:mag: | ${trabalho[2]["sem_entradas_1"]} \`${dia_status}\``);

            unlink(`../../arquivos/data/trabalho/${message.author.id}/${data_storage}.json`, function (err){
                if(err)
                    console.log(err);
                
                message.reply(trabalho[2]["dia_removido_1"].replace("dia_repl", dia_status));
            });
        }else{
            if(!existsSync(`./arquivos/data/trabalho/${message.author.id}/${data_storage}.json`)) return message.reply(`:mag: | ${trabalho[2]["sem_entradas_2"]}`);
            
            unlink(`./arquivos/data/trabalho/${message.author.id}/${data_storage}.json`, function (err) {
                if(err)
                    console.log(err);
            
                message.reply(trabalho[2]["dia_removido_2"]);
            });
        }
    }
}

function isValidDate(d){
    return d instanceof Date && !isNaN(d);
}