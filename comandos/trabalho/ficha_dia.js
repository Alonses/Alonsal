const { MessageEmbed } = require('discord.js');
const { existsSync, mkdirSync } = require('fs');

module.exports = {
    name: "trampo",
    description: "Veja seu resumo do dia",
    aliases: [ "tr", "wr" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
        
        const getHourDiff = require('../../adm/funcoes/diffhoras.js');

        let tempo_extra = '⠀';
        let data_atual = new Date();
        let data_storage = `${data_atual.getFullYear()}${("0"+ (data_atual.getMonth() + 1)).substr(-2)}${("0"+ data_atual.getDate()).substr(-2)}`;
        let dia_status = `${("0"+ data_atual.getDate()).substr(-2)}/${("0"+ (data_atual.getMonth() + 1)).substr(-2)}/${data_atual.getFullYear()}`;
        
        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const { trabalho } = require(`../../arquivos/idiomas/${client.idioma.getLang(message.guild.id)}.json`);

        const pontos = {
            pont1: null,
            pont2: null,
            pont3: null,
            pont4: null
        };

        if (!existsSync(`./arquivos/data/trabalho/${message.author.id}`))
            mkdirSync(`./arquivos/data/trabalho/${message.author.id}`, { recursive: true });

        if(args.length > 0){
            if(args[0].raw === "h"){
                require('../manutencao/menu_trampo.js')({client, message});
                return;
            }
            
            if(isNaN(isValidDate(args[0].raw))) return message.reply(`:octagonal_sign: | ${trabalho[0]["error_2"]}`);

            dia_status = args[0].raw;
            data_custom = (args[0].raw).replaceAll("/", "");
            data_custom = data_custom.replaceAll("-", "");
            data_storage = `${data_custom.slice(4, 8)}${data_custom.slice(2, 4)}${data_custom.slice(0, 2)}`;

            if(existsSync(`./arquivos/data/trabalho/${message.author.id}/${data_storage}.json`)){
                delete require.cache[require.resolve(`../../arquivos/data/trabalho/${message.author.id}/${data_storage}.json`)];
                const { pont1, pont2, pont3, pont4 } = require(`../../arquivos/data/trabalho/${message.author.id}/${data_storage}.json`);
                pontos.pont1 = pont1;
                pontos.pont2 = pont2;
                pontos.pont3 = pont3;
                pontos.pont4 = pont4;
            }
        }else{
            if (existsSync(`./arquivos/data/trabalho/${message.author.id}/${data_storage}.json`)) {
                delete require.cache[require.resolve(`../../arquivos/data/trabalho/${message.author.id}/${data_storage}.json`)];
                const { pont1, pont2, pont3, pont4 } = require(`../../arquivos/data/trabalho/${message.author.id}/${data_storage}.json`);
                pontos.pont1 = pont1;
                pontos.pont2 = pont2;
                pontos.pont3 = pont3;
                pontos.pont4 = pont4;
            }
        }

        let horas_trabalhadas = getHourDiff(pontos.pont1, pontos.pont2);

        if(pontos.pont3 !== null || pontos.pont4 !== null)
            horas_trabalhadas += getHourDiff(pontos.pont3, pontos.pont4);

        let embed = new MessageEmbed()
        .setTitle(dia_status)
        .setColor(0xfaa81a)
        .addFields(
            {
                name: `:park: **${trabalho[0]["turno_manha"]}**`,
                value: `**${trabalho[0]["entrada"]}:** \`${pontos.pont1 || "S/R"}\`\n**${trabalho[0]["saida"]}:** \`${pontos.pont2 || "S/R"}\`\n**${trabalho[0]["tempo"]}:** \`${msToTime(getHourDiff(pontos.pont1, pontos.pont2))}\``,
                inline: true
            },
            {
                name: `:island: **${trabalho[0]["turno_tarde"]}**`,
                value: `**${trabalho[0]["entrada"]}:** \`${pontos.pont3 || "S/R"}\`\n**${trabalho[0]["saida"]}:** \`${pontos.pont4 || "S/R"}\`\n**${trabalho[0]["tempo"]}:** \`${msToTime(getHourDiff(pontos.pont3, pontos.pont4))}\``,
                inline: true
            }
        )
        .setFooter(trabalho[0]["dica_comando"].replace(".a", prefix));
                
        if(msToTime(horas_trabalhadas).split(":")[0] >= 8)
            tempo_extra = `**${trabalho[0]["tempo_extra"]} ( ${msToTime(horas_trabalhadas).split(":")[0] - 8}:${msToTime(horas_trabalhadas).split(":")[1]} )**`;
        
        if(msToTime(horas_trabalhadas).split(":")[0] < 8)
            tempo_extra = `**${trabalho[0]["tempo_falta"]} ( ${8 - msToTime(horas_trabalhadas).split(":")[0]}:${60 - msToTime(horas_trabalhadas).split(":")[1] == 60? "00" : 60 - msToTime(horas_trabalhadas).split(":")[1]} )**`;
        
        embed.addFields(
            {
                name: `:beers: **${trabalho[0]["tempo_trabalhado"]} ( ${msToTime(horas_trabalhadas)} )**`,
                value: `:alarm_clock: ${tempo_extra}`,
                inline: false
            }
        );
        
        await client.users.cache.get(message.author.id).send({ embeds: [embed] });
        message.delete();
    }
}

function msToTime(duration) {
    let minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    
    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;
}

function isValidDate(d){
    return d instanceof Date && !isNaN(d);
}