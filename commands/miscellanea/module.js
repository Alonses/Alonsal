const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("module")
        .setNameLocalizations({
            "pt-BR": 'modulo',
            "es-ES": 'modulo',
            "fr": 'module',
            "it": 'modulo',
            "ru": 'модуль'
        })
        .setDescription("⌠🎉⌡ Define modules with pre-programmed functions")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("⌠🎉⌡ Create a new module with pre-programmed functions")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠🎉⌡ Criar um novo módulo com funções pré-programadas',
                    "es-ES": '⌠🎉⌡ Crea un nuevo módulo con funciones preprogramadas',
                    "fr": '⌠🎉⌡ Créez un nouveau module avec des fonctions préprogrammées',
                    "it": '⌠🎉⌡ Crea un nuovo modulo con funzioni preprogrammate',
                    "ru": '⌠🎉⌡ Создать новый модуль с запрограммированными функциями'
                })
                .addStringOption(option =>
                    option.setName("choice")
                        .setNameLocalizations({
                            "pt-BR": 'escolha',
                            "es-ES": 'eleccion',
                            "fr": 'choix',
                            "it": 'scelta',
                            "ru": 'выбор'
                        })
                        .setDescription("What's your choice?")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Qual a sua escolha?',
                            "es-ES": '¿Cual es tu eleccion?',
                            "fr": 'Quel est ton choix?',
                            "it": 'Qual\'è la tua scelta?',
                            "ru": 'Каков ваш выбор?'
                        })
                        .addChoices(
                            { name: '🌩️ Clima', value: '0' },
                            { name: '🖊️ Frase', value: '1' },
                            { name: '🏯 Eventos históricos', value: '2' },
                            { name: '🃏 Charadas', value: '3' },
                            { name: '〽️ Curiosidades', value: '4' }
                        )
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("hour")
                        .setNameLocalizations({
                            "pt-BR": 'hora',
                            "es-ES": 'hora',
                            "fr": 'heure',
                            "it": 'ora',
                            "ru": 'час'
                        })
                        .setMaxValue(23)
                        .setMinValue(0)
                        .setDescription("Em qual horário?")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Em qual horário?',
                            "es-ES": '¿A que hora?',
                            "fr": 'Quelle heure?',
                            "it": 'A che ora?',
                            "ru": 'Во сколько?'
                        })
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("minute")
                        .setNameLocalizations({
                            "pt-BR": 'minuto',
                            "es-ES": 'minuto',
                            "fr": 'minute',
                            "it": 'minuto',
                            "ru": 'минута'
                        })
                        .setMaxValue(59)
                        .setMinValue(0)
                        .setDescription("In which minute?")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Em qual minuto?',
                            "es-ES": '¿En qué minuto?',
                            "fr": 'Dans quelle minute?',
                            "it": 'In che minuto?',
                            "ru": 'Какая минута?'
                        })
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("when")
                        .setNameLocalizations({
                            "pt-BR": 'quando',
                            "es-ES": 'cuando',
                            "fr": 'quand',
                            "it": 'quando',
                            "ru": 'когда'
                        })
                        .setDescription("Which days?")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Em quais dias?',
                            "es-ES": '¿En qué días?',
                            "fr": 'Quels jours?',
                            "it": 'In quali giorni?',
                            "ru": 'В какие дни?'
                        })
                        .addChoices(
                            { name: 'Dias úteis', value: '0' },
                            { name: 'Finais de semana', value: '1' },
                            { name: 'Todos os dias', value: '2' }
                        )
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setNameLocalizations({
                    "pt-BR": 'lista',
                    "es-ES": 'lista',
                    "fr": 'liste',
                    "it": 'elenco',
                    "ru": 'список'
                })
                .setDescription("⌠🎉⌡ Browse your modules")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠🎉⌡ Navegue por seus módulos',
                    "es-ES": '⌠🎉⌡ Explora tus módulos',
                    "fr": '⌠🎉⌡ Parcourez vos modules',
                    "it": '⌠🎉⌡ Sfoglia i tuoi moduli',
                    "ru": '⌠🎉⌡ Смотрите свои модули'
                })),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "add") // Criando um módulo novo
            return require('./subcommands/module_add')({ client, user, interaction })
        else { // Navegando pelos módulos

            let autor_original = true
            return require('../../core/interactions/chunks/modulos')({ client, user, interaction, autor_original })
        }
    }
}