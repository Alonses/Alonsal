module.exports = {
    name: "menu",
    description: "Menu com os comandos do alonsal",
    aliases: [ "h", "juda", "comandos", "commands", "help" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){
        
        const reload = require('auto-reload');
        const { idioma_servers } = reload('../../arquivos/json/dados/idioma_servers.json');
        const { manutencao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        const idioma_selecionado = idioma_servers[message.guild.id];

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

        if(idioma_selecionado == "pt-br"){

            bandeira_trad = ":flag_us:";

            embed_inicial = new MessageEmbed()
            .setTitle('Boas vindas ao Ajuda! :boomerang:')
            .setColor(0x29BB8E)
            .setDescription("Use os números abaixo para navegar entre as seções de comandos Alonsais :stuck_out_tongue_winking_eye:\n\n:zany_face: **`.ah 1`** - `Comandos Divertidos`\n\n:compass: **`.ah 2`** - `Comandos Utilitários`\n\n:golf: **`.ah 3`** - `Comandos de Jogos`\n\n:musical_note: **`.ash`** - `Comandos Músicais`\n\n:tools: **`.ah 4`** - `Manutenção do Alonsal`\n\n:frame_photo: **`.ah 5`** -  `Manipulação de imagens`\n\n:scroll: **`.ahm`** - `Comandos moderativos`\n\n:information_source: **`.ainfo`** - `Informações do Alonsal`\n\n :hotsprings: | _Mensagens com este símbolo são excluídas automaticamente._\n"+ bandeira_trad +" | _Use the command `.alang en` to switch to `american english`_")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_diversao = new MessageEmbed()
            .setTitle('Comandos Divertidos :zany_face:')
            .setColor(0x29BB8E)
            .setDescription(":innocent: **`.apaz`** | **`.apz`** - União\n:yum: **`.asfiha`** | **`.asf`** - Servidos?\n:rage: **`.abriga`** | **`.ab`** - Porradaria!\n:cow: **`.agado @Alonsal`** | **`.aga @Alonsal`** - Teste a Gadisse de alguém\n:sparkling_heart: **`.amor @Slondo @Alonsal`** - Teste o amor entre duas pessoas\n:raised_hands: **`.abaidu`** - Louvado seja!\n:chess_pawn: **`.apiao`** - Roda o pião Dona Maria!\n:blue_book: **`.acurio`** | **`.ac`** - Uma curiosidade aleatória\n:black_joker: **`.ajoke`** | **`.aj`** - Invoca uma piada\n:clown: **`.acazalbe`** | **`.acaz`** - Cazalbe!\n:tropical_drink: **`.ajailson`** | **`.aja`** - Jaílson!\n:pizza: **`.arasputia`** | **`.ara`** - Rasputia!")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_utilitarios = new MessageEmbed()
            .setTitle('Comandos Utilitários :compass:')
            .setColor(0x29BB8E)
            .setDescription(":ping_pong: **`.aping`** | **`.ap`** - Calcula seu ping\n:symbols: **`.am 8&7!`** | **`.am ---.. .-... --...`** - Codifica e decodifica do morse\n:one: **`.abn Alonso`** | **`.abn 11100011`** - Codifica e decodifica do binário\n:arrow_backward: **`.arev Alonso`** - Inverte e desinverte o texto\n:closed_lock_with_key: **`.acr <chave> <seu_texto>`** | **`.acr <chave> <cripto>`** - Texto criptografado\n:mag: **`.awiki Alonso`** | **`.aw Alonso`** - Pesquisa na wikipedia (en-US)\n:white_sun_small_cloud: **`.at`** | **`.atempo sao paulo`** - Clima atual de algum local\n:classical_building: **`.acon`** | **`.acon 21-01`** - Um acontecimento numa data\n"+ emoji_dancando +" **`.amoji <emoji>`** - Aumenta o tamanho do emoji\n:radio: **`.arep 9?`** - O Alonsal falará em TTS\n:bust_in_silhouette: **`.avatar`** | **`.avatar <@>`** - Ver seu avatar ou de outro usuário\n"+ emoji_mc + " **`.amc`** | **`.amc diamante`** - Exibe infos de um item do Minecraft\n:frame_photo: **`.aih`** - Comandos de imagens")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_jogos = new MessageEmbed()
            .setTitle('Comandos de Jogos :golf:')
            .setColor(0x29BB8E)
            .setDescription(":scissors: **`.ajkp papel`** | **`.ajkp`** - Jokenpô\n:coin: **`.acoin cara`** | **`.aco coroa`** - Teste sua sorte\n:game_die: **`.adado`** | **`.ada 10 16`** - Roda um ou vários dados com várias faces\n"+ emoji_pula +" **`.apula`** | **`.apredios`** - Jogo do Pula Prédios!\n"+ emoji_mc + " **`.amc`** | **`.amc diamante`** - Exibe infos de um item do Minecraft")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_manutencao = new MessageEmbed()
            .setTitle('Manutenção do Alonsal :tools:')
            .setColor(0x29BB8E)
            .setDescription(":information_source: **`.ainfo`** - Informações do bot\n:envelope: **`.amail <sua msg>`** - Envie uma mensagem para o bot :P\n:love_letter: **`.acvv`** | **`.aconvite`** - Convide-me para um Servidor!\n"+ emoji_rainha +" **`.ahub`** | **`.aserver`** - Entre no Hub multiconectado do Alonsal\n"+ emoji_bolo +" **`.asuporte`** - Ajude a manter e desenvolver o Alonsal\n"+ bandeira_trad +" **`.alang en`** | **`.alang pt`** - Altera o idioma do Alonsal")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_imagens = new MessageEmbed()
            .setTitle('Manipulação de Ibagens :frame_photo:')
            .setColor(0x29BB8E)
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(":white_square_button: **`.aimg bw <img>`** | **`.ai bw <img>`** - Torna uma ou várias imagens preta e branca\n\n"+ emoji_dancando +" | Sugira efeitos tops para o Alonsal usando o `.amail <seu_efeito_top>` !\n\n:man_tipping_hand: | _Você pode abrir este menu com o comando `.aih`_")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        }else{ // Inglês

            bandeira_trad = ":flag_br:";

            embed_inicial = new MessageEmbed()
            .setTitle('Welcome to Help! :boomerang:')
            .setColor(0x29BB8E)
            .setDescription("Use the numbers below to navigate between sections of Alonsais commands :stuck_out_tongue_winking_eye:\n\n:zany_face: **`.ah 1`** - `Funny Commands`\n\n:compass: **`.ah 2`** - `Utility Commands`\n\n:golf: **`.ah 3`** - `Game Commands`\n\n:musical_note: **`.ash`** - `Musical Commands`\n\n:tools: **`.ah 4`** - `Alonsal Maintenance`\n\n:frame_photo: **`.ah 5`** -  `Image manipulation`\n\n:scroll: **`.ahm`** - `Moderative Commands`\n\n:information_source: **`.ainfo`** - `My informations`\n\n :hotsprings: | _Messages with this symbol are automatically deleted.._\n"+ bandeira_trad +" | _Use o comando `.alang pt` para trocar para o `português brasileiro`_")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_diversao = new MessageEmbed()
            .setTitle('Funny Commands :zany_face:')
            .setColor(0x29BB8E)
            .setDescription(":innocent: **`.apaz`** | **`.apz`** - Union\n:yum: **`.asfiha`** | **`.asf`** - Served?\n:rage: **`.abriga`** | **`.ab`** - Breaking!\n:cow: **`.agado @Alonsal`** | **`.aga @Alonsal`** - Test someone's livestock level\n:sparkling_heart: **`.amor @Slondo @Alonsal`** - Test the love between two people\n:raised_hands: **`.abaidu`** - Praise be!\n:chess_pawn: **`.apiao`** - Rotate the pawn Ms. Maria!\n:blue_book: **`.acurio`** | **`.ac`** - A random curiosity\n:black_joker: **`.ajoke`** | **`.aj`** - Invoke a joke\n:clown: **`.acazalbe`** | **`.acaz`** - Cazalbe!\n:tropical_drink: **`.ajailson`** | **`.aja`** - Jaílson!\n:pizza: **`.arasputia`** | **`.ara`** - Rasputia!")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_utilitarios = new MessageEmbed()
            .setTitle('Utility Commands :compass:')
            .setColor(0x29BB8E)
            .setDescription(":ping_pong: **`.aping`** | **`.ap`** - Show your ping\n:symbols: **`.am 8&7!`** | **`.am ---.. .-... --...`** - Encodes and decodes morse\n:one: **`.abn Alonso`** | **`.abn 11100011`** - Encodes and decodes binary\n:arrow_backward: **`.arev Alonso`** - Reverse text characters\n:closed_lock_with_key: **`.acr <key> <your_text>`** | **`.acr <key> <crypto>`** - Encrypted text\n:mag: **`.awiki Alonso`** | **`.aw Alonso`** - Search on wikipedia\n:white_sun_small_cloud: **`.at`** | **`.aweather los angeles`** - Current weather somewhere\n:classical_building: **`.acon`** | **`.acon 01-21`** - An event on a date\n"+ emoji_dancando +" **`.amoji <emoji>`** - Increase emoji size\n:radio: **`.arep 9?`** - Alonsal will speak in TTS\n:bust_in_silhouette: **`.avatar`** | **`.avatar <@>`** - View your avatar or another user's\n"+ emoji_mc + " **`.amc`** | **`.amc diamond`** - Display info for a Minecraft item\n:frame_photo: **`.aih`** - Image commands")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_jogos = new MessageEmbed()
            .setTitle('Game Commands :golf:')
            .setColor(0x29BB8E)
            .setDescription(":scissors: **`.ajkp paper`** | **`.ajkp`** - Jokenpo\n:coin: **`.acoin tails`** | **`.aco heads`** - Test your luck\n:game_die: **`.adice`** | **`.adi 10 16`** - Roll one or more dice with multiple faces\n"+ emoji_pula +" **`.apula`** | **`.apredios`** - Pula Buildings Game!\n"+ emoji_mc + " **`.amc`** | **`.amc diamond`** - Display info for a Minecraft item")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_manutencao = new MessageEmbed()
            .setTitle('Alonsal Maintenance :tools:')
            .setColor(0x29BB8E)
            .setDescription(":information_source: **`.ainfo`** - My informations\n:envelope: **`.amail <sua msg>`** - Send a message to me! :P\n:love_letter: **`.acvv`** | **`.aconvite`** - Invite me to a server!\n"+ emoji_rainha +" **`.ahub`** | **`.aserver`** - Enter Alonsal's Multiconnected Hub\n"+ emoji_bolo +" **`.asuporte`** - Help maintain and develop the Alonsal\n"+ bandeira_trad +" **`.alang en`** | **`.alang pt`** - Change Alonsal's language")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_imagens = new MessageEmbed()
            .setTitle('Image manipulation :frame_photo:')
            .setColor(0x29BB8E)
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(":white_square_button: **`.aimg bw <img>`** | **`.ai bw <img>`** - Makes one or more images black and white\n\n"+ emoji_dancando +" | Suggest top effects to Alonsal using the `.amail <seu_efeito_top>` !\n\n:man_tipping_hand: | _You can open this menu with the command `.aih`_")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        }

        pages = [
            embed_inicial,
            embed_diversao,
            embed_utilitarios,
            embed_jogos,
            embed_manutencao,
            embed_imagens
        ];
        
        if(args.length < 1)
            return message.lineReply(embed_inicial);

        if(isNaN(args[0]) || (args[0] < 0 || args[0] > 5))
            return message.lineReply(":warning: | "+ manutencao[7]["aviso_1"]);

        message.lineReply(pages[args[0]]);
    }
};