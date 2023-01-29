const { SlashCommandBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ghostmode')
        .setNameLocalizations({
            "pt-BR": 'fantasma',
            "es-ES": 'fantasma',
            "fr": 'fantome',
            "it": 'fantasma',
            "ru": 'призрак'
        })
        .setDescription('⌠👤⌡ All commands you use will be shown just for you')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Todos os comandos que você usar serão mostrados apenas para você',
            "es-ES": '⌠👤⌡ Todos los comandos que use se mostrarán solo para usted',
            "fr": '⌠👤⌡ Toutes les commandes que vous utilisez seront affichées juste pour vous',
            "it": '⌠👤⌡ Tutti i comandi che usi verranno mostrati solo per te',
            "ru": '⌠👤⌡ Все команды, которые вы используете, будут показаны только для вас'
        }),
    async execute(client, user, interaction) {

        // Ativa ou desativa o modo fantasma e salva
        user.misc.ghost_mode = !user.misc.ghost_mode
        user.save()

        if (user.misc.ghost_mode)
            interaction.reply({ content: `:ghost: | ${client.tls.phrase(user, "mode.oculto.ativo")}`, ephemeral: true })
        else
            interaction.reply({ content: `${client.emoji(emojis.ghostbusters)} | ${client.tls.phrase("mode.oculto.desativo")}`, ephemeral: true })
    }
}