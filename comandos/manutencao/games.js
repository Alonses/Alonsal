const { MessageAttachment } = require('discord.js');

module.exports = {
    name: "mail_games",
    description: "Envie atualizações de jogos",
    aliases: [ "mailgame", "mg" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        if(message.author.id !== "665002572926681128") return;

        const { idioma_servers } = require('../../arquivos/json/dados/idioma_servers.json');
        const { canal_games } = require('../../arquivos/json/dados/canal_games.json');

        let prefix = client.prefixManager.getPrefix(message.guild.id);

        if(args.length < 4 || args.length > 7)
            return message.reply("Informe como `"+ prefix +"mg <nome_jogo> 21/01 50,00 <url> <img_anexo>`\nOu, `"+ prefix +"mg <nome_jogo> 21/01 50,00 <url> <nome_jogo> 50,00 <url> <img_anexo>`");
        
        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }
        
        const { emojis } = require('../../arquivos/json/text/emojis.json');

        let nome_jogo = args[0].replaceAll("_", " ");

        let plataforma = "";
        let logo_plat = "";
        let url = "";

        if(message.attachments.size === 1){
            message.attachments.forEach(attachment => {
                url = attachment.url;
            });
        }else
            return message.reply(":hotsprings: | Envie uma imagem junto do comando para utilizar de banner").then(message => message.delete({timeout: 3000}));
        
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

        var resultado = [];

        function percorrer(obj) { // Coleta os valores de canais e cargos
            for (var propriedade in obj) {
                if (obj.hasOwnProperty(propriedade)) {
                    if (typeof obj[propriedade] == "object") {
                        percorrer(obj[propriedade]);
                    } else {
                        resultado.push(obj[propriedade]);
                    }
                }
            }
        }

        percorrer(canal_games); // Organiza todos os canais clientes
        
        for(let i = 0; i < resultado.length; i++){ // Envia a mensagem para vários canais clientes
            
            let servidor = client.channels.cache.get(resultado[i]);
            servidor = servidor.guild.id;
            let idioma_definido = idioma_servers[servidor];

            let texto_anuncio = "( "+ logo_plat +" ) O Game _`"+ nome_jogo +"`_ está gratuito até o dia `"+ args[1] +"` por lá\n\nResgate ele antes da data para poupar `R$"+ valor_total +"` e garantir uma cópia em sua conta "+ plataforma +" <@&"+ resultado[i + 1] +">\n<< <"+ args[3] +"> >>";

            if(idioma_definido === "en-us")
                texto_anuncio = "( "+ logo_plat +" ) The Game _`"+ nome_jogo +"`_ it's free until the day `"+ args[1] +"` over there\n\nRedeem it before date to save `R$"+ valor_total +"` and get a copy in your "+ plataforma +" account <@&"+ resultado[i + 1] +">\n<< <"+ args[3] +"> >>";

            if(args.length > 4){
                let nome_jogo_2 = args[4].replaceAll("_", " ");

                texto_anuncio = "( "+ logo_plat +" ) Os Games _`"+ nome_jogo +"`_ & _`"+ nome_jogo_2 +"`_ estão gratuitos até o dia `"+ args[1] +"` por lá\n\nResgate ambos antes da data para poupar `R$"+ valor_total +"` e garantir uma cópia em sua conta "+ plataforma;

                if(idioma_definido === "en-us")
                    texto_anuncio = "( "+ logo_plat +" ) The Games _`"+ nome_jogo +"`_ & _`"+ nome_jogo_2 +"`_ are free until the day `"+ args[1] +"` over there\n\nRedeem both before date to save `R$"+ valor_total +"` and get a copy in your "+ plataforma +" account";

                if(typeof resultado[i + 1] !== "undefined")
                    texto_anuncio += " <@&"+ resultado[i + 1] +">";

                if(typeof args[6] !== "undefined")
                    texto_anuncio += "\n"+ nome_jogo +" << <"+ args[3] +"> >>\n\n"+ nome_jogo_2 +" << <"+ args[6] +"> >>";
                else
                    texto_anuncio += "\n<< <"+ args[3] +"> >>";
            }

            let canal_alvo = client.channels.cache.get(resultado[i]);

            if(canal_alvo.type === "GUILD_TEXT"){
                const permissions = canal_alvo.permissionsFor(client.user);
        
                if(permissions.has("SEND_MESSAGES")) 
                    canal_alvo.send({content: texto_anuncio}); // Permissão para enviar mensagens no canal
            }

            i++;
        };
        
        let aviso = ":white_check_mark: | Aviso de Jogo gratuito enviado para `"+ resultado.length/2 +"` canais clientes";

        if(resultado.length/2 == 1)
            aviso = ":white_check_mark: | Aviso de Jogo gratuito enviado para `"+ resultado.length/2 +"` canal cliente";

        client.channels.cache.get('872865396200452127').send(aviso);
        const mensagem = await message.reply("A atualização foi enviada à todos os canais de games");

        setTimeout(() => {
            mensagem.delete();
            message.delete();
        }, 5000);
    }
}