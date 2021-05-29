const Discord = require('discord.js');

module.exports = async({message}) => {
  
    const embed = new Discord.MessageEmbed()
    .setColor('#29BB8E')
    .setDescription("> COMANDOS DAS MÚSICAS :musical_note:\n**Atenção: Por enquanto só aceito URL's do Youtube**\n-----------------------------\n:postal_horn: **`ãst url`** | **`ãst`** - Entra num canal de voz e toca um url\n:page_with_curl: **`ãst pl`** - Mostra a playlist atual\n:fast_forward: **`ãst sk`** | **`ãst sk 5`** - Pula a faixa que está tocando/ou para a n° faixa\n:track_next: **`ãst sk all`** - Pula todas as faixas\n:repeat: **`ãst rp`** - Ativa/desativa o repeteco\n:loudspeaker: **`ãst fd`** - Ativa/desativa o anúncio de faixas\n:radio: **`ãst np`** - Informações da faixa atual\n:wave: **`ãst ds`** - Desconecta o Alonso do canal de voz\n:cd: **`ãst ms`** | **`ãst ms 10`** - Escolhe uma ou várias músicas aleatórias\n:cd: **`ãst me`** | **`ãst me 10`** - Escolhe uma ou várias músicas aleatórias zueiras\n:cd: **`ãst jg`** | **`ãst jg 10`** - Escolhe uma ou várias trilhas sonoras de jogos");
    // \n**`ãst st`** - Pausa a reprodução\n**`ãst p`** - Resume a reprodução

    message.channel.send(embed);
}