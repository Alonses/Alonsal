const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { randomString } = require('../../adm/funcoes/random_string')

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
        .addIntegerOption(option =>
            option.setName("length")
                .setNameLocalizations({
                    "pt-BR": 'tamanho',
                    "es-ES": 'tamano',
                    "fr": 'longueur',
                    "it": 'lunghezza',
                    "ru": 'длина'
                })
                .setDescription("from 15 to 350")
                .setDescriptionLocalizations({
                    "pt-BR": 'de 15 até 350',
                    "es-ES": 'de 15 a 350',
                    "fr": 'de 15 à 350',
                    "it": 'da 15 a 350',
                    "ru": 'от 15 до 350'
                })
                .setMinValue(15)
                .setMaxValue(450)),
    async execute(client, user, interaction) {

        const tamanho = interaction.options.getInteger("length") || 15

        let bonus = ''

        for (let i = 0; i < 3; i++)
            bonus += `${randomString(tamanho, client)}\n\n`

        const row = client.create_buttons([{ name: client.tls.phrase(user, "util.password.testar_senha"), value: "https://password.kaspersky.com/", type: 4, emoji: "🌐" }], interaction)

        const embed = new EmbedBuilder()
            .setTitle(`> :lock_with_ink_pen: ${client.tls.phrase(user, "util.password.titulo")}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`:passport_control: **${client.tls.phrase(user, "util.password.primaria")}**\n\`\`\`${randomString(tamanho, client)}\`\`\`\n :gift: **${client.tls.phrase(user, "util.password.bonus")}**\n\`\`\`${bonus}\`\`\``)
            .setFooter({ text: client.replace(client.tls.phrase(user, "util.password.rodape"), tamanho) })

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}