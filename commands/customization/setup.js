const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("⌠🎉⌡ Control bot functions and preferences")
        .addSubcommand(subcommand =>
            subcommand
                .setName("weather")
                .setNameLocalizations({
                    "de": 'wetter',
                    "es-ES": 'tiempo',
                    "fr": 'climat',
                    "it": 'clima',
                    "pt-BR": 'tempo',
                    "ru": 'погода'
                })
                .setDescription("⌠🎉⌡ Set the return type for weather requests")
                .setDescriptionLocalizations({
                    "de": '⌠🎉⌡ Rückgabetyp für Wetteranfragen festlegen',
                    "es-ES": '⌠🎉⌡ Establecer el tipo de retorno para las solicitudes meteorológicas',
                    "fr": '⌠🎉⌡ Définir le type de retour pour les requêtes météo',
                    "it": '⌠🎉⌡ Imposta il tipo di ritorno per le richieste meteo',
                    "pt-BR": '⌠🎉⌡ Defina o tipo de retorno para requisições de clima',
                    "ru": '⌠🎉⌡ Установить тип возвращаемого значения для запросов о погоде'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("tasks")
                .setNameLocalizations({
                    "de": 'aufgaben',
                    "es-ES": 'tareas',
                    "fr": 'taches',
                    "it": 'appunti',
                    "pt-BR": 'tarefas',
                    "ru": 'задания'
                })
                .setDescription("⌠🎉⌡ Define whether tasks will be accessible only on servers or globally")
                .setDescriptionLocalizations({
                    "de": '⌠🎉⌡ Definieren Sie, ob Aufgaben nur auf Servern oder global zugänglich sein sollen',
                    "es-ES": '⌠🎉⌡ Establecer si las tareas estarán disponibles solo en servidores o globalmente',
                    "fr": '⌠🎉⌡ Définissez si les tâches seront disponibles uniquement sur les serveurs ou globalement',
                    "it": '⌠🎉⌡ Imposta se le attività saranno disponibili solo sui server o a livello globale',
                    "pt-BR": '⌠🎉⌡ Defina se tarefas serão acessíveis apenas em servidores ou globalmente',
                    "ru": '⌠🎉⌡ Установите, будут ли задачи доступны только на серверах или глобально'
                })),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "weather") {

            if (typeof user.misc.weather !== "undefined")
                user.misc.weather = !user.misc.weather
            else
                user.misc.weather = false

            if (user.misc.weather)
                client.tls.reply(interaction, user, "mode.weather.ativo", true, 25)
            else
                client.tls.reply(interaction, user, "mode.weather.desativo", true, 24)

        } else if (interaction.options.getSubcommand() === "tasks") {

            // Ativa ou desativa as tarefas globais
            if (typeof user.conf.global_tasks !== "undefined")
                user.conf.global_tasks = !user.conf.global_tasks
            else
                user.conf.global_tasks = false

            if (user.conf.global_tasks)
                client.tls.reply(interaction, user, "mode.tasks.ativo", true, null, [client.defaultEmoji("paper"), 22])
            else
                client.tls.reply(interaction, user, "mode.tasks.desativo", true, null, [client.defaultEmoji("paper"), 23])
        }

        await user.save()
    }
}