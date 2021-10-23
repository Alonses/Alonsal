const { MessageAttachment } = require('discord.js');

module.exports = {
    name: "mail_games",
    description: "Envie atualizações de jogos",
    aliases: [ "mailgame", "mg" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        if(!client.owners.includes(message.author.id)) return;

        const lang = client.idioma.getLang(message.guild.id);
        const { emojis } = require('../../arquivos/json/text/emojis.json');
        const { canal_games } = require('../../arquivos/data/games/canal_games.json');

        let canais_clientes = [];
        percorrer(canal_games);

        if(args[0] === "list"){

            let nome_canais = "";

            if(canais_clientes.length == 0)
                return message.reply(":octagonal_sign: Sem canais clientes");
            
            for(let i = 0; i < canais_clientes.length; i++){
                let nome_canal = await client.channels.cache.get(canais_clientes[i]);

                if(nome_canal !== undefined)
                    nome_canais += "\n`" + nome_canal.name + "` | `" + nome_canal.guild.name + "`";
            }

            nome_canais = nome_canais.substr(0, 1950);

            return message.reply("Canais clientes: `" + canais_clientes.length/2 + "`\n\nCanais: "+ nome_canais);
        }

        let prefix = client.prefixManager.getPrefix(message.guild.id);

        if(args.length < 4 || args.length > 7)
            return message.reply("Informe como `"+ prefix +"mg <nome_jogo> 21/01 50,00 <url> <img_anexo>`\nOu, `"+ prefix +"mg <nome_jogo> 21/01 50,00 <url> <nome_jogo> 50,00 <url> <img_anexo>`");
        
        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }
        
        let nome_jogo = args[0].replaceAll("_", " ");

        let plataforma = "";
        let logo_plat = "";
        let url = "";

        if(message.attachments.size === 1){
            message.attachments.forEach(attachment => {
                url = attachment.url;
            });
        }else
            return message.reply(":hotsprings: | Envie uma imagem junto do comando para utilizar de banner").then(msg => setTimeout(() => msg.delete(), 3000));
        
        if(args[3].includes("epicgames.com")){
            logo_plat = emoji(emojis.lg_epicgames);
            plataforma = "Epic";
        }

        if(args[3].includes("store.steam")){
            logo_plat = emoji(emojis.lg_steam);
            plataforma = "Steam";
        }

        if(args[3].includes("gog.com")){
            logo_plat = emoji(emojis.lg_gog);
            plataforma = "GOG";
        }

        if(args[3].includes("humblebundle.com")){
            logo_plat = emoji(emojis.lg_humble);
            plataforma = "Humble Bundle";
        }

        if(args[3].includes("ubisoft.com")){
            logo_plat = emoji(emojis.lg_ubisoft);
            plataforma = "Ubisoft";
        }

        // Soma o valor dos jogos anunciados
        let valor_total = parseFloat((args[2]).replace(",", "."));

        if(args.length > 4)
            valor_total += parseFloat((args[5]).replace(",", "."));
        
        let img_game = new MessageAttachment(url);
        
        valor_total = valor_total.toFixed(2);

        function percorrer(obj) { // Coleta os valores de canais e cargos
            for (var propriedade in obj) {
                if (obj.hasOwnProperty(propriedade)) {
                    if (typeof obj[propriedade] == "object") {
                        percorrer(obj[propriedade]);
                    } else {
                        canais_clientes.push(obj[propriedade]);
                    }
                }
            }
        }

        for(let i = 0; i < canais_clientes.length; i++){ // Envia a mensagem para vários canais clientes
            
            let servidor = client.channels.cache.get(canais_clientes[i]);
            servidor = servidor.guild.id;

            let texto_anuncio = "( "+ logo_plat +" ) O Game _`"+ nome_jogo +"`_ está gratuito até o dia `"+ args[1] +"` por lá\n\nResgate ele antes da data para poupar `R$"+ valor_total +"` e garantir uma cópia em sua conta "+ plataforma +"\n<< <"+ args[3] +"> >>";

            if(lang === "en-us")
                texto_anuncio = "( "+ logo_plat +" ) The Game _`"+ nome_jogo +"`_ it's free until the day `"+ args[1] +"` over there\n\nRedeem it before date to save `R$"+ valor_total +"` and get a copy in your "+ plataforma +" account\n<< <"+ args[3] +"> >>";

            if(args.length > 4){
                let nome_jogo_2 = args[4].replaceAll("_", " ");

                texto_anuncio = "( "+ logo_plat +" ) Os Games _`"+ nome_jogo +"`_ & _`"+ nome_jogo_2 +"`_ estão gratuitos até o dia `"+ args[1] +"` por lá\n\nResgate ambos antes da data para poupar `R$"+ valor_total +"` e garantir uma cópia em sua conta "+ plataforma;

                if(lang === "en-us")
                    texto_anuncio = "( "+ logo_plat +" ) The Games _`"+ nome_jogo +"`_ & _`"+ nome_jogo_2 +"`_ are free until the day `"+ args[1] +"` over there\n\nRedeem both before date to save `R$"+ valor_total +"` and get a copy in your "+ plataforma +" account";

                // if(typeof canais_clientes[i + 1] !== "undefined")
                    // texto_anuncio += " <@&"+ canais_clientes[i + 1] +">";

                if(typeof args[6] !== "undefined")
                    texto_anuncio += "\n"+ nome_jogo +" << <"+ args[3] +"> >>\n\n"+ nome_jogo_2 +" << <"+ args[6] +"> >>";
                else
                    texto_anuncio += "\n<< <"+ args[3] +"> >>";
            }

            let canal_alvo = client.channels.cache.get(canais_clientes[i]);

            if(canal_alvo.type === "GUILD_TEXT"){
                const permissions = canal_alvo.permissionsFor(client.user);
        
                if(permissions.has("SEND_MESSAGES")) 
                    await canal_alvo.send({content: texto_anuncio, files: [img_game]}); // Permissão para enviar mensagens no canal
            }

            i++;
        }
        
        let aviso = ":white_check_mark: | Aviso de Jogo gratuito enviado para `"+ canais_clientes.length/2 +"` canais clientes";

        if(canais_clientes.length === 2)
            aviso = ":white_check_mark: | Aviso de Jogo gratuito enviado para `"+ canais_clientes.length/2 +"` canal cliente";

        client.channels.cache.get('872865396200452127').send(aviso);
        const mensagem = await message.reply("A atualização foi enviada à todos os canais de games");

        setTimeout(() => {
            mensagem.delete();
            message.delete();
        }, 5000);
    }
}