const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("password")
        .setDescription("⌠💡⌡ Generate random passwords")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Gere senhas aleatórias',
            "es-ES": '⌠💡⌡ Genera contraseñas aleatorias',
            "fr": '⌠💡⌡ Générer des mots de passe aléatoires',
            "it": '⌠💡⌡ Genera password casuali',
            "ru": '⌠💡⌡ Генерация случайных паролей'
        })
        .addStringOption(option =>
            option.setName("length")
                .setNameLocalizations({
                    "pt-BR": 'tamanho',
                    "es-ES": 'tamano',
                    "fr": 'longueur',
                    "it": 'lunghezza',
                    "ru": 'длина'
                })
                .setDescription("from 12 to 350")
                .setDescriptionLocalizations({
                    "pt-BR": 'de 12 até 350',
                    "es-ES": 'de 12 a 350',
                    "fr": 'de 12 à 350',
                    "it": 'da 12 a 350',
                    "ru": 'от 12 до 350'
                })),
    async execute(client, user, interaction) {

        let tamanho = interaction.options.data.length > 0 ? parseInt(interaction.options.data[0].value) : 15
        tamanho = tamanho <= 5 ? 15 : tamanho
        tamanho = tamanho >= 400 ? 350 : tamanho

        let bonus = ''

        for (let i = 0; i < 3; i++)
            bonus += `${randomString(tamanho, client)}\n\n`

        const embed = new EmbedBuilder()
            .setTitle(`:lock_with_ink_pen: ${client.tls.phrase(user, "util.password.titulo")}`)
            .setURL("https://password.kaspersky.com/")
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`:passport_control: **${client.tls.phrase(user, "util.password.primaria")}**\n\`\`\`${randomString(tamanho, client)}\`\`\`\n :gift: **${client.tls.phrase(user, "util.password.bonus")}**\n\`\`\`${bonus}\`\`\``)
            .setFooter({ text: client.tls.phrase(user, "util.password.rodape").replace("tamanho_repl", tamanho) })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}

function randomString(len, client) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdeeͪfghijklmnopqrstuvwxyz0123456789!@#$%¨&*()^[]{}+=~.,;:¢¬_-£"|?§'
    let randomString = ''

    for (let i = 0; i < len; i++) {
        let randomPoz = client.random(charSet.length)
        randomString += charSet.slice(randomPoz, randomPoz + 1)
    }

    return shuffle(randomString.split(''))
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
        return o.join("")
}