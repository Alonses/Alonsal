module.exports = {
    name: "menu_musical",
    description: "Menu com os comandos musicais do alonsal",
    aliases: [ "sh", "musical", "music", "song", "helpsong" ],
    cooldown: 20,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const { MessageEmbed } = require('discord.js');
        
        const embed = new MessageEmbed()
        .setTitle('Comandos Musicais :musical_note:')
        .setColor(0x29BB8E)
        .setDescription("**Atenção: Por enquanto só aceito URL's do Youtube**\n-----------------------------\n:postal_horn: **`.as url`** | **`.as`** - Entra num canal de voz e toca um url\n:mag: **`.as finca chimia`** - Pesquisa por um vídeo no Ytb\n:page_with_curl: **`.aspl`** - Mostra a playlist atual\n:pause_button: **`.asp`** - Pausa a reprodução\n:arrow_forward: **`.asr`** - Resume a reprodução\n:fast_forward: **`.assk`** | **`.assk 5`** - Pula a faixa que está tocando/ou para a n° faixa\n:track_next: **`.assk all`** - Pula todas as faixas\n:repeat: **`.asrp`** - Ativa/desativa o repeteco\n:loudspeaker: **`.asfd`** - Ativa/desativa o anúncio de faixas\n:radio: **`.asnp`** - Informações da faixa atual\n:wastebasket: **`.asrm 5`** | **`.asrm all`** - Remove uma ou todas as faixas da playlist\n:wave: **`.asds`** - Desconecta o Alonsal do canal de voz\n:cd: **`.asra ms`** | **`.asra ms 10`** - Escolhe uma ou várias músicas aleatórias\n:cd: **`.asra me`** | **`.asra me 10`** - Escolhe uma ou várias músicas aleatórias zueiras\n:cd: **`.asra jg`** | **`.asra jg 10`** - Escolhe uma ou várias trilhas sonoras de jogos\n:cd: **`.asra op`** | **`.asra op 10`** - Escolhe uma ou várias músicas clássicas");

        message.lineReply(embed);
    }
}