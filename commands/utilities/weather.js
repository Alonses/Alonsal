const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setNameLocalizations({
            "de": 'klima',
            "es-ES": 'tiempo',
            "fr": 'climat',
            "it": 'clima',
            "pt-BR": 'tempo',
            "ru": 'погода'
        })
        .setDescription("⌠💡⌡ Show current weather somewhere")
        .setDescriptionLocalizations({
            "de": '⌠💡⌡ Sehen Sie sich das aktuelle Wetter an einem bestimmten Ort an',
            "es-ES": '⌠💡⌡ Muestra el clima actual en algún lugar',
            "fr": '⌠💡⌡ Afficher la météo actuelle quelque part',
            "it": '⌠💡⌡ Mostra il tempo attuale da qualche parte',
            "pt-BR": '⌠💡⌡ Mostra o clima atual em algum local',
            "ru": '⌠💡⌡ Посмотреть текущую погоду где-нибудь'
        })
        .addStringOption(option =>
            option.setName("place")
                .setNameLocalizations({
                    "de": 'lokal',
                    "es-ES": 'lugar',
                    "fr": 'place',
                    "it": 'posto',
                    "pt-BR": 'local',
                    "ru": 'место'
                })
                .setDescription("Enter a location")
                .setDescriptionLocalizations({
                    "de": 'Geben Sie einen Ort ein',
                    "es-ES": 'Ingrese una ubicación',
                    "fr": 'Informer un endroit',
                    "it": 'Inserisci una posizione',
                    "pt-BR": 'Insira um local',
                    "ru": 'введите местоположение'
                })),
    async execute({ client, user, interaction, user_command }) {

        await client.deferedReply(interaction, client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null)

        const alvo = user
        require('../../core/formatters/chunks/model_weather')({ client, alvo, interaction, user_command })
    }
}