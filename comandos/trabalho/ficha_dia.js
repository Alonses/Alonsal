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
        let dia_atual = `${data_atual.getDate()}${("0" + data_atual.getMonth() + 1).substr(-2)}${data_atual.getFullYear()}`;
        let dia_status = `${data_atual.getDate()}/${("0" + data_atual.getMonth() + 1).substr(-2)}/${data_atual.getFullYear()}`;
        const prefix = client.prefixManager.getPrefix(message.guild.id);

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
        
            if(isNaN(isValidDate(args[0].raw))) return message.reply(":octagonal_sign: | Informe uma data válida para esse comando, por exemplo `.abn 21/01/2001 08:07`");

            dia_status = args[0].raw;
            data_custom = (args[0].raw).replaceAll("/", "");
            data_custom = data_custom.replaceAll("-", "");

            if(existsSync(`./arquivos/data/trabalho/${message.author.id}/${data_custom}.json`)){
                delete require.cache[require.resolve(`../../arquivos/data/trabalho/${message.author.id}/${data_custom}.json`)];
                const { pont1, pont2, pont3, pont4 } = require(`../../arquivos/data/trabalho/${message.author.id}/${data_custom}.json`);
                pontos.pont1 = pont1;
                pontos.pont2 = pont2;
                pontos.pont3 = pont3;
                pontos.pont4 = pont4;
            }
        }else{
            if (existsSync(`./arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`)) {
                delete require.cache[require.resolve(`../../arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`)];
                const { pont1, pont2, pont3, pont4 } = require(`../../arquivos/data/trabalho/${message.author.id}/${dia_atual}.json`);
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
        .setTitle(`${dia_status}`)
        .setColor(0xfffb29)
        .addFields(
            {
                name: `:park: **Turno da manhã**`,
                value: `**Entrada:** \`${pontos.pont1 || "S/R"}\`\n**Saída:** \`${pontos.pont2 || "S/R"}\`\n**Tempo:** \`${msToTime(getHourDiff(pontos.pont1, pontos.pont2))}\``,
                inline: true
            },
            {
                name: `:island: **Turno da tarde**`,
                value: `**Entrada:** \`${pontos.pont3 || "S/R"}\`\n**Saída:** \`${pontos.pont4 || "S/R"}\`\n**Tempo:** \`${msToTime(getHourDiff(pontos.pont3, pontos.pont4))}\``,
                inline: true
            }
        )
        .setFooter("Use o comando .abp h para ver mais exemplos e outros comandos".replace(".a", prefix));
                
        if(msToTime(horas_trabalhadas).split(":")[0] > 8)
            tempo_extra = `**Tempo extra ( ${msToTime(horas_trabalhadas).split(":")[0] - 8}:${msToTime(horas_trabalhadas).split(":")[1]} )**`;
        
        if(msToTime(horas_trabalhadas).split(":")[0] < 8)
            tempo_extra = `**Tempo faltando ( ${8 - msToTime(horas_trabalhadas).split(":")[0]}:${60 - msToTime(horas_trabalhadas).split(":")[1] == 60? "00" : 60 - msToTime(horas_trabalhadas).split(":")[1]} )**`; 
        
        embed.addFields(
            {
                name: `:beers: **Tempo trabalhado ( ${msToTime(horas_trabalhadas)} )**`,
                value: `:alarm_clock: ${tempo_extra}`,
                inline: false
            }
        );
        
        message.reply({embeds: [embed]});
    }
}

function msToTime(duration) {
    let minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    
    hours = (hours < 10) ? "0"+ hours : hours;
    minutes = (minutes < 10) ? "0"+ minutes : minutes;

    return `${hours}:${minutes}`;
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}