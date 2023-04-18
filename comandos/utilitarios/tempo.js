const { SlashCommandBuilder } = require('discord.js')

const requisita_clima = require('../../adm/formatadores/formata_clima')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setNameLocalizations({
            "pt-BR": 'tempo',
            "es-ES": 'tiempo',
            "fr": 'climat',
            "it": 'clima',
            "ru": 'погода'
        })
        .setDescription("⌠💡⌡ Show current weather somewhere")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Mostra o clima atual em algum local',
            "es-ES": '⌠💡⌡ Muestra el clima actual en algún lugar',
            "fr": '⌠💡⌡ Afficher la météo actuelle quelque part',
            "it": '⌠💡⌡ Mostra il tempo attuale da qualche parte',
            "ru": '⌠💡⌡ Посмотреть текущую погоду где-нибудь'
        })
        .addStringOption(option =>
            option.setName("place")
                .setNameLocalizations({
                    "pt-BR": 'local',
                    "es-ES": 'lugar',
                    "fr": 'place',
                    "it": 'posto',
                    "ru": 'место'
                })
                .setDescription("Enter a location")
                .setDescriptionLocalizations({
                    "pt-BR": 'Insira um local',
                    "es-ES": 'Ingrese una ubicación',
                    "fr": 'Informer un endroit',
                    "it": 'Inserisci una posizione',
                    "ru": 'введите местоположение'
                })),
    async execute(client, user, interaction) {

        await interaction.deferReply({ ephemeral: client.decider(user?.conf.ghost_mode, 0) })

        requisita_clima(client, user, interaction)
    }
}