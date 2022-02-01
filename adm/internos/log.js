const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = async ({client, message, content}) => {

    const prefix = client.prefixManager.getPrefix(message.guild.id);
    const comandos_confidenciais = [`${prefix}bp`, `${prefix}baterponto`, `${prefix}tr`, `${prefix}wr`, `${prefix}trampo`, `${prefix}batponto`, `${prefix}ltr`, `${prefix}lista_dias`, `${prefix}rbp`, `${prefix}remover_dia`];

    fs.readFile('./arquivos/data/contador/comandos.txt', 'utf8', function(err, data) {
        if (err) throw err;
        
        qtd_comandos = parseInt(data);
        qtd_comandos++;
        
        if(client.user.id === "833349943539531806"){
            const d = new Date();
            const day = d.toLocaleString('en-US', { weekday: 'long' });

            let url_ativacao = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
            let min = (`0${d.getMinutes()}`).substr(-2); // Preservar o digito 0
            let hr = (`0${d.getHours()}`).substr(-2); // Preservar o digito 0

            let ampm = "am";
            if(hr > 12){
                hr -= 12;
                ampm = "pm";
            }

            let comando_inserido = content.replaceAll("`", "'");
            if(comandos_confidenciais.includes(message.content)){
                comando_inserido = "O Conteúdo deste comando é confidencial";
                url_ativacao = "";
            }

            const date = d.getDate();
            const month = d.toLocaleString('en-US', { month: 'long' });
            const year = d.getFullYear();

            let embed = new MessageEmbed()
            .setTitle("> ✨ New interaction")
            .setColor(0x29BB8E)
            .setDescription(`:man_raising_hand: ( \`${message.author.id}\` | \`${message.author.username}#${message.author.discriminator}\` )\n:globe_with_meridians: ( \`${message.guild.id}\` | \`${message.guild.name}\` )\n:placard: ( \`${message.channel.id}\` | \`${message.channel.name}\` )\n:bookmark_tabs: ( \`${message.id}\` )\n\`\`\`fix\n📝 ${comando_inserido}\`\`\`\n:notepad_spiral: Command N° ( \`${qtd_comandos.toLocaleString('pt-BR')}\` )`)
            .setFooter(`⏰ Time/date: ${hr}:${min}${ampm} | ${day} - ${date} ${month} ${year}`);

            if(url_ativacao !== "")
                embed.setURL(`${url_ativacao}`);

            client.channels.cache.get('846151364492001280').send({ embeds: [embed] }); // Envia o log com os comandos do usuário
        }

        fs.writeFile('./arquivos/data/contador/comandos.txt', parseInt(qtd_comandos, 10).toString(), (err) => {
            if (err) throw err;
        });
    });

    // Contabilizar o comando
    if(client.user.id === "833349943539531806"){
        await require('../command_ranking.js')({client, message, content});
        
        const caso = "comando";
        require('../relatorio.js')({client, caso});
    }
}