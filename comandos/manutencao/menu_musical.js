module.exports = {
    name: "menu_musical",
    description: "Menu com os comandos musicais do alonsal",
    aliases: [ "sh", "musical", "music", "song", "helpsong" ],
    cooldown: 20,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {
        
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const idioma_adotado = idioma_servers[message.guild.id];

        const { MessageEmbed } = require('discord.js');
        
        if(idioma_adotado == "pt-br"){
            embed = new MessageEmbed()
            .setTitle('Comandos Musicais :musical_note:')
            .setColor(0x29BB8E)
            .setDescription("**Atenção: Por enquanto só aceito URL's do Youtube**\n-----------------------------\n:postal_horn: **`.as url`** | **`.as`** - Entra num canal de voz e toca um url\n:mag: **`.as finca chimia`** - Pesquisa por um vídeo no Ytb\n:page_with_curl: **`.aspl`** - Mostra a playlist atual\n:pause_button: **`.asp`** - Pausa a reprodução\n:arrow_forward: **`.asr`** - Resume a reprodução\n:fast_forward: **`.assk`** | **`.assk 5`** - Pula a faixa que está tocando/ou para a n° faixa\n:track_next: **`.assk all`** - Pula todas as faixas\n:repeat: **`.asrp`** - Ativa/desativa o repeteco\n:loudspeaker: **`.asfd`** - Ativa/desativa o anúncio de faixas\n:radio: **`.asnp`** - Informações da faixa atual\n:wastebasket: **`.asrm 5`** | **`.asrm all`** - Remove uma ou todas as faixas da playlist\n:wave: **`.asds`** - Desconecta o Alonsal do canal de voz\n:cd: **`.asra ms`** | **`.asra ms 10`** - Escolhe uma ou várias músicas aleatórias\n:cd: **`.asra me`** | **`.asra me 10`** - Escolhe uma ou várias músicas aleatórias zueiras\n:cd: **`.asra jg`** | **`.asra jg 10`** - Escolhe uma ou várias trilhas sonoras de jogos\n:cd: **`.asra op`** | **`.asra op 10`** - Escolhe uma ou várias músicas clássicas");
        }else{
            embed = new MessageEmbed()
            .setTitle("Musical Commands :musical_note:")
            .setColor(0x29BB8E)
            .setDescription("**Attention: For now I only accept URL's from Youtube**\n-----------------------------\n:postal_horn: **`.as url`** | **`.as`** - Enter a voice channel and play a url\n:mag: **`.as pen pineapple`** - Search for a video on Youtube\n:page_with_curl: **`.aspl`** - Show current playlist\n:pause_button: **`.asp`** - Pause playback\n:arrow_forward: **`.asr`** - Resume reproduction\n:fast_forward: **`.assk`** | **`.assk 5`** - Skip the currently playing track/or to n° track\n:track_next: **`.assk all`** - skip all tracks\n:repeat: **`.asrp`** - Enables/disables repeat\n:loudspeaker: **`.asfd`** - Enables/disables notice of new tracks\n:radio: **`.asnp`** - Current track info\n:wastebasket: **`.asrm 5`** | **`.asrm all`** - Remove one or all tracks from the playlist\n:wave: **`.asds`** - Disconnect Alonsal from the voice channel\n:cd: **`.asra ms`** | **`.asra ms 10`** - Choose one or several random songs\n:cd: **`.asra me`** | **`.asra me 10`** - Choose one or several random funny songs\n:cd: **`.asra jg`** | **`.asra jg 10`** - Choose one or several game soundtracks\n:cd: **`.asra op`** | **`.asra op 10`** - Choose one or several classic songs");
        }

        message.lineReply(embed);
    }
}