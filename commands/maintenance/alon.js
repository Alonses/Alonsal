const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alon")
        .setDescription("⌠📡⌡ Alonsal information")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Alonsal-Informationen',
            "es-ES": '⌠📡⌡ Información Alonsal',
            "fr": '⌠📡⌡ Informations sur le Alonsal',
            "it": '⌠📡⌡ Informazioni Alonsal',
            "pt-BR": '⌠📡⌡ Informações do Alonsal',
            "ru": '⌠📡⌡ Информация от Алонсал'
        }),
    async execute(client, user, interaction) {

        // Redirecionando o evento
        const caso = 0
        require('../../core/interactions/chunks/browse_info')({ client, user, interaction, caso })
    }
}