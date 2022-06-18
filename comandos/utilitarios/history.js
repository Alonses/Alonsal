const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

let valores_esc = [];
let ult_data = null;
let ult_server = null;

module.exports = {
    name: "history",
    description: "Fatos que ocorreram no mundo em determinada data",
    aliases: [ "hs", "hoje", "today", "historia", "fato", "contecimento", "con", "cons" ],
    cooldown: 6,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const removeFormatacoes = require('../../adm/funcoes/remformats.js');

        let idioma_definido = client.idioma.getLang(message.guild.id);
        idioma_definido = idioma_definido == "al-br" ? "pt-br" : idioma_definido;
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`);

        const prefix = client.prefixManager.getPrefix(message.guild.id);

        const datas = [], fontes = [], ano_materias = [], acontecimento_final = [];
        let evento_escolhido = "", valor_primario = "";

        let data = new Date(), entrada_com_data = false, data_informada = utilitarios[10]["hoje"];
        let dia = data.getDate(), mes = data.getMonth() + 1, url_completa = "https://history.uol.com.br/hoje-na-historia/";

        if(args.length > 0){
            valor_primario = args[0].raw;

            if(message.content.includes("cons") && message.content !== `${prefix}cons` && !valor_primario.includes("-")) // Define um evento como alvo
                evento_escolhido = args[0].raw;    
            else if(args.length >= 1){
                entrada_com_data = true;

                if(args.length >= 2) evento_escolhido = args[1].raw;
            }
        
            if(isNaN(evento_escolhido))
                return message.reply(`:warning: | ${utilitarios[10]["aviso_1"].replaceAll(".a", prefix)}`);

            if(entrada_com_data){
                const data_pesquisada = valor_primario.split("-");
                dia = data_pesquisada[0];
                mes = data_pesquisada[1];
                
                if((isNaN(dia) || isNaN(mes)) && args.length > 0) // Caracteres de texto no lugar de números
                    return message.reply(`:hotsprings: | ${utilitarios[10]["aviso_2"].replaceAll(".a", prefix)}`).then(msg => setTimeout(() => msg.delete(), 6000));
            
                if(idioma_definido === "pt-br"){
                    if(mes > 12 || mes < 0 || dia > 31 || dia < 0 || (mes === 2 && dia > 29)) // Verificando dias e meses
                        return message.reply(`:hotsprings: | ${utilitarios[10]["aviso_1"].replaceAll(".a", prefix)}`).then(msg => setTimeout(() => msg.delete(), 6000));

                    url_completa += `${dia}/${mes}`;
                    data_informada = `${dia}/${mes}`;
                }else{
                    if(dia > 12 || dia < 0 || mes > 31 || mes < 0 || (mes > 29 && dia === 2)) // Verificando dias e meses ( padrão inglês )
                        return message.reply(`:hotsprings: | ${utilitarios[10]["aviso_1"].replaceAll(".a", prefix)}`).then(msg => setTimeout(() => msg.delete(), 6000));

                    url_completa += `${mes}/${dia}`;
                    data_informada = `${mes}/${dia}`;

                    const troca = dia;
                    dia = mes;
                    mes = troca;
                }
            }

            data_mes = new Date();
            data_mes.setMonth(mes - 1);
        
            if(idioma_definido === "pt-br")
                mes = data_mes.toLocaleString('pt', { month: 'long' });
            else
                mes = data_mes.toLocaleString('en', { month: 'long' });
        }else{
            if(idioma_definido === "pt-br")
                mes = new Date().toLocaleString('pt', { month: 'long' });
            else
                mes = new Date().toLocaleString('en', { month: 'long' });

            dia = new Date().getDate();
        }

        const aviso = await message.reply(`:hotsprings: | ${utilitarios[10]["aviso_3"].replaceAll(".a", prefix)}`);
        const ano_atual = new Date().getFullYear();

        fetch(url_completa)
        .then(response => response.text())
        .then(async res => {

            alvos = res.split("<div class=\"card-img-overlay\">");
            alvos.shift();

            for(let i = 0; i < alvos.length; i++){ // Separando os valores

                data = alvos[i].split("<div class=\"field field--name-field-date field--type-datetime field--label-hidden field__item\">")[1];
                const ano_materia = data.slice(0, 4);

                acontece = alvos[i].split("hreflang=\"pt-br\">")[1];
                acontece = acontece.split("</a>")[0];

                link_materia = alvos[i].split("hreflang=\"pt-br\">")[0];
                link_materia = link_materia.split("<a href=\"")[1];
                link_materia = link_materia.replace("\"", "");

                if(idioma_definido === "pt-br")
                    datas.push(`${dia} de ${mes} de ${ano_materia}`);
                else
                    datas.push(`${mes} ${dia}, ${ano_materia}`);

                ano_materias.push(ano_materia);
                acontecimento_final.push(acontece);
                fontes.push(`https://history.uol.com.br${link_materia}`);
            }

            if((message.content === `${prefix}cons` || message.content.includes(`${prefix}cons`)) && evento_escolhido === ""){
                if(datas.length > 0){

                    let lista_eventos = "";
                    let data_eventos = "";

                    for(let i = 0; i < datas.length; i++){
                        lista_eventos += `\`${i + 1}\` - [ \`${utilitarios[10]["em"]} ${ano_materias[i]}\` | \``;
                        
                        ano_atual - ano_materias[i] > 1 ? lista_eventos += `${utilitarios[10]["ha"]} ${ano_atual - ano_materias[i]}${utilitarios[14]["anos"]}\` ] `: ano_atual - ano_materias[i] == 1 ? lista_eventos += `${utilitarios[10]["ano_passado"]}\` ] ` : lista_eventos += `${utilitarios[10]["este_ano"]}\` ] `;

                        lista_eventos += `${acontecimento_final[i]}\n`;
                    }

                    lista_eventos = removeFormatacoes(lista_eventos);

                    if(data_informada !== utilitarios[10]["hoje"])
                        data_eventos = ` ${data_informada}`;

                    const embed_eventos = new MessageEmbed()
                    .setTitle(utilitarios[10]["acontecimentos_1"])
                    .setAuthor("History", "https://1000marcas.net/wp-content/uploads/2021/04/History-Channel-Logo-1536x960.png")
                    .setColor(0x29BB8E)
                    .setDescription(`${utilitarios[10]["acontecimentos_2"]} ${data_informada}\n${lista_eventos}`)
                    .setFooter(`${utilitarios[10]["utilize_1"]} ${prefix}cons ${data_eventos.replace("/", "-")} <${utilitarios[10]["numero"]}> ${utilitarios[10]["utilize_2"]}`)

                    message.reply({ embeds: [embed_eventos] });
                }else
                    message.reply(`:mag: | ${utilitarios[10]["sem_entradas"].replaceAll(".a", prefix)}`);

                aviso.delete();
                return;
            }

            if(datas.length > 0){
                if(ult_data !== datas[0].split("de")[1] || valores_esc.length === datas.length || ult_server !== message.guild.id) // Compara os meses da pesquisa, caso diferentes reseta o último valor retirado
                    valores_esc = [];

                ult_data = datas[0].split("de")[1];

                let num = 0;

                if(evento_escolhido === ""){
                    do{ // Sorteando o evento
                        const importancia = Math.round(Math.random());

                        if(importancia > 0)
                            num = Math.round((datas.length - 1) * Math.random());
                        else
                            num = Math.round(2 * Math.random());
                    }while(valores_esc.includes(num));

                    ult_server = message.guild.id;
                    valores_esc.push(num);
                }else if(valor_primario.includes("-")){
                    if(isNaN(evento_escolhido) || evento_escolhido > acontecimento_final.length || evento_escolhido < 1){
                        message.reply(`:mag: | ${utilitarios[10]["error_1"]}`);
                        aviso.delete();

                        return;
                    }

                    num = evento_escolhido - 1;
                }

                fetch(fontes[num])
                .then(response => response.text())
                .then(async res_artigo => {

                    let imagem = res_artigo.split("<div class=\"field field--name-field-thumbnail field--type-entity-reference field--label-hidden field--item\">")[1];
                    imagem = imagem.split("<img src=\"")[1];
                    imagem = imagem.split("\"")[0];

                    if(!imagem.includes("https")){ // Imagens com links antigos
                        imagem = imagem.slice(9, imagem.length);
                        imagem = `https://assets.historyplay.tv/br/public${imagem}`;
                    }

                    let descricao = res_artigo.split("<div class=\"clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item\">")[1];

                    descricao = descricao.split("</p>")[0];
                    descricao = descricao.slice(0, 350) +"...";

                    const acontecimento = new MessageEmbed()
                    .setTitle(acontecimento_final[num].replaceAll("&quot;", "\""))
                    .setAuthor("History", "https://1000marcas.net/wp-content/uploads/2021/04/History-Channel-Logo-1536x960.png")
                    .setURL(fontes[num])
                    .setColor(0x29BB8E)
                    .setDescription(removeFormatacoes(descricao))
                    .setFooter(datas[num], message.author.avatarURL({ dynamic:true }))
                    .setImage(imagem);

                    message.reply({ embeds: [acontecimento] });
                    aviso.delete();
                });
            }else{
                message.reply(`:mag: | ${utilitarios[10]["sem_entradas"].replaceAll(".a", prefix)}`);
                aviso.delete();
            }
        })
    }
}