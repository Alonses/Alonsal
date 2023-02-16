const { SlashCommandBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
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
        }),
    async execute(client, user, interaction) {

        // Ativa ou desativa o modo fantasma e salva
        user.conf.notify = !user?.conf.notify || false
        user.save()

        if (user.conf.notify)
            interaction.reply({ content: `${client.emoji(emojis.notify)} | ${client.tls.phrase(user, "mode.notify.ativo")}`, ephemeral: true })
        else
            interaction.reply({ content: `${client.emoji(emojis.arnold_stop)} | ${client.tls.phrase(user, "mode.notify.desativo")}`, ephemeral: true })
    }
}