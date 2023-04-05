const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("modulo")
        .setDescription("Defina módulos com funções pré-programadas"),
        // .addStringOption(option =>
        //     option.setName("tipo")
        //         .setNameLocalizations({
        //             "pt-BR": 'escolha',
        //             "es-ES": 'eleccion',
        //             "fr": 'choix',
        //             "it": 'scelta',
        //             "ru": 'выбор'
        //         })
        //         .setDescription("What's your choice?")
        //         .setDescriptionLocalizations({
        //             "pt-BR": 'Qual a sua escolha?',
        //             "es-ES": '¿Cual es tu eleccion?',
        //             "fr": 'Quel est ton choix?',
        //             "it": 'Qual\'è la tua scelta?',
        //             "ru": 'Каков ваш выбор?'
        //         })
        //         .addChoices(
        //             { name: '🖊️', value: 0 },
        //             { name: '🌩️', value: 1 },
        //             { name: '🏯', value: 2 }
        //         )),
    async execute(client, user, interaction) {

        return null
    }
}