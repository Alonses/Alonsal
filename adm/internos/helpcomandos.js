const { MessageEmbed } = require('discord.js');
const { comandos } = require('../../arquivos/data/comandos.json');
const fetch = require('node-fetch');

module.exports = async function({client, message, args}){

    let idioma = client.idioma.getLang(message.guild.id);

    if(idioma == "al-br") idioma = "pt-br";

    const { manutencao } = require(`../../arquivos/idiomas/${idioma}.json`);
    const prefix = client.prefixManager.getPrefix(message.guild.id);
    
    const procura_infos = args[0].raw.replace(prefix, "");
    let valida_aliase = false;
    let indice;

    for(let x = 0; x < comandos.length; x++){
        let linha = comandos[x].split(",");
        const aliases = linha;

        for(let i = 1; i < aliases.length; i++){
            if(aliases[i].replace(/ /g, "") === procura_infos){
                indice = linha[0];
                valida_aliase = true;
                break;
            }
        }
    }
    
    if(valida_aliase){
        fetch(`https://raw.githubusercontent.com/odnols/site-do-alonsal/main/json/guia_${idioma.slice(0, 2)}.json`)
        .then(response => response.json())
        .then(async dados => {
            
            const comando_alvo = dados.guia[indice];
            if(!comando_alvo) return message.reply(`:construction: | ${manutencao[8]["traducao_faltando"]}`);

            let aliases = comando_alvo.aliases.split(",");
            format_aliases = "";
            format_usos = "";

            for(let i = 0; i < aliases.length; i++){
                format_aliases += `\`${aliases[i].replace(/ /g, "").replace(".a", prefix)}\``;

                if(typeof aliases[i + 1] !== "undefined")
                    format_aliases += ", ";
            }
            
            let usos = comando_alvo.usos.split(",");

            for(let i = 0; i < usos.length; i++){

                let uso = usos[i].split("|")[0];
                uso = uso.slice(0, 1) == " " ? uso.substr(1) : uso ; // Removendo o primeiro espaço da string caso exista um

                format_usos += `\`${aliases[0].replace(".a", prefix)} ${uso}\` - ${usos[i].split("|")[1]}\n`;
            }

            embed = new MessageEmbed()
            .setTitle(`> ${comando_alvo.emoji} ${comando_alvo.comando}`)
            .setColor(0x29BB8E)
            .setDescription(`:label: Aliases ( ${format_aliases} )\n:jigsaw: ${manutencao[8]["usos"]} //\n${format_usos.replaceAll("<mr>", "").replaceAll("</mr>", "")}\`\`\`fix\n${comando_alvo.funcao.replaceAll("<mr>", "").replaceAll("</mr>", "")}\`\`\``)

            message.reply({embeds: [embed]});
        });
    }else
        return message.reply(`:mag: | ${manutencao[8]["nao_encontrado"]}`);
}