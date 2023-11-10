const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mine")
        .setDescription("⌠💡⌡ Search Minecraft items")
        .setDescriptionLocalizations({
            "de": '⌠💡⌡ Suche nach Minecraft-Gegenständen',
            "es-ES": '⌠💡⌡ Buscar elementos de Minecraft',
            "fr": '⌠💡⌡ Rechercher des articles Minecraft',
            "it": '⌠💡⌡ Cerca oggetti Minecraft',
            "pt-BR": '⌠💡⌡ Pesquise itens do Minecraft',
            "ru": '⌠💡⌡ Найди предметы в майнкрафте'
        })
        .addStringOption(option =>
            option.setName("item")
                .setDescription("Insert an item")
                .setDescriptionLocalizations({
                    "de": 'Geben Sie einen Namen ein',
                    "es-ES": 'Insertar un artículo',
                    "fr": 'Insérer un élément',
                    "it": 'Inserire un elemento',
                    "pt-BR": 'Insira um item',
                    "ru": 'поиск элемента'
                })),
    async execute({ client, user, interaction }) {

        // Redirecionando o evento
        require('../../core/formatters/chunks/model_mine')(client, user, interaction)
    }
}