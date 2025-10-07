const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("module")
        .setNameLocalizations({
            "de": 'modul',
            "es-ES": 'modulo',
            "fr": 'module',
            "it": 'modulo',
            "pt-BR": 'modulo',
            "ru": 'модуль'
        })
        .setDescription("⌠🎉⌡ Define modules with pre-programmed functions")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setNameLocalizations({
                    "de": 'hinzufügen',
                    "es-ES": 'agregar',
                    "fr": 'ajouter',
                    "it": 'aggiungere',
                    "pt-BR": 'adicionar',
                    "ru": 'добавить'
                })
                .setDescription("⌠🎉⌡ Create a new module with pre-programmed functions")
                .setDescriptionLocalizations({
                    "de": '⌠🎉⌡ Erstellen Sie ein neues Modul mit vorprogrammierten Funktionen',
                    "es-ES": '⌠🎉⌡ Crea un nuevo módulo con funciones preprogramadas',
                    "fr": '⌠🎉⌡ Créez un nouveau module avec des fonctions préprogrammées',
                    "it": '⌠🎉⌡ Crea un nuovo modulo con funzioni preprogrammate',
                    "pt-BR": '⌠🎉⌡ Criar um novo módulo com funções pré-programadas',
                    "ru": '⌠🎉⌡ Создать новый модуль с запрограммированными функциями'
                })
                .addStringOption(option =>
                    option.setName("choice")
                        .setNameLocalizations({
                            "de": 'auswahl',
                            "es-ES": 'eleccion',
                            "fr": 'choix',
                            "it": 'scelta',
                            "pt-BR": 'escolha',
                            "ru": 'выбор'
                        })
                        .setDescription("What's your choice?")
                        .setDescriptionLocalizations({
                            "de": 'Was ist deine Wahl?',
                            "es-ES": '¿Cual es tu eleccion?',
                            "fr": 'Quel est ton choix?',
                            "it": 'Qual\'è la tua scelta?',
                            "pt-BR": 'Qual a sua escolha?',
                            "ru": 'Каков ваш выбор?'
                        })
                        .addChoices(
                            { name: '🌩️ Weather', value: '0' },
                            { name: '🖊️ Phrase', value: '1' },
                            // { name: '🏯 Historical events', value: '2' },
                            { name: '🃏 Jokes', value: '3' },
                            { name: '〽️ Curiosities', value: '4' },
                            { name: '💎 Minecraft Item', value: '5' },
                            { name: '🎮 Free Games', value: '6' }
                        )
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("hour")
                        .setNameLocalizations({
                            "de": 'stunde',
                            "es-ES": 'hora',
                            "fr": 'heure',
                            "it": 'ora',
                            "pt-BR": 'hora',
                            "ru": 'час'
                        })
                        .setMaxValue(23)
                        .setMinValue(0)
                        .setDescription("What time?")
                        .setDescriptionLocalizations({
                            "de": 'Zu welcher Zeit?',
                            "es-ES": '¿A que hora?',
                            "fr": 'Quelle heure?',
                            "it": 'A che ora?',
                            "pt-BR": 'Em qual horário?',
                            "ru": 'Во сколько?'
                        })
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("minute")
                        .setNameLocalizations({
                            "es-ES": 'minuto',
                            "fr": 'minute',
                            "it": 'minuto',
                            "pt-BR": 'minuto',
                            "ru": 'минута'
                        })
                        .setMaxValue(59)
                        .setMinValue(0)
                        .setDescription("In which minute?")
                        .setDescriptionLocalizations({
                            "de": 'In welcher Minute?',
                            "es-ES": '¿En qué minuto?',
                            "fr": 'Dans quelle minute?',
                            "it": 'In che minuto?',
                            "pt-BR": 'Em qual minuto?',
                            "ru": 'Какая минута?'
                        })
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("when")
                        .setNameLocalizations({
                            "de": 'wann',
                            "es-ES": 'cuando',
                            "fr": 'quand',
                            "it": 'quando',
                            "pt-BR": 'quando',
                            "ru": 'когда'
                        })
                        .setDescription("Which days?")
                        .setDescriptionLocalizations({
                            "de": 'An welchen Tagen?',
                            "es-ES": '¿En qué días?',
                            "fr": 'Quels jours?',
                            "it": 'In quali giorni?',
                            "pt-BR": 'Em quais dias?',
                            "ru": 'В какие дни?'
                        })
                        .addChoices(
                            { name: '🏭 Working days', value: '0' },
                            { name: '🛹 Weekends', value: '1' },
                            { name: '📆 Daily', value: '2' },
                            { name: '🛵 Sunday', value: '4' },
                            { name: '💀 Monday', value: '5' },
                            { name: '🤡 Tuesday', value: '6' },
                            { name: '🐸 Wednesday', value: '7' },
                            { name: '🚀 Thursday', value: '8' },
                            { name: '🍺 Friday', value: '9' },
                            { name: '🕺 Saturday', value: '10' }
                        )
                        .setRequired(true))
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
                        .setDescription("Enter a location for the weather module")
                        .setDescriptionLocalizations({
                            "de": 'Geben Sie einen Standort für das Wettermodul ein',
                            "es-ES": 'Introduzca una ubicación para el módulo meteorológico',
                            "fr": 'Entrez un emplacement pour le module météo',
                            "it": 'Inserisci una posizione per il modulo meteo',
                            "pt-BR": 'Insira um local para o módulo de clima',
                            "ru": 'Введите местоположение для погодного модуля.'
                        }))
                .addStringOption(option =>
                    option.setName("type")
                        .setNameLocalizations({
                            "de": 'typ',
                            "es-ES": 'tipo',
                            "fr": 'taper',
                            "it": 'tipo',
                            "pt-BR": 'tipo',
                            "ru": 'тип'
                        })
                        .setDescription("For server or personal use?")
                        .setDescriptionLocalizations({
                            "de": 'Für den Server oder den persönlichen Gebrauch?',
                            "es-ES": '¿Para servidor o uso personal?',
                            "fr": 'Pour un serveur ou un usage personnel?',
                            "it": 'Per uso server o personale?',
                            "pt-BR": 'Para o servidor ou para uso pessoal?',
                            "ru": 'Для сервера или личного пользования?'
                        })
                        .addChoices(
                            { name: '👤 Personal', value: 'user' },
                            { name: '🌐 Server', value: 'guild' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setNameLocalizations({
                    "de": 'liste',
                    "es-ES": 'lista',
                    "fr": 'liste',
                    "it": 'elenco',
                    "pt-BR": 'lista',
                    "ru": 'список'
                })
                .setDescription("⌠🎉⌡ Browse your modules")
                .setDescriptionLocalizations({
                    "de": '⌠🎉⌡ Durchsuchen Sie Ihre Module',
                    "es-ES": '⌠🎉⌡ Explora tus módulos',
                    "fr": '⌠🎉⌡ Parcourez vos modules',
                    "it": '⌠🎉⌡ Sfoglia i tuoi moduli',
                    "pt-BR": '⌠🎉⌡ Navegue por seus módulos',
                    "ru": '⌠🎉⌡ Смотрите свои модули'
                })),
    async execute({ client, user, interaction }) {

        if (interaction.options.getSubcommand() === "add") // Criando um módulo novo
            require('./subcommands/module_add')({ client, user, interaction })
        else // Navegando pelos módulos
            require('../../core/interactions/chunks/modulos')({ client, user, interaction })
    }
}