const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('baidu')
        .setDescription('⌠😂⌡ Praise be!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Louvado seja!',
            "es-ES": '⌠😂⌡ ¡Alabado seas!',
            "fr": '⌠😂⌡ Loué soit !'
        }),
    async execute(client, interaction) {

        const { diversao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

        const baidu = new AttachmentBuilder('./arquivos/img/baidu.png')
        interaction.reply({ content: diversao[0]["baidu"], files: [baidu] })
    }
}