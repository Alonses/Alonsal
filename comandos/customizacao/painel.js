const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setNameLocalizations({
            "pt-BR": 'painel',
            "fr": 'panneau',
            "it": 'pannello',
            "ru": 'панель'
        })
        .setDescription("⌠👤⌡ (De)activate my functions")
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ (Des)ative funções minhas',
            "es-ES": '⌠👤⌡ (Des)activar mis funciones',
            "fr": '⌠👤⌡ (Dé)activer mes fonctions',
            "it": '⌠👤⌡ (Dis)attiva le mie funzioni',
            "ru": '⌠👤⌡ (Не)активировать мои функции'
        }),
    async execute(client, user, interaction) {
        return require('../../adm/formatadores/chunks/model_painel')(client, user, interaction)
    }
}