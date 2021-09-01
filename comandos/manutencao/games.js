module.exports = {
    name: "mail_games",
    description: "Envie atualizações de jogos",
    aliases: [ "mg" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const { MessageAttachment } = require('discord.js');
        
        if(message.author.id != "852589532993683467" && message.author.id != "665002572926681128")
            return;

        if(args.length != 4){
            message.lineReply("Informe como `.amg <nome_jogo> 21/01 R$50,00 <url> <img_anexo>`");
            return;
        }
        
        function emoji(id){
            return client.emojis.cache.get(id).toString();
        }

        const { ids_canais_games, ids_cargos_games } = require('../../config.json');
        const { emojis } = require('../../arquivos/json/text/emojis.json');

        let plataforma = "";
        let logo_plat = "";
        let url = "";

        if(message.attachments.size == 1){
            message.attachments.forEach(attachment => {
                url = attachment.url;
            });
        }
        
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

        let img_game = new MessageAttachment(url);

        for(let i = 0; i < ids_canais_games.length; i++){
            client.channels.cache.get(ids_canais_games[i]).send("( "+ logo_plat +" ) O Game _`"+ args[0] +"`_ está gratuito até o dia `"+ args[1] +"` por lá\n\nResgate ele antes da data para poupar `"+ args[2] +"` e garantir uma cópia em sua conta "+ plataforma +" <@&"+ ids_cargos_games[i] +">\n<< "+ args[3] +" >>", img_game);
        }
        
        message.lineReply("A atualização foi enviada à todos os canais de games");
    }
}