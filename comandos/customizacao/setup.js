const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("⌠🎉⌡ Control bot functions and preferences")
        .addSubcommand(subcommand =>
            subcommand
                .setName("weather")
                .setNameLocalizations({
                    "pt-BR": 'tempo',
                    "es-ES": 'tiempo',
                    "fr": 'climat',
                    "it": 'clima',
                    "ru": 'погода'
                })
                .setDescription("⌠🎉⌡ Set the return type for weather requests")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠🎉⌡ Defina o tipo de retorno para requisições de clima',
                    "es-ES": '⌠🎉⌡ Establecer el tipo de retorno para las solicitudes meteorológicas',
                    "fr": '⌠🎉⌡ Définir le type de retour pour les requêtes météo',
                    "it": '⌠🎉⌡ Imposta il tipo di ritorno per le richieste meteo',
                    "ru": '⌠🎉⌡ Установить тип возвращаемого значения для запросов о погоде'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("tasks")
                .setNameLocalizations({
                    "pt-BR": 'tarefas',
                    "es-ES": 'tareas',
                    "fr": 'taches',
                    "it": 'appunti',
                    "ru": 'задания'
                })
                .setDescription("⌠🎉⌡ Define whether tasks will be accessible only on servers or globally")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠🎉⌡ Defina se tarefas serão acessíveis apenas em servidores ou globalmente',
                    "es-ES": '⌠🎉⌡ Establecer si las tareas estarán disponibles solo en servidores o globalmente',
                    "fr": '⌠🎉⌡ Définissez si les tâches seront disponibles uniquement sur les serveurs ou globalement',
                    "it": '⌠🎉⌡ Imposta se le attività saranno disponibili solo sui server o a livello globale',
                    "ru": '⌠🎉⌡ Установите, будут ли задачи доступны только на серверах или глобально'
                })),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "weather") {

            if (typeof user.misc.weather !== "undefined")
                user.misc.weather = !user.misc.weather
            else
                user.misc.weather = false

            if (user.misc.weather)
                interaction.reply({ content: client.tls.phrase(user, "mode.weather.ativo", 25), ephemeral: true })
            else
                interaction.reply({ content: client.tls.phrase(user, "mode.weather.desativo", 24), ephemeral: true })

        } else if (interaction.options.getSubcommand() === "tasks") {

            // Ativa ou desativa as tarefas globais
            if (typeof user.conf.global_tasks !== "undefined")
                user.conf.global_tasks = !user.conf.global_tasks
            else
                user.conf.global_tasks = false

            if (user.conf.global_tasks)
                interaction.reply({ content: client.tls.phrase(user, "mode.tasks.ativo", [client.defaultEmoji("paper"), 22]), ephemeral: true })
            else
                interaction.reply({ content: client.tls.phrase(user, "mode.tasks.desativo", [client.defaultEmoji("paper"), 23]), ephemeral: true })
        }

        await user.save()
    }
}