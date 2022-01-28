const { existsSync, mkdirSync, writeFileSync } = require('fs');

module.exports = {
    name: "batponto",
    description: "Bata ponto",
    aliases: [ "bp", "baterponto" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
         
        if (!existsSync(`./arquivos/data/trabalho/${message.author.id}`))
            mkdirSync(`./arquivos/data/trabalho/${message.author.id}`, { recursive: true });

        let msg_retorno = "";
        let confirma_dia_atual = true;
        let data_atual = new Date();
        let data_custom = null;
        let dia_atual = `${data_atual.getDate()}${("0" + data_atual.getMonth() + 1).substr(-2)}${data_atual.getFullYear()}`;
        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const { trabalho } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        if(args.length < 1) return message.reply(`:mag: | ${trabalho[1]["horario"]}`);

        if(args[0].raw === "h"){
            require('../manutencao/menu_trampo.js')({client, message});
            return;
        }

        const pontos = {
            pont1: null,
            pont2: null,
            pont3: null,
            pont4: null
        };

        if (existsSync(`./arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`)) {
            delete require.cache[require.resolve(`../../arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`)];
            const { pont1, pont2, pont3, pont4 } = require(`../../arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`);
            pontos.pont1 = pont1;
            pontos.pont2 = pont2;
            pontos.pont3 = pont3;
            pontos.pont4 = pont4;
        }

        if(args.length >= 2){
            if((args[0].raw).includes("/")){ // Entrada com data customizada

                confirma_dia_atual = false;

                if(args.length === 3)
                    if(isNaN(args[1].raw) || args[1].raw < 1 || args[1].raw > 4) return message.reply(`:octagonal_sign: | ${trabalho[1]["error_1"]}`);
                
                if(isNaN(isValidDate(args[0].raw))) return message.reply(`:octagonal_sign: | ${trabalho[0]["error_1"]}`);

                data_custom = (args[0].raw).replaceAll("/", "");
                data_custom = data_custom.replaceAll("-", "");

                for(let i = 0; i < 4; i++){
                    pontos[`pont${i + 1}`] = null;
                }

                if(existsSync(`./arquivos/data/trabalho/${message.author.id}/${data_custom}.json`)){
                    delete require.cache[require.resolve(`../../arquivos/data/trabalho/${message.author.id}/${data_custom}.json`)];
                    const { pont1, pont2, pont3, pont4 } = require(`../../arquivos/data/trabalho/${message.author.id}/${data_custom}.json`);
                    pontos.pont1 = pont1;
                    pontos.pont2 = pont2;
                    pontos.pont3 = pont3;
                    pontos.pont4 = pont4;
                }

                if(args.length === 3){ // Editando um ponto informado numa data
                    pontos[`pont${args[1].raw}`] = args[2].raw;

                    msg_retorno = `:pencil: | ${trabalho[1]["ponto_att_1"]}`.replace("ponto_repl", args[1].raw).replace("data_repl", args[0].raw).replace("hora_repl", args[2].raw);
                }else{
                    // Verificando se a hora é válida
                    if(!(args[1].raw).includes(":") || isNaN((args[1].raw).split(":")[1]) || isNaN((args[1].raw).split(":")[1]) || (args[1].raw).split(":").length > 2 || (args[1].raw).split(":")[1] > 24 || (args[1].raw).split(":")[1] < 0 || (args[1].raw).split(":")[1] > 59 || (args[1].raw).split(":")[1] < 0) return message.reply(`:octagonal_sign: | ${trabalho[1]["error_2"].replace(".a", prefix)}`);

                    for(let i = 0; i < 4; i++){
                        if(pontos[`pont${i + 1}`] == null){
                            pontos[`pont${i + 1}`] = args[1].raw;

                            msg_retorno = `:ballot_box_with_check: | ${trabalho[1]["ponto_att_2"]}`;
                            break;
                        }
                    }
                }
            }else{ // Atualizando um ponto do dia atual
                if(isNaN(args[0].raw) || args[0].raw < 1 || args[0].raw > 4) return message.reply(`:octagonal_sign: | ${trabalho[1]["error_1"]}`);

                pontos[`pont${args[0].raw}`] = args[1].raw;
                msg_retorno = `:pencil: | ${trabalho[1]["ponto_att_3"].replace("ponto_repl", args[0].raw).replace("hora_repl", args[1].raw)}`;
            }
        }else if(args.length === 1){
            if(!(args[0].raw).includes(":") || isNaN((args[0].raw).split(":")[0]) || isNaN((args[0].raw).split(":")[1]) || (args[0].raw).split(":").length > 2 || (args[0].raw).split(":")[0] > 24 || (args[0].raw).split(":")[0] < 0 || (args[0].raw).split(":")[1] > 59 || (args[0].raw).split(":")[1] < 0) return message.reply(`:octagonal_sign: | ${trabalho[1]["error_2"].replace(".a", prefix)}`);

            for(let i = 0; i < 4; i++){
                if(pontos[`pont${i + 1}`] == null){
                    pontos[`pont${i + 1}`] = args[0].raw;

                    msg_retorno = `:ballot_box_with_check: | ${trabalho[1]["ponto_att_2"]}`.replaceAll("ponto_repl", i + 1).replace("hora_repl", args[0].raw);
                    break;
                }
            }
        }else
            return message.reply(`:octagonal_sign: | ${trabalho[1]["error_3"]}`.replace(".a", prefix));

        let verifica_entradas = 0;
        Object.keys(pontos).forEach(ponto => {
            if(pontos[ponto] !== null)
                verifica_entradas++
        });

        if(verifica_entradas === 4) msg_retorno = trabalho[1]["todos_pontos"];

        await message.reply(msg_retorno.replaceAll(".a", prefix)).then(msg => setTimeout(() => {
            message.delete();
            msg.delete();
        }, 6000));

        if(confirma_dia_atual){ // Confirma se é o dia atual ou algum dia customizado
            writeFileSync(`./arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`, JSON.stringify(pontos));
            delete require.cache[require.resolve(`../../arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`)];
        }else{
            writeFileSync(`./arquivos/data/trabalho/${message.author.id}/${data_custom}.json`, JSON.stringify(pontos));
            delete require.cache[require.resolve(`../../arquivos/data/trabalho/${message.author.id}/${data_custom}.json`)];
        }
    }
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}