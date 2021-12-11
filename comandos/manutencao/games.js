const { MessageAttachment, MessageEmbed } = require('discord.js');
const { canal_games } = require('../../arquivos/data/games/canal_games.json');
const formata_anun = require('../../adm/funcoes/formatagames.js');

const platformMap = {
    "epicgames.com": [ "<:Logo_ep:864887054067957791>", "Epic" ],
    "store.steam": [ "<:Logo_st:864887020467257364>", "Steam" ],
    "gog.com": [ "<:Logo_gog:864887080673214505>", "GOG" ],
    "humblebundle.com": [ "<:Logo_hb:864887252587642911>", "Humble Bundle" ],
    "ubisoft.com": [ "<:Logo_ubi:864887154483134516>\n", "Ubisoft" ]
}

module.exports = {
    name: "mail_games",
    description: "Envie atualizações de jogos",
    aliases: [ "mailgame", "mg" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        if(message.author.id !== "665002572926681128") return;

        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const canais_clientes = [];

        let tipo_anun = "";
        percorrer(canal_games);

        function percorrer(obj) { // Coleta os valores de canais e cargos
            for (const propriedade in obj) {
                if (obj.hasOwnProperty(propriedade)) {
                    if (typeof obj[propriedade] == "object") {
                        percorrer(obj[propriedade]);
                    } else {
                        canais_clientes.push(obj[propriedade]);
                    }
                }
            }
        }

        if(typeof args[0] === "undefined" || args.length < 1){
            const embed_fomatacao = new MessageEmbed()
            .setTitle("Notificações de Games & DLC's")
            .setColor(0x29BB8E)
            .setDescription(`:one: Game - \`${prefix}mg <nome_jogo> 21/01 50,00 <url> <img_anexo>\`\n:two: Games - \`${prefix}mg <nome_jogo> 21/01 50,00 <url> <nome_jogo> 50,00 <url> <img_anexo>\`\n:cloud_tornado: DLC - \`${prefix}mg dlc <nome_dlc> 21/01 50,00 <url> <img_anexo>\`\n:rotating_light: Anúncio urgente - \`${prefix}mg u <nome_jogo> 21/01 50,00 <url> <img_anexo>\`\n:placard: Canais clientes - \`${prefix}mg list\``);
            
            return message.reply({embeds: [embed_fomatacao]});
        }

        if(args[0].raw === "list"){
            let nome_canais = "";

            if(canais_clientes.length === 0)
                return message.reply(":octagonal_sign: Sem canais clientes");
            
            for(let i = 0; i < canais_clientes.length; i++){
                try{
                    const nome_canal = await client.channels.cache.get(canais_clientes[i]);

                    if(nome_canal !== undefined)
                        nome_canais += `\n:globe_with_meridians: \`${nome_canal.guild.name}\` -> :placard: \`${nome_canal.name}\``;
                }catch(err){
                    message.reply(`Não foi posível buscar os dados do canal :: \`${canais_clientes[i]}\``);
                }
            }

            nome_canais = nome_canais.substr(0, 1950);

            return message.reply(`Canais clientes: \`${canais_clientes.length/2}\`\n\nCanais: ${nome_canais}`);
        }

        if(args[0].raw === "u" || args[0].raw === "dlc"){
            tipo_anun = args[0].raw;
            args.shift();
        }

        if(args.length < 4)
            return message.reply(`Informe pelo menos como \`${prefix}mg <nome_jogo> 21/01 50,00 <url> <img_anexo>\`\nOu utilize o comando\`${prefix}mg h\` para ver os aliases deste comando`);

        const nome_jogo = args[0].raw.replaceAll("_", " ");

        const matches = args[3].raw.match(/epicgames.com|store.steam|gog.com|humblebundle.com|ubisoft.com/);

        const plataforma = platformMap[matches[0]][1];
        const logo_plat = platformMap[matches[0]][0];
        let url = "";

        if(message.attachments.size === 1){
            message.attachments.forEach(attachment => {
                url = attachment.url;
            });
        }else
            return message.reply(":hotsprings: | Envie uma imagem junto do comando para utilizar de banner").then(msg => setTimeout(() => msg.delete(), 3000));

        // Soma o valor dos jogos anunciados
        let valor_total = parseFloat((args[2].raw).replace(",", "."));

        if(args.length > 4)
            valor_total += parseFloat((args[5].raw).replace(",", "."));

        const img_game = new MessageAttachment(url);

        valor_total = valor_total.toFixed(2);
        let canais_recebidos = 0;

        for (let i = 0; i < canais_clientes.length; i++) { // Envia a mensagem para vários canais clientes
            try {
                let nome_jogo_2 = "";
                const link_1 = args[3].raw;
                let link_2 = "";

                if(typeof args[4] !== "undefined"){
                    nome_jogo_2 = args[4].raw.replaceAll("_", " ");
                    link_2 = args[6];
                }

                let servidor = await client.channels.cache.get(canais_clientes[i]);
                servidor = servidor.guild.id;

                const lang_server = await client.idioma.getLang(message.guild.id);
                let texto_anuncio = formata_anun(tipo_anun, nome_jogo, nome_jogo_2, args[1].raw, valor_total, logo_plat, plataforma, canais_clientes, i, lang_server);
                
                if(typeof canais_clientes[i + 1] !== "undefined")
                    texto_anuncio += ` <@&${canais_clientes[i + 1]}>`;

                if(link_2 !== "")
                    texto_anuncio += `\n${nome_jogo} << <${link_1}> >>\n\n${nome_jogo_2} << <${link_2}> >>`;
                else
                    texto_anuncio += `\n<< <${link_1}> >>`;

                const canal_alvo = client.channels.cache.get(canais_clientes[i]);

                if(canal_alvo.type === "GUILD_TEXT" || canal_alvo.type === "GUILD_NEWS"){
                    const permissions = canal_alvo.permissionsFor(client.user);
            
                    if(permissions.has("SEND_MESSAGES")){
                        canal_alvo.send({content: texto_anuncio, files: [img_game]}); // Permissão para enviar mensagens no canal
                    
                        canais_recebidos++;
                    }
                }
            }catch(err){
                const embed = new MessageEmbed({
                    title: ":video_game: | CeiraException",
                    description: `\`\`\`Canal/Servidores desconhecidos, considere apagar este campo >>manualmente<< :: ${canais_clientes[i]} :)\n${err.toString().substring(0, 2000)}\`\`\``,
                    color: "RED"
                });
                
                client.channels.cache.get('862015290433994752').send({ embeds: [embed] });
            }

            i++;
        }
        
        let aviso = `:white_check_mark: | Aviso de Jogo gratuito enviado para \`${canais_recebidos}\` canais clientes`;

        if(canais_recebidos === 1)
            aviso = `:white_check_mark: | Aviso de Jogo gratuito enviado para \`${canais_recebidos}\` canal cliente`;

        client.channels.cache.get('872865396200452127').send(aviso);
        const mensagem = await message.reply("A atualização foi enviada à todos os canais de games");

        setTimeout(() => {
            mensagem.delete();
            message.delete();
        }, 5000);
    }
}