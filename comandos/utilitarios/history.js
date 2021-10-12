let valores_esc = [];
let ult_data = null;
let ult_server = null;

module.exports = {
    name: "history",
    description: "Fatos que ocorreram no mundo em determinada data",
    aliases: [ "hs", "hoje", "today", "historia", "fato", "contecimento", "con" ],
    cooldown: 6,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
    
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { utilitarios } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        const idioma_definido = idioma_servers[message.guild.id];

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";

        const { MessageEmbed } = require('discord.js');

        const fetch = require('node-fetch');
        let datas = [];
        let fontes = [];
        let acontecimento_final = [];

        let data = new Date();
        let dia, mes, url_completa = "https://history.uol.com.br/hoje-na-historia/";

        if(args.length > 0){
            if(!args[0].includes("-")) // Formato incorreto
                return message.lineReply(":warning: | "+ utilitarios[10]["aviso_1"].replaceAll(".a", prefix));

            let data_pesquisada = args[0].split("-");
            dia = data_pesquisada[0];
            mes = data_pesquisada[1];

            if(isNaN(dia) || isNaN(mes)) // Caracteres de texto no lugar de números
                return message.lineReply(":hotsprings: | "+ utilitarios[10]["aviso_2"]).then(message => message.delete({timeout: 6000}));
            

            if(idioma_definido == "pt-br"){
                if(mes > 12 || mes < 0 || dia > 31 || dia < 0 || (mes == 2 && dia > 29)) // Verificando dias e meses
                    return message.lineReply(":hotsprings: | "+ utilitarios[10]["aviso_1"]).then(message => message.delete({timeout: 6000}));
                
                url_completa += dia +"/"+ mes;
            }else{
                if(dia > 12 || dia < 0 || mes > 31 || mes < 0 || (mes > 29 && dia == 2)) // Verificando dias e meses ( padrão inglês )
                    return message.lineReply(":hotsprings: | "+ utilitarios[10]["aviso_1"]).then(message => message.delete({timeout: 6000}));
            
                url_completa += mes +"/"+ dia;

                let troca = dia;
                dia = mes;
                mes = troca;
            }

            data_mes = new Date();
            data_mes.setMonth(mes - 1);

            if(idioma_definido == "pt-br")
                mes = data_mes.toLocaleString('pt', { month: 'long' });
            else
                mes = data_mes.toLocaleString('en', { month: 'long' });
        }else{
            if(idioma_definido == "pt-br")
                mes = new Date().toLocaleString('pt', { month: 'long' });
            else
                mes = new Date().toLocaleString('en', { month: 'long' });

            dia = new Date().getDate();
        }

        const aviso = await message.lineReply(":hotsprings: | "+ utilitarios[10]["aviso_3"]);

        fetch(url_completa)
        .then(response => response.text())
        .then(async res => {

            alvos = res.split("<div class=\"card-img-overlay\">");
            alvos.shift();
            
            for(let i = 0; i < alvos.length; i++){ // Separando os valores
                
                data = alvos[i].split("<div class=\"field field--name-field-date field--type-datetime field--label-hidden field__item\">")[1];
                let ano_materia = data.slice(0, 4);

                acontece = alvos[i].split("hreflang=\"pt-br\">")[1];
                acontece = acontece.split("</a>")[0];

                link_materia = alvos[i].split("hreflang=\"pt-br\">")[0];
                link_materia = link_materia.split("<a href=\"")[1];
                link_materia = link_materia.replace("\"", "");

                if(idioma_definido == "pt-br")
                    datas.push(`${dia} de ${mes} de ${ano_materia}`);
                else
                    datas.push(`${mes} ${dia}, ${ano_materia}`);

                acontecimento_final.push(acontece);
                fontes.push("https://history.uol.com.br"+ link_materia);
            }

            if(datas.length > 0){
                if(ult_data != datas[0].split("de")[1] || valores_esc.length == datas.length || ult_server != message.guild.id) // Compara os meses da pesquisa, caso diferentes reseta o último valor retirado
                    valores_esc = [];

                ult_data = datas[0].split("de")[1];

                do{ // Sorteando o evento
                    let importancia = Math.round(1 * Math.random());

                    if(importancia > 0)
                        num = Math.round((datas.length - 1) * Math.random());
                    else
                        num = Math.round(2 * Math.random());
                }while(valores_esc.includes(num));
                
                ult_server = message.guild.id;
                valores_esc.push(num);
                
                fetch(fontes[num])
                .then(response => response.text())
                .then(async res_artigo => {
                    
                    let imagem = res_artigo.split("<div class=\"field field--name-field-thumbnail field--type-entity-reference field--label-hidden field--item\">")[1];
                    imagem = imagem.split("<img src=\"")[1];
                    imagem = imagem.split("\"")[0];

                    if(!imagem.includes("https")){ // Imagens com links antigos
                        imagem = imagem.slice(9, imagem.length);
                        imagem = "https://assets.historyplay.tv/br/public" + imagem;
                    }
                    
                    let descricao = res_artigo.split("<div class=\"clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item\">")[1];
                    
                    descricao = descricao.split("</p>")[0]; 
                    descricao = descricao.slice(0, 350) +"...";
                    descricao = descricao.replace("<p>", "");
                    descricao = descricao.replace("<div>", "");
                
                    acontecimento = new MessageEmbed()
                    .setTitle(acontecimento_final[num])
                    .setAuthor("History")
                    .setURL(fontes[num])
                    .setColor(0x29BB8E)
                    .setDescription(descricao)
                    .setFooter(datas[num], message.author.avatarURL({ dynamic:true }))
                    .setImage(imagem);

                    message.lineReply(acontecimento);
                    aviso.delete();
                });
            }else{
                message.lineReply(":mag: | "+ utilitarios[10]["sem_entradas"].replaceAll(".a", prefix));
                aviso.delete();
            }
        });
    }
}