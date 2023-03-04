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
                })),
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
        }

        user.save()
    }
}