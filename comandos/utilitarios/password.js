const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('password')
        .setDescription('⌠💡⌡ Generate random passwords')
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Gere senhas aleatórias',
            "es-ES": '⌠💡⌡ Genera contraseñas aleatorias',
            "fr": '⌠💡⌡ Générer des mots de passe aléatoires'
        })
        .addStringOption(option =>
            option.setName('length')
                .setNameLocalizations({
                    "pt-BR": 'tamanho',
                    "es-ES": 'tamano',
                    "fr": 'longueur'
                })
                .setDescription('from 12 to 350')
                .setDescriptionLocalizations({
                    "pt-BR": 'de 12 até 350',
                    "es-ES": 'de 12 a 350',
                    "fr": 'de 12 à 350'
                })),
    async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id)

        let tamanho = interaction.options.data.length > 0 ? parseInt(interaction.options.data[0].value) : 12
        tamanho = tamanho <= 5 ? 12 : tamanho
        tamanho = tamanho >= 400 ? 350 : tamanho

        let bonus = ''

        for (let i = 0; i < 3; i++)
            bonus += `${randomString(tamanho)}\n\n`

        const embed = new EmbedBuilder()
            .setTitle(`:lock_with_ink_pen: ${utilitarios[18]["titulo"]}`)
            .setURL('https://password.kaspersky.com/')
            .setColor(user.misc.embed)
            .setDescription(`:passport_control: **${utilitarios[18]["primaria"]}**\n\`\`\`${randomString(tamanho)}\`\`\`\n :gift: **${utilitarios[18]["bonus"]}**\n\`\`\`${bonus}\`\`\``)
            .setFooter({ text: utilitarios[18]["rodape"].replace("tamanho_repl", tamanho) })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}

function randomString(len) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdeeͪfghijklmnopqrstuvwxyz0123456789!@#$%¨&*()^[]{}+=~.,;:¢¬_-£"|\\/?§'
    let randomString = ''

    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length)
        randomString += charSet.slice(randomPoz, randomPoz + 1)
    }

    return shuffle(randomString.split(''))
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
        return o.join("")
}