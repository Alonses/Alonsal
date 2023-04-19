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
            text: interaction.options.getString("text"),
            file: interaction.options.getAttachment("file"),
        }

        let conteudo_texto = ""

        if (corpo_mensagem.file) {

            conteudo_texto = `[Clique aqui](${corpo_mensagem.file.attachment}) para baixar o arquivo`

            // Verificando se o anexo é um arquivo de texto
            if (corpo_mensagem.file.contentType.includes("text/plain"))
                conteudo_texto += `\`\`\`${client.defaultEmoji("paper")} Arquivo anexado:\n${await formataArquivo(corpo_mensagem.file)}\`\`\``
        }

        const msg_user = new EmbedBuilder()
            .setTitle("> Nova mensagem! :mailbox_with_mail:")
            .setColor(0xffffff)
            .setDescription(`-----------------------\nEnviado por \`${interaction.user.id}\`\n\n Mensagem: \`${corpo_mensagem.text.replaceAll("`", "'")}\`\n${conteudo_texto}`)
            .setFooter({ text: `Autor: ${interaction.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTimestamp()

        // Inserindo uma imagem no embed
        if (corpo_mensagem.file)
            msg_user.setImage(corpo_mensagem.file.attachment)

        client.tls.reply(interaction, user, "manu.mail.sucesso_1", true)
        client.notify(process.env.channel_mail, msg_user)
    }
}

async function formataArquivo(attachment) {
    const response = await fetch(attachment.attachment)
    const data = await response.text()

    return data.trim().slice(0, 1000)
}