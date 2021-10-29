const { createWorker } = require('tesseract.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ocr",
    description: "converte o texto de uma imagem em string",
    aliases: [ "" ],
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args){

        return;
        
        if(message.attachments.size != 1) return message.reply(":warning: | Inclua uma imagem junto do comando");

        let imagem = message.attachments.first();
        imagem = imagem.url;
        
        const worker = createWorker();

        await worker.load();
        await worker.loadLanguage('por');
        await worker.initialize('por');
        const { data: { text } } = await worker.recognize(imagem);
        
        const texto_formatado = new MessageEmbed()
        .setTitle("> :newspaper2: Seu OCR")
        .setColor(0x29BB8E)
        .setDescription(`\`${text}\``)

        message.reply({ embeds: [texto_formatado] });
        await worker.terminate();
    }
}