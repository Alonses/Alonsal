const { MessageEmbed } = require('discord.js');
const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

module.exports = {
    name: "menu",
    description: "Menu com os comandos do alonsal",
    aliases: [ "h", "juda", "help" ],
    cooldown: 2,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args){
        const idioma_selecionado = client.idioma.getLang(message.guild.id);
        const { manutencao } = require('../../arquivos/idiomas/'+ idioma_selecionado +'.json');

        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        if(typeof args[0] !== "undefined")
            if(isNaN(args[0].raw)){ // Help de comandos
                require('../../adm/internos/helpcomandos.js')({client, message, args});
                return;
            }

        const emoji_pula = emoji(emojis.pula_2);
        const emoji_rainha = emoji(emojis.dancando_elizabeth);
        const emoji_bolo = emoji(emojis.mc_bolo);
        const emoji_mc = emoji(emojis.mc_earth);
        const emoji_steam = emoji(emojis.lg_steam);
        let bandeira_trad;

        const emoji_dancando = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        const prefix = client.prefixManager.getPrefix(message.guild.id);
        let embed_inicial, embed_diversao, embed_utilitarios, embed_jogos, embed_manutencao;
            
        if(idioma_selecionado === "pt-br"){

            bandeira_trad = ":flag_us:";

            embed_inicial = new MessageEmbed()
            .setTitle('Boas vindas ao Ajuda! :boomerang:')
            .setColor(0x29BB8E)
            .setDescription(`Use os números abaixo para navegar entre as seções de comandos Alonsais :stuck_out_tongue_winking_eye:\n\n:zany_face: **\`${prefix}h 1\`** - \`Comandos Divertidos\`\n\n:compass: **\`${prefix}h 2\`** - \`Comandos Utilitários\`\n\n:golf: **\`${prefix}h 3\`** - \`Comandos de Jogos\`\n\n:tools: **\`${prefix}h 4\`** - \`Manutenção do Alonsal\`\n\n:scroll: **\`${prefix}hm\`** - \`Comandos moderativos\`\n\n:satellite: **\`${prefix}tr h\`** - \`Assistente de trabalho\`\n\n:information_source: **\`${prefix}info\`** - \`Informações do Alonsal\`\n\n:mag: | Veja exemplos de uso e informações de comandos com \`${prefix}\h >comando<\`\n:hotsprings: | _Mensagens com este símbolo são excluídas automaticamente._\n${bandeira_trad} | _Use the command \`${prefix}lang en\` to switch to \`american english\`_`);
            
            embed_diversao = new MessageEmbed()
            .setTitle('Comandos Divertidos :zany_face:')
            .setColor(0x29BB8E)
            .setDescription(`:medal: **\`${prefix}rank\`** **\`${prefix}r <@>\`** - Veja o rank do servidor ou de um usuário\n:cow: **\`${prefix}gado @Alonsal\`** | **\`${prefix}ga @Alonsal\`** - Teste a Gadisse de alguém\n:sparkling_heart: **\`${prefix}mor @Slondo @Alonsal\`** - Teste o amor entre duas pessoas\n:raised_hands: **\`${prefix}baidu\`** - Louvado seja!\n:radio: **\`${prefix}rep 9?\`** - O Alonsal falará em TTS\n:nail_care: **\`${prefix}na slomdo\`** - Cria alguns anagramas\n:blue_book: **\`${prefix}curio\`** | **\`${prefix}c\`** - Uma curiosidade aleatória\n:black_joker: **\`${prefix}joke\`** | **\`${prefix}j\`** - Invoca uma piada\n:black_nib: **\`${prefix}sans\`** - EsCrEva aSsIm\n\n:mag: | Veja exemplos de uso e informações de comandos com \`${prefix}\h anagrama\``);

            embed_utilitarios = new MessageEmbed()
            .setTitle('Comandos Utilitários :compass:')
            .setColor(0x29BB8E)
            .setDescription(`:ping_pong: **\`${prefix}ping\`** | **\`${prefix}p\`** - Calcula seu ping\n:symbols: **\`${prefix}m 8&7!\`** | **\`${prefix}m ---.. .-... --...\`** - Codifica e decodifica do morse\n:one: **\`${prefix}bn Alonso\`** | **\`${prefix}bn 11100011\`** - Codifica e decodifica do binário\n:arrow_backward: **\`${prefix}rev Alonso\`** - Inverte e desinverte o texto\n:closed_lock_with_key: **\`${prefix}cr <chave> <seu_texto>\`** | **\`${prefix}cr <chave> <cripto>\`** - Texto criptografado\n:lock_with_ink_pen: **\`${prefix}psw 15\`** - Gera senhas\n:abacus: **\`${prefix}calc 2 - 1\`** - Calculadora alonsal\n:mag: **\`${prefix}wiki Alonso\`** | **\`${prefix}w Alonso\`** - Pesquisa na wikipedia (en-US)\n:white_sun_small_cloud: **\`${prefix}t\`** | **\`${prefix}tempo sao paulo\`** - Clima atual de algum local\n:classical_building: **\`${prefix}con\`** | **\`${prefix}con 21-01\`** - Um acontecimento numa data\n${emoji_dancando} **\`${prefix}moji <emoji>\`** - Amplia um emoji\n${emoji_steam} **\`${prefix}sus slondotk\`** - O perfil de alguém na steam\n:pencil: **\`${prefix}rm o slomdo\` | \`${prefix}rp o i slomdo\`** - Remove ou substituí os caracteres\n:bust_in_silhouette: **\`${prefix}vatar\`** | **\`${prefix}vatar <@>\`** - Ver seu avatar ou de outro usuário\n:busts_in_silhouette: **\`${prefix}icon\`** - Veja o icone de um servidor\n${emoji_mc} **\`${prefix}mc\`** | **\`${prefix}mc diamante\`** - Exibe infos de um item do Minecraft\n:globe_with_meridians: **\`${prefix}svinfo\`** - Informações do servidor\n:label: **\`${prefix}usinfo\`** - Informações de um usuário\n:bookmark_tabs: **\`${prefix}cinfo\`** | **\`${prefix}cinfo #geral\`** - Informações de um canal\n\n:mag: | Veja exemplos de uso e informações de comandos com \`${prefix}\h calc\``);

            embed_jogos = new MessageEmbed()
            .setTitle('Comandos de Jogos :golf:')
            .setColor(0x29BB8E)
            .setDescription(`:scissors: **\`${prefix}jkp papel\`** | **\`${prefix}jkp\`** - Jokenpô\n:dragon_face: **\`${prefix}sjkp agua pedra arvore\`** - Super Jokenpô\n:coin: **\`${prefix}coin cara\`** | **\`${prefix}co coroa\`** - Teste sua sorte\n:game_die: **\`${prefix}dado\`** | **\`${prefix}da 10 16\`** - Roda um ou vários dados com várias faces\n${emoji_pula} **\`${prefix}pula\`** | **\`${prefix}predios\`** - Jogo do Pula Prédios!\n${emoji_steam} **\`${prefix}sus slondotk\`** - O perfil de alguém na steam\n:ballot_box: **\`${prefix}ch s t k\`** | **\`${prefix}ch [2 s t k\`** - Escolha uma ou várias opções\n:video_game: **\`${prefix}ngm <@cargo>\`** - Anúncios de jogos Gratuitos\n${emoji_mc} **\`${prefix}mc\`** | **\`${prefix}mc diamante\`** - Exibe infos de um item do Minecraft\n\n:mag: | Veja exemplos de uso e informações de comandos com \`${prefix}\h jkp\``);

            embed_manutencao = new MessageEmbed()
            .setTitle('Manutenção do Alonsal :tools:')
            .setColor(0x29BB8E)
            .setDescription(`:gear: **\`${prefix}rc\`** - Rank de comandos\n:information_source: **\`${prefix}info\`** - Informações do bot\n:computer: **\`${prefix}site\`** - O meu site com diversos comandos\n:envelope: **\`${prefix}mail <sua msg>\`** - Envie uma mensagem para o bot :P\n:love_letter: **\`${prefix}cvv\`** | **\`${prefix}convite\`** - Convide-me para um Servidor!\n${emoji_rainha} **\`${prefix}hub\`** | **\`${prefix}server\`** - Entre no Hub multiconectado do Alonsal\n${emoji_bolo} **\`${prefix}suporte\`** - Ajude a manter e desenvolver o Alonsal\n${bandeira_trad} **\`${prefix}lang en\`** | **\`${prefix}lang pt\`** - Altera o idioma do Alonsal\n\n:mag: | Veja exemplos de uso e informações de comandos com \`${prefix}\h lang\``);
        }else{ // Inglês

            bandeira_trad = ":flag_br:";

            embed_inicial = new MessageEmbed()
            .setTitle('Welcome to Help! :boomerang:')
            .setColor(0x29BB8E)
            .setDescription(`Use the numbers below to navigate between sections of Alonsais commands :stuck_out_tongue_winking_eye:\n\n:zany_face: **\`${prefix}h 1\`** - \`Funny Commands\`\n\n:compass: **\`${prefix}h 2\`** - \`Utility Commands\`\n\n:golf: **\`${prefix}h 3\`** - \`Game Commands\`\n\n:tools: **\`${prefix}h 4\`** - \`Alonsal Maintenance\`\n\n:scroll: **\`${prefix}hm\`** - \`Moderative Commands\`\n\n:satellite: **\`${prefix}tr h\`** - \`Work assistant\`\n\n:information_source: **\`${prefix}info\`** - \`My informations\`\n\n:mag: | See usage examples and command information with \`${prefix}\h >command<\`\n :hotsprings: | _Messages with this symbol are automatically deleted.._\n${bandeira_trad} | _Use o comando \`${prefix}lang pt\` para trocar para o \`português brasileiro\`_`);

            embed_diversao = new MessageEmbed()
            .setTitle('Funny Commands :zany_face:')
            .setColor(0x29BB8E)
            .setDescription(`:medal: **\`${prefix}rank\`** **\`${prefix}r <@>\`** - See the rank of the server or a user\n:cow: **\`${prefix}gado @Alonsal\`** | **\`${prefix}ga @Alonsal\`** - Test someone's livestock level\n:sparkling_heart: **\`${prefix}mor @Slondo @Alonsal\`** - Test the love between two people\n:raised_hands: **\`${prefix}baidu\`** - Praise be!\n:radio: **\`${prefix}rep 9?\`** - Alonsal will speak in TTS\n:nail_care: **\`${prefix}na slomdo\`** - Generate some anagrams\n:blue_book: **\`${prefix}curio\`** | **\`${prefix}c\`** - A random curiosity\n:black_joker: **\`${prefix}joke\`** | **\`${prefix}j\`** - Invoke a joke\n:black_nib: **\`${prefix}sans\`** - WrItE LiKe tHiS\n\n:mag: | See usage examples and command information with \`${prefix}\h curio\``);

            embed_utilitarios = new MessageEmbed()
            .setTitle('Utility Commands :compass:')
            .setColor(0x29BB8E)
            .setDescription(`:ping_pong: **\`${prefix}ping\`** | **\`${prefix}p\`** - Show your ping\n:symbols: **\`${prefix}m 8&7!\`** | **\`${prefix}m ---.. .-... --...\`** - Encodes and decodes morse\n:one: **\`${prefix}bn Alonso\`** | **\`${prefix}bn 11100011\`** - Encodes and decodes binary\n:arrow_backward: **\`${prefix}rev Alonso\`** - Reverse text characters\n:closed_lock_with_key: **\`${prefix}cr <key> <your_text>\`** | **\`${prefix}cr <key> <crypto>\`** - Encrypted text\n:lock_with_ink_pen: **\`${prefix}psw 15\`** - Generate passwords\n:abacus: **\`${prefix}calc 2 - 1\`** - Calculator\n:mag: **\`${prefix}wiki Alonso\`** | **\`${prefix}w Alonso\`** - Search on wikipedia\n:white_sun_small_cloud: **\`${prefix}t\`** | **\`${prefix}weather los angeles\`** - Current weather somewhere\n:classical_building: **\`${prefix}con\`** | **\`${prefix}con 01-21\`** - An event on a date\n${emoji_dancando} **\`${prefix}moji <emoji>\`** - Increase emoji size\n${emoji_steam} **\`${prefix}sus slondotk\`** - Someone's steam profile\n:pencil: **\`${prefix}rm o slomdo\` | \`${prefix}rp o i slomdo\`** - Remove or replace characters\n:bust_in_silhouette: **\`${prefix}vatar\`** | **\`${prefix}vatar <@>\`** - View your avatar or another user's\n:busts_in_silhouette: **\`${prefix}icon\`** - See a server icon\n${emoji_mc} **\`${prefix}mc\`** | **\`${prefix}mc diamond\`** - Display info for a Minecraft item\n:globe_with_meridians: **\`${prefix}svinfo\`** - Server information\n:label: **\`${prefix}usinfo\`** - User Information\n:bookmark_tabs: **\`${prefix}cinfo\`** | **\`${prefix}cinfo #main\`** - Channel information\n\n:mag: | See usage examples and command information with \`${prefix}\h weather\``);

            embed_jogos = new MessageEmbed()
            .setTitle('Game Commands :golf:')
            .setColor(0x29BB8E)
            .setDescription(`:scissors: **\`${prefix}jkp paper\`** | **\`${prefix}jkp\`** - Jokenpo\n:dragon_face: **\`${prefix}sjkp water rock tree\`** - Super Jokenpo\n:coin: **\`${prefix}coin tails\`** | **\`${prefix}co heads\`** - Test your luck\n:game_die: **\`${prefix}dice\`** | **\`${prefix}di 10 16\`** - Roll one or more dice with multiple faces\n${emoji_pula} **\`${prefix}pula\`** | **\`${prefix}predios\`** - Pula Buildings Game!\n${emoji_steam} **\`${prefix}sus slondotk\`** - Someone's steam profile\n:ballot_box: **\`${prefix}ch s t k\`** | **\`${prefix}ch [2 s t k\`** - Choose one or several options\n:video_game: **\`${prefix}ngm <@tag>\`** - Free game notifications\n${emoji_mc} **\`${prefix}mc\`** | **\`${prefix}mc diamond\`** - Display info for a Minecraft item\n\n:mag: | See usage examples and command information with \`${prefix}\h ngm\``);

            embed_manutencao = new MessageEmbed()
            .setTitle('Alonsal Maintenance :tools:')
            .setColor(0x29BB8E)
            .setDescription(`:gear: **\`${prefix}rc\`** - Command ranking\n:information_source: **\`${prefix}info\`** - My informations\n:computer: **\`${prefix}site\`** - My website with several commands\n:envelope: **\`${prefix}mail <sua msg>\`** - Send a message to me! :P\n:love_letter: **\`${prefix}cvv\`** | **\`${prefix}convite\`** - Invite me to a server!\n${emoji_rainha} **\`${prefix}hub\`** | **\`${prefix}server\`** - Enter Alonsal's Multiconnected Hub\n${emoji_bolo} **\`${prefix}suporte\`** - Help maintain and develop the Alonsal\n${bandeira_trad} **\`${prefix}lang en\`** | **\`${prefix}lang pt\`** - Change Alonsal's language\n\n:mag: | See usage examples and command information with \`${prefix}\h language\``);
        }

        const pages = [
            embed_inicial,
            embed_diversao,
            embed_utilitarios,
            embed_jogos,
            embed_manutencao
        ];
        
        if(args.length < 1)
            return message.reply({ embeds: [embed_inicial] });

        if(isNaN(parseInt(args[0].raw)) || (parseInt(args[0].raw) < 0 || parseInt(args[0].raw) > 4))
            return message.reply(":warning: | "+ manutencao[7]["aviso_1"]);

        message.reply({ embeds: [pages[parseInt(args[0].raw)]] });
    }
};