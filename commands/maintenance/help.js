const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("⌠🌎⌡ It all starts here")
        .setDescriptionLocalizations({
            "de": '⌠🌎⌡ Hier beginnt alles',
            "es-ES": '⌠🌎⌡ Todo comienza aquí',
            "fr": '⌠🌎⌡ Tout commence ici',
            "it": '⌠🌎⌡ Tutto inizia qui',
            "pt-BR": '⌠🌎⌡ Tudo começa por aqui',
            "ru": '⌠🌎⌡ Все начинается здесь'
        }),
    async execute(client, user, interaction) {

        // Redirecionando o evento
        require('../../core/interactions/chunks/browse_help')({ client, user, interaction })
    }
}