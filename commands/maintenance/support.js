const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setNameLocalizations({
            "de": 'unterstützung',
            "es-ES": 'soporte',
            "fr": 'soutien',
            "it": 'supporto',
            "pt-BR": 'suporte',
            "ru": 'поддержка'
        })
        .setDescription("⌠📡⌡ Support Alonsal")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Unterstützen Sie Alonsal',
            "es-ES": '⌠📡⌡ Apoya a Alonsal',
            "fr": '⌠📡⌡ Soutenez Alonsal',
            "it": '⌠📡⌡ Supporta Alonsal',
            "pt-BR": '⌠📡⌡ Dê suporte ao Alonsal',
            "ru": '⌠📡⌡ Поддержите Alonsal™️'
        }),
    async execute({ client, user, interaction }) {

        // Redirecionando o evento
        require("../../core/formatters/chunks/model_support")({ client, user, interaction })
    }
}