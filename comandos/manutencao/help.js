const { MessageEmbed } = require('discord.js');
const { version } = require('../../config.json');

module.exports = async({client, message, args}) => {
    
    function emoji(id){
        return client.emojis.cache.get(id).toString();
    }

    emoji_pula = emoji('824127093751283722');
    emoji_rainha = emoji('854171515641659402');

    const embed_inicial = new MessageEmbed()
    .setTitle('Boas vindas ao Ajuda! :boomerang:')
    .setColor(0x29BB8E)
    .setDescription("Use os emojis abaixo para navegar entre as seções de comandos Alonsais :stuck_out_tongue_winking_eye:\n\n:zany_face: - `Comandos Divertidos`\n\n:compass: - `Comandos Utilitários`\n\n:golf: - `Comandos de Jogos`\n\n:tools: - `Comandos de Manutenção`\n\n:musical_note: - `Comandos Musicais`\n\n:information_source: - `Informações do Alonsal`")
    .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }));

    const embed_diversao = new MessageEmbed()
    .setTitle('Comandos Divertidos :zany_face:')
    .setColor(0x29BB8E)
    .setDescription(":innocent: **`.apaz`** | **`.apz`** - União\n:yum: **`.asfiha`** | **`.asf`** - Servidos?\n:rage: **`.abriga`** | **`.ab`** - Porradaria!\n:cow: **`.agado @Alonsal`** | **`.aga @Alonsal`** - Teste a Gadisse de alguém\n:sparkling_heart: **`.amor @Slondo @Alonsal`** - Teste o amor entre duas pessoas\n:raised_hands: **`.abaidu`** - Louvado seja!\n:chess_pawn: **`.apiao`** - Roda o pião Dona Maria!\n:blue_book: **`.acurio`** | **`.ac`** - Uma curiosidade aleatória\n:black_joker: **`.ajoke`** | **`.aj`** - Invoca uma piada\n:clown: **`.acazalbe`** | **`.acaz`** - Cazalbe!")
    .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }));

    const embed_utilitarios = new MessageEmbed()
    .setTitle('Comandos Utilitários :compass:')
    .setColor(0x29BB8E)
    .setDescription(":musical_note: **`.ash`** - Comandos musicais\n:ping_pong: **`.aping`** | **`.ap`** - Calcula seu ping\n:symbols: **`.am 8&7!`** | **`.am ---.. .-... --...`** - Codifica e decodifica do morse\n:one: **`.abn Alonso`** | **`.abn 11100011`** - Codifica e decodifica do binário\n:arrow_backward: **`.arev Alonso`** - Inverte e desinverte o texto\n:mag: **`.awiki Alonso`** | **`.aw Alonso`** - Pesquisa na wikipedia (en-US)\n:white_sun_small_cloud: **`.at`** | **`.atempo sao paulo`** - Clima atual de alguma cidade\n:sleeping: **`.afk`** | **`.afk jogando FF`** - Avisa outros membros caso marquem você")
    .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }));

    const embed_jogos = new MessageEmbed()
    .setTitle('Comandos de Jogos :golf:')
    .setColor(0x29BB8E)
    .setDescription(":scissors: **`.ajkp papel`** | **`.ajkp`** - Jokenpô\n:coin: **`.acoin cara`** | **`.aco coroa`** - Teste sua sorte\n:game_die: **`.adado`** | **`.ada 10 16`** - Roda um ou vários dados com várias faces\n"+ emoji_pula +" **`.apula`** | **`.apredios`** - Jogo do Pula Prédios!")
    .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }));

    const embed_manutencao = new MessageEmbed()
    .setTitle('Comandos de Manutenção :tools:')
    .setColor(0x29BB8E)
    .setDescription(":information_source: **`.ainfo`** | **`.ai`** - Informações do bot\n:envelope: **`.amail <sua msg>`** - Envie uma mensagem para o bot :P\n:love_letter: **`.acvv`** | **`.aconvite`** - Convide-me para um Servidor!\n"+ emoji_rainha +" **`.ahub`** | **`.aserver`** - Entre no Hub multiconectado do Alonsal")
    .setFooter(message.author.username, message.author.avatarURL({ dynamic:true }));

    const embed_infos = new MessageEmbed()
    .setTitle('Patinando entre as linhas bugadas :man_golfing:')
    .setColor(0x29BB8E)
    .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
    .setDescription('Este bot é patrocinado por Baidu e Renato\'s lanche, 40 tipos de lanche, hot dog, fastfood em 5 minutos, a maior casa de lanches de extrema, venha comer o renatão de 4, o lanche completo!\n\n:mailbox: Sugira comandos ou reporte bugs usando o **`.amail <sua msg>`**\n:page_facing_up: Utilize **`.ag`** ou **`.agit`** para visualizar o repositório do Alonsal.\n'+ emoji_rainha +' **`.ahub`** | **`.aserver`** - Entre no Hub multiconectado do Alonsal.\n\n-----------------------------\n> OUTROS RECURSOS\nFrases do **`.aga`** | **`.agado`** são de total direito do @GadoDecider, todos os créditos vão a ele. ( https://twitter.com/GadoDecider )\n\nJá fui invocado _'+ args +'_ vezes :zany_face:\n [ _Versão '+ version + '_ ]')
    .setFooter("Alonsal", "https://i.imgur.com/K61ShGX.png");

    const embed_musical = new MessageEmbed()
    .setTitle('Comandos Musicais :musical_note:')
    .setColor(0x29BB8E)
    .setDescription("**Atenção: Por enquanto só aceito URL's do Youtube**\n-----------------------------\n:postal_horn: **`.as url`** | **`.as`** - Entra num canal de voz e toca um url\n:mag: **`.as finca chimia`** - Pesquisa por um vídeo no Ytb\n:page_with_curl: **`.aspl`** - Mostra a playlist atual\n:pause_button: **`.asp`** - Pausa a reprodução\n:arrow_forward: **`.asr`** - Resume a reprodução\n:fast_forward: **`.assk`** | **`.assk 5`** - Pula a faixa que está tocando/ou para a n° faixa\n:track_next: **`.assk all`** - Pula todas as faixas\n:repeat: **`.asrp`** - Ativa/desativa o repeteco\n:loudspeaker: **`.asfd`** - Ativa/desativa o anúncio de faixas\n:radio: **`.asnp`** - Informações da faixa atual\n:wastebasket: **`.asrm 5`** | **`.asrm all`** - Remove uma ou todas as faixas da playlist\n:wave: **`.asds`** - Desconecta o Alonso do canal de voz\n:cd: **`.asra ms`** | **`.asra ms 10`** - Escolhe uma ou várias músicas aleatórias\n:cd: **`.asra me`** | **`.asra me 10`** - Escolhe uma ou várias músicas aleatórias zueiras\n:cd: **`.asra jg`** | **`.asra jg 10`** - Escolhe uma ou várias trilhas sonoras de jogos\n:cd: **`.asra op`** | **`.asra op 10`** - Escolhe uma ou várias músicas clássicas");

    pages = [
        embed_inicial,
        embed_diversao,
        embed_utilitarios,
        embed_jogos,
        embed_manutencao,
        embed_musical,
        embed_infos
    ]

    emojiList = ['🤪', '🧭', '⛳', '🛠️', '🎵', 'ℹ️'];
    
    let mensagem = await message.channel.send(embed_inicial)

    for(let i = 0; i < emojiList.length; i++){
        mensagem.react(emojiList[i])
    }

    const filter = (reaction, user) => {
        return ['🤪', '🧭', '⛳', '🛠️', '🎵', 'ℹ️'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    aguarda_reacao(mensagem)

    function aguarda_reacao(mensagem){

        if(typeof limpa_reacoes != "undefined")
            clearTimeout(limpa_reacoes)

        mensagem.awaitReactions(filter, { max: 1, time: 20000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();

            let embed_escolhido = emojiList.indexOf(reaction.emoji.name) + 1 // Escolhe o embed para exibir
            mensagem.edit(pages[embed_escolhido])
        
            const userReactions = mensagem.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));

            for (const reaction of userReactions.values()) {
                reaction.users.remove(message.author.id).catch(error => message.channel.send(":tools: Não foi possivel remover suas reações automaticamente, para isto preciso de permissões para gerenciar as mensagens."));
            }

            aguarda_reacao(mensagem)
        })
        .catch(collected => {
            return
        });

        limpa_reacoes = setTimeout(() => {

            const permissions = message.channel.permissionsFor(message.client.user);

            if(permissions.has("MANAGE_MESSAGES"))
                mensagem.reactions.removeAll();
            else
                message.channel.send(":tools: Não foi possivel remover o menu automaticamente, para isto preciso de permissões para gerenciar as mensagens.")
        }, 20000)
    }
}