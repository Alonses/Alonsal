const { SlashCommandBuilder } = require('discord.js')

const { randomString } = require('../../core/functions/random_string')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("password")
        .setDescription("⌠💡⌡ Generate random passwords")
        .setDescriptionLocalizations({
            "de": '⌠💡⌡ Generieren Sie zufällige Passwörter',
            "es-ES": '⌠💡⌡ Genera contraseñas aleatorias',
            "fr": '⌠💡⌡ Générer des mots de passe aléatoires',
            "it": '⌠💡⌡ Genera password casuali',
            "pt-BR": '⌠💡⌡ Gere senhas aleatórias',
            "ru": '⌠💡⌡ Генерация случайных паролей'
        })
        .addIntegerOption(option =>
            option.setName("length")
                .setNameLocalizations({
                    "de": 'größe',
                    "es-ES": 'tamano',
                    "fr": 'longueur',
                    "it": 'lunghezza',
                    "pt-BR": 'tamanho',
                    "ru": 'длина'
                })
                .setDescription("from 15 to 350")
                .setDescriptionLocalizations({
                    "de": 'von 15 bis 350',
                    "es-ES": 'de 15 a 350',
                    "fr": 'de 15 à 350',
                    "it": 'da 15 a 350',
                    "pt-BR": 'de 15 até 350',
                    "ru": 'от 15 до 350'
                })
                .setMinValue(15)
                .setMaxValue(350)),
    async execute({ client, user, interaction }) {

        const tamanho = interaction.options.getInteger("length") || 15

        let bonus = ''

        for (let i = 0; i < 3; i++)
            bonus += `${randomString(tamanho, client)}\n\n`

        const row = client.create_buttons([
            { name: { tls: "util.password.testar_senha", alvo: user }, value: "https://password.kaspersky.com/", type: 4, emoji: "🌐" }
        ], interaction)

        const embed = client.create_embed({
            titl: `> :lock_with_ink_pen: ${client.tls.phrase(user, "util.password.titulo")}`,
            description: `:passport_control: **${client.tls.phrase(user, "util.password.primaria")}**\n\`\`\`${randomString(tamanho, client)}\`\`\`\n :gift: **${client.tls.phrase(user, "util.password.bonus")}**\n\`\`\`${bonus}\`\`\``,
            footer: {
                text: client.tls.phrase(user, "util.password.rodape", null, tamanho)
            }
        }, user)

        interaction.reply({
            embeds: [embed],
            components: [row],
            flags: "Ephemeral"
        })
    }
}