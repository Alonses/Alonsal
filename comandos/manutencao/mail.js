const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mail')
		.setDescription('⌠📡⌡ Send messages to Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Envie mensagens para o Alonsal',
            "fr": '⌠📡⌡ Envoyer des messages à Alonsal'
        })
        .addStringOption(option =>
            option.setName('text')
            .setNameLocalizations({
                "pt-BR": 'texto',
                "fr": 'text'
            })
            .setDescription('Report bugs or give suggestions!')
            .setDescriptionLocalizations({
                "pt-BR": 'Reporte bugs ou dê sugestões!',
                "fr": 'Signalez des bugs ou faites des suggestions !'
            })
            .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
            .setNameLocalizations({
                "pt-BR": 'arquivo',
                "fr": 'dossier'
            })
            .setDescription('Attach files if needed')
            .setDescriptionLocalizations({
                "pt-BR": 'Anexe arquivos se precisar',
                "fr": 'Joindre des fichiers si besoin'
            })),
    async execute(client, interaction) {
        
        const { manutencao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        const corpo_mensagem = {
            texto: null,
            arquivo: null,
        }
        
        let entradas = interaction.options.data
        const ent_texto = ["texto", "text"], ent_arquivo = ["arquivo", "file", "dossier"]

        entradas.forEach(valor => {
            if (ent_texto.includes(valor.name))
                corpo_mensagem.texto = valor.value

            if (ent_arquivo.includes(valor.name))
                corpo_mensagem.arquivo = valor.attachment.attachment
        })

        const msg_user = new EmbedBuilder()
        .setTitle("> :mailbox_with_mail: New Message")
        .setDescription(`-----------------------\nSent by \`${interaction.user.id}\`\n\n Message: \`${corpo_mensagem.texto.replaceAll("`", "'")}\``)
        .setFooter({ text: `Author: ${interaction.user.username}` })
        .setColor(0xffffff)
        .setTimestamp()
        
        if (corpo_mensagem.arquivo)
            msg_user.setImage(corpo_mensagem.arquivo)

        interaction.reply({ content: manutencao[3]["sucesso_1"], ephemeral: true})

        client.channels.cache.get("847191471379578970").send({ embeds: [msg_user] })
    }
}