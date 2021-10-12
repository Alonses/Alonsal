const { MessageEmbed } = require('discord.js');
const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "menu",
    description: "Menu com os comandos do alonsal",
    aliases: [ "h", "juda", "comandos", "commands", "help" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){

        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { manutencao } = require('../../arquivos/idiomas/'+ idioma_servers[message.guild.id] +'.json');
        const idioma_selecionado = idioma_servers[message.guild.id];

        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        let emoji_pula = emoji(emojis.pula);
        let emoji_rainha = emoji(emojis.dancando_elizabeth);
        let emoji_bolo = emoji(emojis.mc_bolo);
        let emoji_mc = emoji(emojis.mc_earth);

        let emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        let prefix = client.prefixManager.getPrefix(message.guild.id);
        if(!prefix)
            prefix = ".a";

        let embed_inicial,
            embed_diversao,
            embed_utilitarios,
            embed_jogos,
            embed_manutencao,
            embed_imagens;
            
        if(idioma_selecionado === "pt-br"){

            let bandeira_trad = ":flag_us:";

            embed_inicial = new MessageEmbed()
            .setTitle('Boas vindas ao Ajuda! :boomerang:')
            .setColor(0x29BB8E)
            .setDescription("Use os números abaixo para navegar entre as seções de comandos Alonsais :stuck_out_tongue_winking_eye:\n\n:zany_face: **`"+ prefix +"h 1`** - `Comandos Divertidos`\n\n:compass: **`"+ prefix +"h 2`** - `Comandos Utilitários`\n\n:golf: **`"+ prefix +"h 3`** - `Comandos de Jogos`\n\n:musical_note: **`"+ prefix +"sh`** - `Comandos Músicais`\n\n:tools: **`"+ prefix +"h 4`** - `Manutenção do Alonsal`\n\n:frame_photo: **`"+ prefix +"h 5`** -  `Manipulação de imagens`\n\n:scroll: **`"+ prefix +"hm`** - `Comandos moderativos`\n\n:information_source: **`"+ prefix +"info`** - `Informações do Alonsal`\n\n :hotsprings: | _Mensagens com este símbolo são excluídas automaticamente._\n"+ bandeira_trad +" | _Use the command `"+ prefix +"lang en` to switch to `american english`_")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_diversao = new MessageEmbed()
            .setTitle('Comandos Divertidos :zany_face:')
            .setColor(0x29BB8E)
            .setDescription(":innocent: **`"+ prefix +"paz`** | **`"+ prefix +"pz`** - União\n:yum: **`"+ prefix +"sfiha`** | **`"+ prefix +"sf`** - Servidos?\n:rage: **`"+ prefix +"briga`** | **`"+ prefix +"b`** - Porradaria!\n:cow: **`"+ prefix +"gado @Alonsal`** | **`"+ prefix +"ga @Alonsal`** - Teste a Gadisse de alguém\n:sparkling_heart: **`"+ prefix +"mor @Slondo @Alonsal`** - Teste o amor entre duas pessoas\n:raised_hands: **`"+ prefix +"baidu`** - Louvado seja!\n:chess_pawn: **`"+ prefix +"piao`** - Roda o pião Dona Maria!\n:blue_book: **`"+ prefix +"curio`** | **`"+ prefix +"c`** - Uma curiosidade aleatória\n:black_joker: **`"+ prefix +"joke`** | **`"+ prefix +"j`** - Invoca uma piada\n:clown: **`"+ prefix +"cazalbe`** | **`"+ prefix +"caz`** - Cazalbe!\n:tropical_drink: **`"+ prefix +"jailson`** | **`"+ prefix +"ja`** - Jaílson!\n:pizza: **`"+ prefix +"rasputia`** | **`"+ prefix +"ra`** - Rasputia!")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_utilitarios = new MessageEmbed()
            .setTitle('Comandos Utilitários :compass:')
            .setColor(0x29BB8E)
            .setDescription(":ping_pong: **`"+ prefix +"ping`** | **`"+ prefix +"p`** - Calcula seu ping\n:symbols: **`"+ prefix +"m 8&7!`** | **`"+ prefix +"m ---.. .-... --...`** - Codifica e decodifica do morse\n:one: **`"+ prefix +"bn Alonso`** | **`"+ prefix +"bn 11100011`** - Codifica e decodifica do binário\n:arrow_backward: **`"+ prefix +"rev Alonso`** - Inverte e desinverte o texto\n:closed_lock_with_key: **`"+ prefix +"cr <chave> <seu_texto>`** | **`"+ prefix +"cr <chave> <cripto>`** - Texto criptografado\n:mag: **`"+ prefix +"wiki Alonso`** | **`"+ prefix +"w Alonso`** - Pesquisa na wikipedia (en-US)\n:white_sun_small_cloud: **`"+ prefix +"t`** | **`"+ prefix +"tempo sao paulo`** - Clima atual de algum local\n:classical_building: **`"+ prefix +"con`** | **`"+ prefix +"con 21-01`** - Um acontecimento numa data\n"+ emoji_dancando +" **`"+ prefix +"moji <emoji>`** - Aumenta o tamanho do emoji\n:radio: **`"+ prefix +"rep 9?`** - O Alonsal falará em TTS\n:bust_in_silhouette: **`"+ prefix +"vatar`** | **`"+ prefix +"vatar <@>`** - Ver seu avatar ou de outro usuário\n:busts_in_silhouette: **`"+ prefix +"icon`** - Veja o icone de um servidor\n"+ emoji_mc + " **`"+ prefix +"mc`** | **`"+ prefix +"mc diamante`** - Exibe infos de um item do Minecraft\n:frame_photo: **`"+ prefix +"ih`** - Comandos de imagens")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_jogos = new MessageEmbed()
            .setTitle('Comandos de Jogos :golf:')
            .setColor(0x29BB8E)
            .setDescription(":scissors: **`"+ prefix +"jkp papel`** | **`"+ prefix +"jkp`** - Jokenpô\n:coin: **`"+ prefix +"coin cara`** | **`"+ prefix +"co coroa`** - Teste sua sorte\n:game_die: **`"+ prefix +"dado`** | **`"+ prefix +"da 10 16`** - Roda um ou vários dados com várias faces\n"+ emoji_pula +" **`"+ prefix +"pula`** | **`"+ prefix +"predios`** - Jogo do Pula Prédios!\n"+ emoji_mc + " **`"+ prefix +"mc`** | **`"+ prefix +"mc diamante`** - Exibe infos de um item do Minecraft")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_manutencao = new MessageEmbed()
            .setTitle('Manutenção do Alonsal :tools:')
            .setColor(0x29BB8E)
            .setDescription(":information_source: **`"+ prefix +"info`** - Informações do bot\n:computer: **`"+ prefix +"site`** - O meu site com diversos comandos\n:envelope: **`"+ prefix +"mail <sua msg>`** - Envie uma mensagem para o bot :P\n:love_letter: **`"+ prefix +"cvv`** | **`"+ prefix +"convite`** - Convide-me para um Servidor!\n"+ emoji_rainha +" **`"+ prefix +"hub`** | **`"+ prefix +"server`** - Entre no Hub multiconectado do Alonsal\n"+ emoji_bolo +" **`"+ prefix +"suporte`** - Ajude a manter e desenvolver o Alonsal\n"+ bandeira_trad +" **`"+ prefix +"lang en`** | **`"+ prefix +"lang pt`** - Altera o idioma do Alonsal")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_imagens = new MessageEmbed()
            .setTitle('Manipulação de Ibagens :frame_photo:')
            .setColor(0x29BB8E)
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(":white_square_button: **`"+ prefix +"img bw <img>`** | **`"+ prefix +"i bw <img>`** - Torna uma ou várias imagens preta e branca\n\n"+ emoji_dancando +" | Sugira efeitos tops para o Alonsal usando o `"+ prefix +"mail <seu_efeito_top>` !\n\n:man_tipping_hand: | _Você pode abrir este menu com o comando `"+ prefix +"ih`_")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        }else{ // Inglês

            let bandeira_trad = ":flag_br:";

            embed_inicial = new MessageEmbed()
            .setTitle('Welcome to Help! :boomerang:')
            .setColor(0x29BB8E)
            .setDescription("Use the numbers below to navigate between sections of Alonsais commands :stuck_out_tongue_winking_eye:\n\n:zany_face: **`"+ prefix +"h 1`** - `Funny Commands`\n\n:compass: **`"+ prefix +"h 2`** - `Utility Commands`\n\n:golf: **`"+ prefix +"h 3`** - `Game Commands`\n\n:musical_note: **`"+ prefix +"sh`** - `Musical Commands`\n\n:tools: **`"+ prefix +"h 4`** - `Alonsal Maintenance`\n\n:frame_photo: **`"+ prefix +"h 5`** -  `Image manipulation`\n\n:scroll: **`"+ prefix +"hm`** - `Moderative Commands`\n\n:information_source: **`"+ prefix +"info`** - `My informations`\n\n :hotsprings: | _Messages with this symbol are automatically deleted.._\n"+ bandeira_trad +" | _Use o comando `"+ prefix +"lang pt` para trocar para o `português brasileiro`_")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_diversao = new MessageEmbed()
            .setTitle('Funny Commands :zany_face:')
            .setColor(0x29BB8E)
            .setDescription(":innocent: **`"+ prefix +"paz`** | **`"+ prefix +"pz`** - Union\n:yum: **`"+ prefix +"sfiha`** | **`"+ prefix +"sf`** - Served?\n:rage: **`"+ prefix +"briga`** | **`"+ prefix +"b`** - Breaking!\n:cow: **`"+ prefix +"gado @Alonsal`** | **`"+ prefix +"ga @Alonsal`** - Test someone's livestock level\n:sparkling_heart: **`"+ prefix +"mor @Slondo @Alonsal`** - Test the love between two people\n:raised_hands: **`"+ prefix +"baidu`** - Praise be!\n:chess_pawn: **`"+ prefix +"piao`** - Rotate the pawn Ms. Maria!\n:blue_book: **`"+ prefix +"curio`** | **`"+ prefix +"c`** - A random curiosity\n:black_joker: **`"+ prefix +"joke`** | **`"+ prefix +"j`** - Invoke a joke\n:clown: **`"+ prefix +"cazalbe`** | **`"+ prefix +"caz`** - Cazalbe!\n:tropical_drink: **`"+ prefix +"jailson`** | **`"+ prefix +"ja`** - Jaílson!\n:pizza: **`"+ prefix +"rasputia`** | **`"+ prefix +"ra`** - Rasputia!")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_utilitarios = new MessageEmbed()
            .setTitle('Utility Commands :compass:')
            .setColor(0x29BB8E)
            .setDescription(":ping_pong: **`"+ prefix +"ping`** | **`"+ prefix +"p`** - Show your ping\n:symbols: **`"+ prefix +"m 8&7!`** | **`"+ prefix +"m ---.. .-... --...`** - Encodes and decodes morse\n:one: **`"+ prefix +"bn Alonso`** | **`"+ prefix +"bn 11100011`** - Encodes and decodes binary\n:arrow_backward: **`"+ prefix +"rev Alonso`** - Reverse text characters\n:closed_lock_with_key: **`"+ prefix +"cr <key> <your_text>`** | **`"+ prefix +"cr <key> <crypto>`** - Encrypted text\n:mag: **`"+ prefix +"wiki Alonso`** | **`"+ prefix +"w Alonso`** - Search on wikipedia\n:white_sun_small_cloud: **`"+ prefix +"t`** | **`"+ prefix +"weather los angeles`** - Current weather somewhere\n:classical_building: **`"+ prefix +"con`** | **`"+ prefix +"con 01-21`** - An event on a date\n"+ emoji_dancando +" **`"+ prefix +"moji <emoji>`** - Increase emoji size\n:radio: **`"+ prefix +"rep 9?`** - Alonsal will speak in TTS\n:bust_in_silhouette: **`"+ prefix +"vatar`** | **`"+ prefix +"vatar <@>`** - View your avatar or another user's\n:busts_in_silhouette: **`"+ prefix +"icon`** - See a server icon\n"+ emoji_mc + " **`"+ prefix +"mc`** | **`"+ prefix +"mc diamond`** - Display info for a Minecraft item\n:frame_photo: **`"+ prefix +"ih`** - Image commands")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_jogos = new MessageEmbed()
            .setTitle('Game Commands :golf:')
            .setColor(0x29BB8E)
            .setDescription(":scissors: **`"+ prefix +"jkp paper`** | **`"+ prefix +"jkp`** - Jokenpo\n:coin: **`"+ prefix +"coin tails`** | **`"+ prefix +"co heads`** - Test your luck\n:game_die: **`"+ prefix +"dice`** | **`"+ prefix +"di 10 16`** - Roll one or more dice with multiple faces\n"+ emoji_pula +" **`"+ prefix +"pula`** | **`"+ prefix +"predios`** - Pula Buildings Game!\n"+ emoji_mc + " **`"+ prefix +"mc`** | **`"+ prefix +"mc diamond`** - Display info for a Minecraft item")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_manutencao = new MessageEmbed()
            .setTitle('Alonsal Maintenance :tools:')
            .setColor(0x29BB8E)
            .setDescription(":information_source: **`"+ prefix +"info`** - My informations\n:computer: **`"+ prefix +"site`** - My website with several commands\n:envelope: **`"+ prefix +"mail <sua msg>`** - Send a message to me! :P\n:love_letter: **`"+ prefix +"cvv`** | **`"+ prefix +"convite`** - Invite me to a server!\n"+ emoji_rainha +" **`"+ prefix +"hub`** | **`"+ prefix +"server`** - Enter Alonsal's Multiconnected Hub\n"+ emoji_bolo +" **`"+ prefix +"suporte`** - Help maintain and develop the Alonsal\n"+ bandeira_trad +" **`"+ prefix +"lang en`** | **`"+ prefix +"lang pt`** - Change Alonsal's language")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));

            embed_imagens = new MessageEmbed()
            .setTitle('Image manipulation :frame_photo:')
            .setColor(0x29BB8E)
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(":white_square_button: **`"+ prefix +"img bw <img>`** | **`"+ prefix +"i bw <img>`** - Makes one or more images black and white\n\n"+ emoji_dancando +" | Suggest top effects to Alonsal using the `"+ prefix +"mail <seu_efeito_top>` !\n\n:man_tipping_hand: | _You can open this menu with the command `"+ prefix +"ih`_")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
        }

        const pages = [
            embed_inicial,
            embed_diversao,
            embed_utilitarios,
            embed_jogos,
            embed_manutencao,
            embed_imagens
        ];
        
        if(args.length < 1)
            return message.reply({ embeds: [embed_inicial] });

        if(isNaN(args[0]) || (args[0] < 0 || args[0] > 5))
            return message.reply(":warning: | "+ manutencao[7]["aviso_1"]);

        message.reply({ embeds: [pages[args[0]]] });
    }
};