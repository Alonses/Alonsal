module.exports = {
    name: "imagem",
    description: "Edite imagens através de comandos",
    aliases: [ "img", "edit", "dit", "i", "ih" ],
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {
  
        const Discord = require('discord.js');
        const Canvas = require('canvas');

        const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json');

        let emoji_carregando = client.emojis.cache.get(emojis.loading2).toString();
        let emoji_dancante = client.emojis.cache.get(emojis_dancantes[Math.round((emojis_dancantes.length - 1) * Math.random())]).toString();

        if(message.content == ".aih"){

            const embed_imagens = new Discord.MessageEmbed()
            .setTitle('Manipulação de Ibagens :frame_photo:')
            .setColor(0x29BB8E)
            .setThumbnail("https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/34582820_1731681436946171_4012652554398728192_n.png?_nc_cat=103&ccb=1-3&_nc_sid=973b4a&_nc_ohc=2pQUpS4JYesAX-tblT6&_nc_ht=scontent-gru1-2.xx&oh=cd477beb31450446556e04001525ece6&oe=60D1FE58")
            .setDescription(":white_square_button: **`.aimg bw <img>`** | **`.ai bw <img>`** - Torna uma ou várias imagens preta e branca\n\n"+ emoji_dancante +" | Sugira efeitos tops para o Alonsal usando o `.amail <seu_efeito_top>` !")
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
            
            message.lineReply(embed_imagens);
            return; 
        }

        if(message.attachments.size < 1){
            message.lineReply(':warning: | Insira uma imagem junto do comando e seu efeito para poder editar ela\nPor exemplo, `.ai bw <img>`\n\nVocê pode ver todos os estilos usando o comando `.aih`');
            return;
        }

        if(args.length < 1){
            message.lineReply(':warning: | Insira um estilo de edição para sua imagem\nPor exemplo, `.adit bw <imagem>`');
            return;
        }

        message.attachments.forEach(async attachment => {
            url = attachment.url;
            height = attachment.height;
            width = attachment.width;
            
            message.lineReply(emoji_carregando + ' | Aguarde um momento enquanto processo seus arquivos...');

            if(args[0] == "bw"){
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

            }else
                message.lineReply(':mag: | Este efeito não existe! Sugira efeitos para o Alonsal usando o `.amail <seu_efeito_top>`'+ emoji_dancante +'` `');
        });
    }
};