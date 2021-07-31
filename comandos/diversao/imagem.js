const { DiscordAPIError } = require('discord.js');

module.exports = {
    name: "imagem",
    description: "Edite imagens através de comandos",
    aliases: [ "img", "edit", "dit" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
  
        const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

        let emoji_carregando = client.emojis.cache.get(emojis.loading2).toString();
        let emoji_dancante = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        if(message.attachments.size < 1){
            message.lineReply(':warning: | Insira uma imagem junto do comando para poder editar ela');
            return;
        }

        if(args.length < 1){
            message.lineReply(':warning: | Insira um estilo de edição para sua imagem\nPor exemplo, `.adit bw <imagem>`');
            return;
        }

        if(args[0] == "bw"){
            message.lineReply(emoji_carregando + ' | Aguarde um momento enquanto processo seus arquivos...');

            const Discord = require('discord.js');
            const Canvas = require('canvas');

            message.attachments.forEach(async attachment => {
                url = attachment.url;
                height = attachment.height;
                width = attachment.width;

                if(height == 4000 && width == 1894){
                    let inverte = width;
                    width = height;
                    height = inverte;
                }

                const canvas = Canvas.createCanvas(width, height);
                const context = canvas.getContext('2d');

                const background = await Canvas.loadImage(url);

                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                
                let imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
                let pixels = imgData.data;
                for (var i = 0; i < pixels.length; i += 4) {

                    let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

                    pixels[i] = lightness;
                    pixels[i + 1] = lightness;
                    pixels[i + 2] = lightness;
                }

                context.putImageData(imgData, 0, 0);

                const imagem_editada = new Discord.MessageAttachment(canvas.toBuffer(), 'new_image.png');

                message.lineReply('', imagem_editada);
            });
        }else
            message.lineReply(':mag: | Este efeito não existe! Sugira efeitos para o Alonsal usando o `.amail <seu_efeito_top>`'+ emoji_dancante +'` `');
    }
};