const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mail")
        .setDescription("⌠📡⌡ Send messages to me!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Envie mensagens para mim!',
            "es-ES": '⌠📡⌡ ¡Envíeme un mensaje!',
            "fr": '⌠📡⌡ Envoyez-moi un message!',
            "it": '⌠📡⌡ Mandami un messaggio!',
            "ru": '⌠📡⌡ Пишите мне!'
        })
        .addStringOption(option =>
            option.setName("text")
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "es-ES": 'texto',
                    "fr": 'texte',
                    "it": 'testo',
                    "ru": 'текст'
                })
                .setDescription("Report bugs or give suggestions!")
                .setDescriptionLocalizations({
                    "pt-BR": 'Reporte bugs ou dê sugestões!',
                    "es-ES": '¡Informar de errores o dar sugerencias!',
                    "fr": 'Signalez des bugs ou faites des suggestions!',
                    "it": 'Segnala bug o dai suggerimenti!',
                    "ru": 'Сообщайте об ошибках или делайте предложения!'
                })
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName("file")
                .setNameLocalizations({
                    "pt-BR": 'arquivo',
                    "es-ES": 'archivo',
                    "fr": 'dossier',
                    "it": 'file',
                    "ru": 'архив'
                })
                .setDescription("Attach files if needed")
                .setDescriptionLocalizations({
                    "pt-BR": 'Anexe arquivos se precisar',
                    "es-ES": 'Adjunte archivos si es necesario',
                    "fr": 'Joindre des fichiers si besoin',
                    "it": 'Allega file se necessario',
                    "ru": 'Прикрепите файлы, если необходимо'
                })),
    async execute(client, user, interaction) {

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
            .setTitle("> :mailbox_with_mail: Nova mensagem!")
            .setDescription(`-----------------------\nEnviado por \`${interaction.user.id}\`\n\n Mensagem: \`${corpo_mensagem.texto.replaceAll("`", "'")}\``)
            .setFooter({ text: `Autor: ${interaction.user.username}` })
            .setColor(0xffffff)
            .setTimestamp()

        if (corpo_mensagem.arquivo)
            msg_user.setImage(corpo_mensagem.arquivo)

        client.tls.reply(interaction, user, "manu.mail.sucesso_1", true)

        client.notify(process.env.mail_channel, msg_user)
    }
}