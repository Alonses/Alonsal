const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('baidu')
        .setDescription('⌠😂⌡ Praise be!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Louvado seja!',
            "es-ES": '⌠😂⌡ ¡Alabado seas!',
            "fr": '⌠😂⌡ Loué soit !',
            "it": '⌠😂⌡ Sia lodato!'
        }),
    async execute(client, interaction) {

        const baidu = new AttachmentBuilder('./arquivos/img/baidu.png')
        interaction.reply({ content: client.tls.phrase(client, interaction, "dive.baidu.baidu"), files: [baidu] })
    }
}