const { SlashCommandBuilder, PermissionsBitField, AttachmentBuilder } = require('discord.js')

// const { createCanvas, loadImage } = require('canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cattle")
        .setNameLocalizations({
            "pt-BR": 'gado',
            "es-ES": 'ganado',
            "fr": 'betail',
            "it": 'bestiame'
        })
        .setDescription("⌠😂⌡ Test someone\'s horn size")
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Teste a gadisse de alguém',
            "es-ES": '⌠😂⌡ Prueba el tamaño del cuerno de alguien',
            "fr": '⌠😂⌡ Testez la taille de la corne de quelqu\'un',
            "it": '⌠😂⌡ Metti alla prova il gadisse di qualcuno'
        })
        .addUserOption(option =>
            option.setName("user")
                .setNameLocalizations({
                    "de": 'benutzer',
                    "es-ES": 'usuario',
                    "it": 'utente',
                    "pt-BR": 'usuario',
                    "ru": 'пользователь'
                })
                .setDescription("Mention a user")
                .setDescriptionLocalizations({
                    "de": 'Erwähnen Sie einen anderen Benutzer',
                    "es-ES": 'Mencionar a otro usuario',
                    "fr": 'Mentionner un utilisateur',
                    "it": 'Menziona un altro utente',
                    "pt-BR": 'Mencione outro usuário',
                    "ru": 'Упомянуть другого пользователя'
                })
                .setRequired(true)),
    async execute({ client, user, interaction }) {

        const alvo = interaction.options.getUser("user")

        if (client.id() === alvo.id) // Usuário marcou o bot
            return client.tls.reply(interaction, user, "dive.gado.error_2", true, 67)

        // Permissões do Alonso para enviar mensagem e ver o canal onde o comando foi usado
        if (!await client.permissions(null, client.id(), [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], interaction))
            return client.tls.reply(interaction, user, "dive.gado.permissao", true, 7)

        // await interaction.deferReply({ ephemeral: true })

        let frase_gado = client.tls.phrase(user, "dive.gado.frases", null, `\`${alvo.username}\``)
        // const { gado } = require('./../../files/json/text/gado.json')

        // const operador = frase_gado.split("|")[0] || "0"
        // let url_img = `./../../files/img/gado/gado_${gado[operador][client.random(gado[operador])]}.png`
        frase_gado = frase_gado.split("|")[1]

        // if (process.env.id_bool.includes(alvo.id)) url_img = "./../../files/img/gado/bool_1.png"

        // const canvas = createCanvas(300, 300)
        // const context = canvas.getContext('2d')

        // let avatar_user = alvo.avatar ? `https://cdn.discordapp.com/avatars/${alvo.id}/${alvo.avatar}.png` : "https://archive.org/download/discordprofilepictures/discordred.png"

        // Carregando as imagens de perfil do usuário
        // loadImage(avatar_user).then((image) => {
        //     context.drawImage(image, 0, 0, 270, 270)

        //     loadImage(url_img).then((image) => {
        //         context.drawImage(image, 0, 0, 300, 300)

                // Gerando a imagem para poder anexar ao canvas
                // attachment = new AttachmentBuilder(canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE }), { name: 'gado.png' })

                interaction.reply({ content: frase_gado })
            // })
        // })
    }
}