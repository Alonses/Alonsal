const Discord = require('discord.js');

module.exports = async({message}) => {
  
    const embed = new Discord.MessageEmbed()
    .setColor('#29BB8E')
    .setDescription("> COMANDOS DAS MÚSICAS :musical_note:\n**Atenção: Por enquanto só aceito URL's do Youtube**\n-----------------------------\n:postal_horn: **`.as url`** | **`.as`** - Entra num canal de voz e toca um url\n:mag: **`.as finca chimia`** - Pesquisa por um vídeo no Ytb\n:page_with_curl: **`.aspl`** - Mostra a playlist atual\n:pause_button: **`.asp`** - Pausa a reprodução\n:arrow_forward: **`.asr`** - Resume a reprodução\n:fast_forward: **`.assk`** | **`.assk 5`** - Pula a faixa que está tocando/ou para a n° faixa\n:track_next: **`.assk all`** - Pula todas as faixas\n:repeat: **`.asrp`** - Ativa/desativa o repeteco\n:loudspeaker: **`.asfd`** - Ativa/desativa o anúncio de faixas\n:radio: **`.asnp`** - Informações da faixa atual\n:wave: **`.asds`** - Desconecta o Alonso do canal de voz\n:cd: **`.asra ms`** | **`.asra ms 10`** - Escolhe uma ou várias músicas aleatórias\n:cd: **`.asra me`** | **`.asra me 10`** - Escolhe uma ou várias músicas aleatórias zueiras\n:cd: **`.asra jg`** | **`.asra jg 10`** - Escolhe uma ou várias trilhas sonoras de jogos");

    message.channel.send(embed);
}
