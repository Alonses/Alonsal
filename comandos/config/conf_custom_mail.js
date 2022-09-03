const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('c_mail')
		.setDescription('⌠✳️⌡ Enviar mensagem em canal especifico')
        .addStringOption(option =>
            option.setName('texto')
            .setDescription("O texto a ser enviado")
            .setRequired(true))
        .addStringOption(option => 
            option.setName('canal')
            .setDescription("O canal alvo")
            .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('imagem')
            .setDescription("A imagem que será usada")),
    async execute(client, interaction) {
        
        if (interaction.user.id !== "665002572926681128") return
        
        let entradas = interaction.options.data

        const corpo_mail = {
            texto: null,
            canal: null,
            anexo: null
        }

        entradas.forEach(valor => {
            if (valor.name == "texto")
                corpo_mail.texto = valor.value

            if (valor.name == "canal")   
                corpo_mail.canal = valor.value
            
            if (valor.name == "imagem")
                corpo_mail.anexo = valor.attachment.attachment
        })

        let img_game
        const nome_canal = await client.channels.cache.get(corpo_mail.canal)

        if (nome_canal) {
            if (corpo_mail.anexo) {
                img_game = new AttachmentBuilder(corpo_mail.anexo)
                client.channels.cache.get(corpo_mail.canal).send({content: corpo_mail.texto, files: [img_game]})
            } else
                client.channels.cache.get(corpo_mail.canal).send({content: corpo_mail.texto})

            interaction.reply({content: `Mensagem enviada para o canal ${nome_canal} com sucesso`, ephemeral: true })
        } else
            interaction.reply({content: `:octagonal_sign: | O canal mencionado é desconhecido, tente novamente`, ephemeral: true })
    }
}