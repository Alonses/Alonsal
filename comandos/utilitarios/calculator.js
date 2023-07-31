const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("calculator")
        .setNameLocalizations({
            "pt-BR": 'calculadora',
            "es-ES": 'calculadora',
            "fr": 'calculatrice',
            "it": 'calcolatrice',
            "ru": 'калькулятор'
        })
        .setDescription("⌠💡⌡ Find math problem results")
        .addSubcommand(subcommand =>
            subcommand
                .setName("equation")
                .setNameLocalizations({
                    "pt-BR": 'equacao',
                    "es-ES": 'ecuacion',
                    "fr": 'equation',
                    "it": 'equazione',
                    "ru": 'уравнение'
                })
                .setDescription("⌠💡⌡ Find math problem results")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Ache resultados de problemas matemáticos',
                    "es-ES": '⌠💡⌡ Encuentra los resultados de los problemas matemáticos',
                    "fr": '⌠💡⌡ Trouver les résultats des problèmes mathématiques',
                    "it": '⌠💡⌡ Trova i risultati dei problemi di matematica',
                    "ru": '⌠💡⌡ Найдите результаты математических задач'
                })
                .addStringOption(option =>
                    option.setName("equation")
                        .setNameLocalizations({
                            "pt-BR": 'equacao',
                            "es-ES": 'ecuacion',
                            "fr": 'equation',
                            "it": 'equazione',
                            "ru": 'уравнение'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Escreva algo!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("circle")
                .setNameLocalizations({
                    "pt-BR": 'circulo',
                    "es-ES": 'circulo',
                    "fr": 'cercle',
                    "it": 'cerchio',
                    "ru": 'круг'
                })
                .setDescription("⌠💡⌡ Discover values of circular objects")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Descubra os valores dos objetos circulares',
                    "es-ES": '⌠💡⌡ Descubre valores de objetos circulares',
                    "fr": '⌠💡⌡ Découvrez les valeurs des objets circulaires',
                    "it": '⌠💡⌡ Scopri i valori degli oggetti circolari',
                    "ru": '⌠💡⌡ Откройте для себя значения круглых объектов'
                })
                .addStringOption(option =>
                    option.setName("input")
                        .setNameLocalizations({
                            "pt-BR": 'entrada',
                            "es-ES": 'entrada',
                            "fr": 'entree',
                            "it": 'entrata',
                            "ru": 'вход'
                        })
                        .setDescription("The input type")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O tipo da sua entrada',
                            "es-ES": 'El tipo de entrada',
                            "fr": 'Le type d\'entrée',
                            "it": 'Il tipo di ingresso',
                            "ru": 'тип ввода'
                        })
                        .addChoices(
                            { name: '🕛 Ray', value: '0' },
                            { name: '🚫 Diameter', value: '1' },
                            { name: '⭕ Perimeter', value: '2' },
                            { name: '⚪ Area', value: '3' }
                        )
                        .setRequired(true))
                .addNumberOption(option =>
                    option.setName("value")
                        .setNameLocalizations({
                            "pt-BR": 'valor',
                            "es-ES": 'valor',
                            "fr": 'valeur',
                            "it": 'valore',
                            "ru": 'ценить'
                        })
                        .setDescription("The entry value")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O valor de entrada',
                            "es-ES": 'El valor de entrada',
                            "fr": 'La valeur d\'entrée',
                            "it": 'Il valore di entrata',
                            "ru": 'значение входа'
                        })
                        .setMinValue(0)
                        .setRequired(true))),
    async execute(client, user, interaction) {

        // Solicitando a função e executando
        require(`./subcommands/calculator_${interaction.options.getSubcommand()}`)({ client, user, interaction })
    }
}