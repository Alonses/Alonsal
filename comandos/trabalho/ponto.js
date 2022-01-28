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

        if(args.length < 1) return message.reply(":mag: | Informe um horário para registrar seu ponto");

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
                    if(isNaN(args[1].raw) || args[1].raw < 1 || args[1].raw > 4) return message.reply(":octagonal_sign: | Informe um número entre 1 e 4 para editar seus pontos de hoje");
                
                if(isNaN(isValidDate(args[0].raw))) return message.reply(":octagonal_sign: | Informe uma data válida para esse comando, por exemplo `.abn 21/01/2001 08:07`");

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

                    msg_retorno = `:pencil: | Horário do \`${args[1].raw}°\`  Ponto de \`${args[0].raw}\` atualizado com sucesso para \`${args[2].raw}\``;
                }else{
                    // Verificando se a hora é válida
                    if(!(args[1].raw).includes(":") || isNaN((args[1].raw).split(":")[1]) || isNaN((args[1].raw).split(":")[1]) || (args[1].raw).split(":").length > 2 || (args[1].raw).split(":")[1] > 24 || (args[1].raw).split(":")[1] < 0 || (args[1].raw).split(":")[1] > 59 || (args[1].raw).split(":")[1] < 0) return message.reply(":octagonal_sign: | Informe um formato de hora apropriado, por exemplo, `.abp 20:07`".replace(".a", prefix));

                    for(let i = 0; i < 4; i++){
                        if(pontos[`pont${i + 1}`] == null){
                            pontos[`pont${i + 1}`] = args[1].raw;

                            msg_retorno = `:ballot_box_with_check: | ${i + 1}° Ponto do dia registrado, a hora vinculada é \`${args[1].raw}\`\nDigitou errado? Edite este ponto com o comando \`.abp ${i + 1} 08:07\``;
                            break;
                        }
                    }
                }
            }else{
                if(isNaN(args[0].raw) || args[0].raw < 1 || args[0].raw > 4) return message.reply(":octagonal_sign: | Informe um número entre `1 & 4` para editar seus pontos de hoje");

                pontos[`pont${args[0].raw}`] = args[1].raw;

                msg_retorno = `:pencil: | Horário do \`${args[0].raw}°\` Ponto atualizado com sucesso para \`${args[1].raw}\``;
            }    
        }else if(args.length === 1){
            if(!(args[0].raw).includes(":") || isNaN((args[0].raw).split(":")[0]) || isNaN((args[0].raw).split(":")[1]) || (args[0].raw).split(":").length > 2 || (args[0].raw).split(":")[0] > 24 || (args[0].raw).split(":")[0] < 0 || (args[0].raw).split(":")[1] > 59 || (args[0].raw).split(":")[1] < 0) return message.reply(":octagonal_sign: | Informe um formato de hora apropriado, por exemplo, `.abp 20:07`".replace(".a", prefix));

            for(let i = 0; i < 4; i++){
                if(pontos[`pont${i + 1}`] == null){
                    pontos[`pont${i + 1}`] = args[0].raw;

                    msg_retorno = `:ballot_box_with_check: | ${i + 1}° Ponto do dia registrado, a hora vinculada é \`${args[0].raw}\`\nDigitou errado? Edite este ponto com o comando \`.abp ${i + 1} 08:07\``;
                    break;
                }
            }
        }else
            return message.reply(":octagonal_sign: | Você informou valore demais, a operação foi cancelada\nUse o comando `.atr h` para ver os comandos desta categoria".replace(".a", prefix));

        let verifica_entradas = 0;
        Object.keys(pontos).forEach(ponto => {
            if(pontos[ponto] !== null)
                verifica_entradas++
        });

        if(verifica_entradas === 4) msg_retorno = "Todos os horários foram preenchidos, você pode editar pontos anteriores com o comando `.abp 1 08:07`, `.abp 2 20:07`, `.abp 3 07:20`,..\nOu ver o resumo completo com o comando `.atr`";

        await message.reply(msg_retorno.replaceAll(".a", prefix)).then(msg => setTimeout(() => {
            message.delete();
            msg.delete();
        }, 10000));

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