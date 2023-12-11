const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alon")
        .setDescription("⌠📡⌡ Alon information")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Alon-Informationen',
            "es-ES": '⌠📡⌡ Información Alon',
            "fr": '⌠📡⌡ Informations sur le Alon',
            "it": '⌠📡⌡ Informazioni Alon',
            "pt-BR": '⌠📡⌡ Informações do Alon',
            "ru": '⌠📡⌡ Информация от Алонсал'
        }),
    async execute({ client, user, interaction }) {

        // Redirecionando o evento
        const caso = 0
        require('../../core/interactions/chunks/browse_info')({ client, user, interaction, caso })
    }
}