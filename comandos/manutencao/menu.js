module.exports = {
    name: "menu",
    description: "Menu com os comandos do alonsal",
    aliases: [ "h", "juda", "comandos", "commands" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){
        
        const { MessageEmbed } = require('discord.js');
        const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        let emoji_pula = emoji(emojis.pula);
        let emoji_rainha = emoji(emojis.dancando_elizabeth);
        let emoji_bolo = emoji(emojis.mc_bolo);
        let emoji_mc = emoji(emojis.mc_earth);

        let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        const embed_inicial = new MessageEmbed()
        .setTitle('Boas vindas ao Ajuda! :boomerang:')
        .setColor(0x29BB8E)
        .setDescription("Use os números abaixo para navegar entre as seções de comandos Alonsais :stuck_out_tongue_winking_eye:\n\n**`.ah 1`** - `Comandos Divertidos`\n\n**`.ah 2`** - `Comandos Utilitários`\n\n**`.ah 3`** - `Comandos de Jogos`\n\n**`.ah 4`** - `Manutenção do Alonsal`\n\n**`.ah 5`** - `Manipulação de imagens`\n\n**`.ahm`** - `Menu dos moderadores`\n\n**`.ainfo`** - `Informações do Alonsal`\n\n :hotsprings: | _Mensagens com este símbolo serão excluídas automaticamente._")
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

        const embed_diversao = new MessageEmbed()
        .setTitle('Comandos Divertidos :zany_face:')
        .setColor(0x29BB8E)
        .setDescription(":innocent: **`.apaz`** | **`.apz`** - União\n:yum: **`.asfiha`** | **`.asf`** - Servidos?\n:rage: **`.abriga`** | **`.ab`** - Porradaria!\n:cow: **`.agado @Alonsal`** | **`.aga @Alonsal`** - Teste a Gadisse de alguém\n:sparkling_heart: **`.amor @Slondo @Alonsal`** - Teste o amor entre duas pessoas\n:bust_in_silhouette: **`.avatar`** | **`.avatar <@>`** - Ver seu avatar ou de outro usuário\n:raised_hands: **`.abaidu`** - Louvado seja!\n:chess_pawn: **`.apiao`** - Roda o pião Dona Maria!\n:blue_book: **`.acurio`** | **`.ac`** - Uma curiosidade aleatória\n:black_joker: **`.ajoke`** | **`.aj`** - Invoca uma piada\n:clown: **`.acazalbe`** | **`.acaz`** - Cazalbe!\n:tropical_drink: **`.ajailson`** | **`.aja`** - Jaílson!\n:pizza: **`.arasputia`** | **`.ara`** - Rasputia!")
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

        const embed_utilitarios = new MessageEmbed()
        .setTitle('Comandos Utilitários :compass:')
        .setColor(0x29BB8E)
        .setDescription(":ping_pong: **`.aping`** | **`.ap`** - Calcula seu ping\n:symbols: **`.am 8&7!`** | **`.am ---.. .-... --...`** - Codifica e decodifica do morse\n:one: **`.abn Alonso`** | **`.abn 11100011`** - Codifica e decodifica do binário\n:arrow_backward: **`.arev Alonso`** - Inverte e desinverte o texto\n:mag: **`.awiki Alonso`** | **`.aw Alonso`** - Pesquisa na wikipedia (en-US)\n:white_sun_small_cloud: **`.at`** | **`.atempo sao paulo`** - Clima atual de algum local\n"+ emoji_dancando +" **`.amoji <emoji>`** - Aumenta o tamanho do emoji\n:radio: **`.arep 9?`** - O Alonsal falará em TTS\n"+ emoji_mc + " **`.amc`** | **`.amc diamante`** - Exibe infos de um item do Minecraft\n:frame_photo: **`.aih`** - Comandos de imagens")
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

        const embed_jogos = new MessageEmbed()
        .setTitle('Comandos de Jogos :golf:')
        .setColor(0x29BB8E)
        .setDescription(":scissors: **`.ajkp papel`** | **`.ajkp`** - Jokenpô\n:coin: **`.acoin cara`** | **`.aco coroa`** - Teste sua sorte\n:game_die: **`.adado`** | **`.ada 10 16`** - Roda um ou vários dados com várias faces\n"+ emoji_pula +" **`.apula`** | **`.apredios`** - Jogo do Pula Prédios!\n"+ emoji_mc + " **`.amc`** | **`.amc diamante`** - Exibe infos de um item do Minecraft")
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

        const embed_manutencao = new MessageEmbed()
        .setTitle('Manutenção do Alonsal :tools:')
        .setColor(0x29BB8E)
        .setDescription(":information_source: **`.ainfo`** - Informações do bot\n:envelope: **`.amail <sua msg>`** - Envie uma mensagem para o bot :P\n:love_letter: **`.acvv`** | **`.aconvite`** - Convide-me para um Servidor!\n"+ emoji_rainha +" **`.ahub`** | **`.aserver`** - Entre no Hub multiconectado do Alonsal\n"+ emoji_bolo +" **`.asuporte`** - Ajude a manter e desenvolver o Alonsal")
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

        const embed_imagens = new MessageEmbed()
        .setTitle('Manipulação de Ibagens :frame_photo:')
        .setColor(0x29BB8E)
        .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
        .setDescription(":white_square_button: **`.aimg bw <img>`** | **`.ai bw <img>`** - Torna uma ou várias imagens preta e branca\n\n"+ emoji_dancando +" | Sugira efeitos tops para o Alonsal usando o `.amail <seu_efeito_top>` !\n\n:man_tipping_hand: | _Você pode abrir este menu com o comando `.aih`_")
        .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        
        pages = [
            embed_inicial,
            embed_diversao,
            embed_utilitarios,
            embed_jogos,
            embed_manutencao,
            embed_imagens
        ];
        
        if(args.length < 1){
            message.lineReply(embed_inicial);
            return;
        }

        if(isNaN(args[0]) || (args[0] < 0 || args[0] > 5)){
            message.lineReply(":warning: | Informe um número entre 1 e 5 para navegar pelas páginas do menu");
            return;
        }

        message.lineReply(pages[args[0]]);
    }
};