const { SlashCommandBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("⌠👤⌡ Control bot functions and preferences")
        .addSubcommand(subcommand =>
            subcommand
                .setName("notifications")
                .setNameLocalizations({
                    "pt-BR": 'notificacoes',
                    "es-ES": 'notificaciones',
                    "fr": 'avis',
                    "it": 'notifiche',
                    "ru": 'yведомления'
                })
                .setDescription("⌠👤⌡ Disables or enables bot DM notifications")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Desabilitar ou habilitar as notificações do bot via DM',
                    "es-ES": '⌠👤⌡ Deshabilita o habilita las notificaciones de DM de bot',
                    "fr": '⌠👤⌡ Désactive ou active les notifications DM du bot',
                    "it": '⌠👤⌡ Disabilita o abilita le notifiche DM dei bot',
                    "ru": '⌠👤⌡ Отключить или включить уведомления ботов в DM'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("ghostmode")
                .setNameLocalizations({
                    "pt-BR": 'fantasma',
                    "es-ES": 'fantasma',
                    "fr": 'fantome',
                    "it": 'fantasma',
                    "ru": 'призрак'
                })
                .setDescription("⌠👤⌡ All commands you use will be shown just for you")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Todos os comandos que você usar serão mostrados apenas para você',
                    "es-ES": '⌠👤⌡ Todos los comandos que use se mostrarán solo para usted',
                    "fr": '⌠👤⌡ Toutes les commandes que vous utilisez seront affichées juste pour vous',
                    "it": '⌠👤⌡ Tutti i comandi che usi verranno mostrati solo per te',
                    "ru": '⌠👤⌡ Все команды, которые вы используете, будут показаны только для вас'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("ranking")
                .setDescription("⌠👤⌡ Disable or enable your XP gain")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Desabilitar ou habilitar seu ganho de XP',
                    "es-ES": '⌠👤⌡ Deshabilite o habilite su ganancia de XP',
                    "fr": '⌠👤⌡ Désactiver ou activer votre gain d\'XP',
                    "it": '⌠👤⌡ Disabilita o abilita il tuo guadagno XP',
                    "ru": '⌠👤⌡ Отключить или включить получение опыта'
                }))
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
                .setDescription("⌠👤⌡ Defina o tipo de retorno para requisições de clima")),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "notifications") {

            // Ativa ou desativa o modo fantasma e salva
            if (typeof user.conf.notify !== "undefined")
                user.conf.notify = !user.conf.notify
            else
                user.conf.notify = false

            if (user.conf.notify)
                interaction.reply({ content: `${client.emoji(emojis.notify)} | ${client.tls.phrase(user, "mode.notify.ativo")}`, ephemeral: true })
            else
                interaction.reply({ content: `${client.emoji(emojis.pare_agr)} | ${client.tls.phrase(user, "mode.notify.desativo")}`, ephemeral: true })

        } else if (interaction.options.getSubcommand() === "ghostmode") {

            // Ativa ou desativa o modo fantasma e salva
            if (typeof user.conf.ghost_mode !== "undefined")
                user.conf.ghost_mode = !user.conf.ghost_mode
            else
                user.conf.ghost_mode = true

            if (user.conf.ghost_mode)
                interaction.reply({ content: `:ghost: | ${client.tls.phrase(user, "mode.oculto.ativo")}`, ephemeral: true })
            else
                interaction.reply({ content: `${client.emoji(emojis.ghostbusters)} | ${client.tls.phrase(user, "mode.oculto.desativo")}`, ephemeral: true })
        } else if (interaction.options.getSubcommand() === "ranking") {

            // Ativa ou desativa o modo fantasma e salva
            if (typeof user.conf.ranking !== "undefined")
                user.conf.ranking = !user.conf.ranking
            else
                user.conf.ranking = false

            if (user.conf.ranking)
                interaction.reply({ content: `:gem: | ${client.tls.phrase(user, "mode.ranking.ativo")}`, ephemeral: true })
            else
                interaction.reply({ content: `:exploding_head: | ${client.tls.phrase(user, "mode.ranking.desativo")}`, ephemeral: true })
        } else if (interaction.options.getSubcommand() === "weather") {

            if (typeof user.misc.weather !== "undefined")
                user.misc.weather = !user.misc.weather
            else
                user.misc.weather = false

            if (user.misc.weather)
                interaction.reply({ content: `:sparkles: | Mostrarei todas as informações sobre o clima nas próximas interações.`, ephemeral: true })
            else
                interaction.reply({ content: `:partly_sunny: | Mostrarei apenas as informações básicas para o clima nas próximas interações.`, ephemeral: true })
        }

        await user.save()
    }
}