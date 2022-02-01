const { existsSync, unlink } = require('fs');

module.exports = {
    name: "remover_dia",
    description: "Remover um dia de trabalho",
    aliases: [ "rbp" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        if (!existsSync(`./arquivos/data/trabalho/${message.author.id}`)) return;
        
        let data_atual = new Date();
        let dia_atual = `${("0"+ data_atual.getDate()).substring(-2)}${("0"+ (data_atual.getMonth() + 1)).substr(-2)}${data_atual.getFullYear()}`;
        
        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const { trabalho } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);
        const isValidDate = require('../../adm/funcoes/validadata.js');

        if(args.length > 0){
            if(args[0].raw === "h"){
                require('../manutencao/menu_trampo.js')({client, message});
                return;
            }
    
            if(!isValidDate(args[0].raw)) return message.reply(`:octagonal_sign: | ${trabalho[2]["error_1"].replace(".a", prefix)}`);

            dia_status = args[0].raw;
            data_custom = (args[0].raw).replaceAll("/", "");
            data_custom = data_custom.replaceAll("-", "");

            if(!existsSync(`./arquivos/data/trabalho/${message.author.id}/${data_custom}.json`)) return message.reply(`:mag: | ${trabalho[2]["sem_entradas_1"]} \`${dia_status}\``);

            unlink(`../../arquivos/data/trabalho/${message.author.id}/${data_custom}.json`, function (err){
                if(err)
                    console.log(err);
                
                message.reply(trabalho[2]["dia_removido_1"].replace("dia_repl", dia_status));
            });
        }else{
            if(!existsSync(`./arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`)) return message.reply(`:mag: | ${trabalho[2]["sem_entradas_2"]}`);
            
            unlink(`./arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`, function (err) {
                if(err)
                    console.log(err);
            
                message.reply(trabalho[2]["dia_removido_2"]);
            });
        }
    }
}