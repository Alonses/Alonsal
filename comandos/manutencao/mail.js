const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mail')
        .setDescription('⌠📡⌡ Send messages to Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Envie mensagens para o Alonsal',
            "es-ES": '⌠📡⌡ Enviar mensajes a Alonsal',
            "fr": '⌠📡⌡ Envoyer des messages à Alonsal'
        })
        .addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "es-ES": 'texto',
                    "fr": 'texte'
                })
                .setDescription('Report bugs or give suggestions!')
                .setDescriptionLocalizations({
                    "pt-BR": 'Reporte bugs ou dê sugestões!',
                    "es-ES": '¡Informar de errores o dar sugerencias!',
                    "fr": 'Signalez des bugs ou faites des suggestions !'
                })
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
                .setNameLocalizations({
                    "pt-BR": 'arquivo',
                    "es-ES": 'archivo',
                    "fr": 'dossier'
                })
                .setDescription('Attach files if needed')
                .setDescriptionLocalizations({
                    "pt-BR": 'Anexe arquivos se precisar',
                    "es-ES": 'Adjunte archivos si es necesario',
                    "fr": 'Joindre des fichiers si besoin'
                })),
    async execute(client, interaction) {

        const corpo_mensagem = {
            texto: null,
            arquivo: null,
        }

        let entradas = interaction.options.data

        entradas.forEach(valor => {
            if (valor.name == "text")
                corpo_mensagem.texto = valor.value

            if (valor.name == "file")
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

        client.tls.reply(client, interaction, "manu.mail.sucesso_1", true)

        client.channels.cache.get("847191471379578970").send({ embeds: [msg_user] })
    }
}