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

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";

        const { MessageEmbed } = require('discord.js');
        
        if(idioma_adotado == "pt-br"){
            embed = new MessageEmbed()
            .setTitle('Comandos Musicais :musical_note:')
            .setColor(0x29BB8E)
            .setDescription("**Atenção: Por enquanto só aceito URL's do Youtube**\n-----------------------------\n:postal_horn: **`"+ prefix +"s url`** | **`"+ prefix +"s`** - Entra num canal de voz e toca um url\n:mag: **`"+ prefix +"s finca chimia`** - Pesquisa por um vídeo no Ytb\n:page_with_curl: **`"+ prefix +"spl`** - Mostra a playlist atual\n:pause_button: **`"+ prefix +"sp`** - Pausa a reprodução\n:arrow_forward: **`"+ prefix +"sr`** - Resume a reprodução\n:fast_forward: **`"+ prefix +"ssk`** | **`"+ prefix +"ssk 5`** - Pula a faixa que está tocando/ou para a n° faixa\n:track_next: **`"+ prefix +"ssk all`** - Pula todas as faixas\n:repeat: **`"+ prefix +"srp`** - Ativa/desativa o repeteco\n:loudspeaker: **`"+ prefix +"sfd`** - Ativa/desativa o anúncio de faixas\n:radio: **`"+ prefix +"snp`** - Informações da faixa atual\n:wastebasket: **`"+ prefix +"srm 5`** | **`"+ prefix +"srm all`** - Remove uma ou todas as faixas da playlist\n:wave: **`"+ prefix +"sds`** - Desconecta o Alonsal do canal de voz\n:cd: **`"+ prefix +"sra ms`** | **`"+ prefix +"sra ms 10`** - Escolhe uma ou várias músicas aleatórias\n:cd: **`"+ prefix +"sra me`** | **`"+ prefix +"sra me 10`** - Escolhe uma ou várias músicas aleatórias zueiras\n:cd: **`"+ prefix +"sra jg`** | **`"+ prefix +"sra jg 10`** - Escolhe uma ou várias trilhas sonoras de jogos\n:cd: **`"+ prefix +"sra op`** | **`"+ prefix +"sra op 10`** - Escolhe uma ou várias músicas clássicas");
        }else{
            embed = new MessageEmbed()
            .setTitle("Musical Commands :musical_note:")
            .setColor(0x29BB8E)
            .setDescription("**Attention: For now I only accept URL's from Youtube**\n-----------------------------\n:postal_horn: **`"+ prefix +"s url`** | **`"+ prefix +"s`** - Enter a voice channel and play a url\n:mag: **`"+ prefix +"s pen pineapple`** - Search for a video on Youtube\n:page_with_curl: **`"+ prefix +"spl`** - Show current playlist\n:pause_button: **`"+ prefix +"sp`** - Pause playback\n:arrow_forward: **`"+ prefix +"sr`** - Resume reproduction\n:fast_forward: **`"+ prefix +"ssk`** | **`"+ prefix +"ssk 5`** - Skip the currently playing track/or to n° track\n:track_next: **`"+ prefix +"ssk all`** - skip all tracks\n:repeat: **`"+ prefix +"srp`** - Enables/disables repeat\n:loudspeaker: **`"+ prefix +"sfd`** - Enables/disables notice of new tracks\n:radio: **`"+ prefix +"snp`** - Current track info\n:wastebasket: **`"+ prefix +"srm 5`** | **`"+ prefix +"srm all`** - Remove one or all tracks from the playlist\n:wave: **`"+ prefix +"sds`** - Disconnect Alonsal from the voice channel\n:cd: **`"+ prefix +"sra ms`** | **`"+ prefix +"sra ms 10`** - Choose one or several random songs\n:cd: **`"+ prefix +"sra me`** | **`"+ prefix +"sra me 10`** - Choose one or several random funny songs\n:cd: **`"+ prefix +"sra jg`** | **`"+ prefix +"sra jg 10`** - Choose one or several game soundtracks\n:cd: **`"+ prefix +"sra op`** | **`"+ prefix +"sra op 10`** - Choose one or several classic songs");
        }

        message.lineReply(embed);
    }
}