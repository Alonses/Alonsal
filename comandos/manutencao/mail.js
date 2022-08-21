const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mail')
		.setDescription('⌠📡⌡ Envie mensagens para o Alonsal')
        .addStringOption(option =>
            option.setName('texto')
            .setDescription('Reporte bugs ou dê sugestões!')
            .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('arquivo')
            .setDescription('Anexe arquivos se precisar')),
    async execute(client, interaction) {
        
        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`);

        const corpo_mensagem = {
            texto: null,
            arquivo: null,
        }
        
        let entradas = interaction.options.data

        entradas.forEach(valor => {

            if(valor.name == "texto")
                corpo_mensagem.texto = valor.value

            if(valor.name == "arquivo")
                corpo_mensagem.arquivo = valor.attachment.attachment
        })

        const msg_user = new EmbedBuilder()
        .setTitle("> :mailbox_with_mail: New Message")
        .setDescription(`-----------------------\nSent by \`${interaction.user.id}\`\n\n Message: \`${corpo_mensagem.texto.replaceAll("`", "'")}\``)
        .setFooter({ text: `Author: ${interaction.user.username}` })
        .setColor(0xffffff)
        .setTimestamp()
        
        if(corpo_mensagem.arquivo)
            msg_user.setImage(corpo_mensagem.arquivo)

        interaction.reply({ content: manutencao[3]["sucesso_1"], ephemeral: true})

        client.channels.cache.get("847191471379578970").send({ embeds: [msg_user] })
    }
}