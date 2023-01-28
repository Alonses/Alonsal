const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setNameLocalizations({
            "pt-BR": 'traduz',
            "es-ES": 'traducir',
            "fr": 'traduire',
            "it": 'tradurre'
        })
        .setDescription('⌠📡⌡ Help improve translations or implement new languages!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Ajude a melhorar traduções ou implementar novos idiomas!',
            "es-ES": '⌠📡⌡ ¡Ayude a mejorar las traducciones o implemente nuevos idiomas!',
            "fr": '⌠📡⌡ Aidez à améliorer les traductions ou implémentez de nouvelles langues!',
            "it": '⌠📡⌡ Aiutaci a migliorare le traduzioni o implementare nuove lingue!'
        }),
    async execute(client, interaction) {

        const user = await client.getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(client.embed_color(user.misc.color))
            .setTitle(`${client.tls.phrase(client, interaction, "manu.traduz.titulo")} ${client.emoji(emojis.dancando)}`)
            .setURL("https://github.com/Alonses/Alondioma")
            .setDescription(client.tls.phrase(client, interaction, "manu.traduz.descricao"))
            .setImage("https://i.imgur.com/zSVqxhV.png")

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}