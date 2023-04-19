const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const dispara_anuncio = require('../../adm/automaticos/dispara_anuncio.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_anunciar")
        .setDescription("⌠🤖⌡ Anúnciar games/dlcs free")
        .addStringOption(option =>
            option.setName("nome")
                .setDescription("O nome do conteúdo")
                .setRequired(true))
        .addNumberOption(option =>
            option.setName("preço")
                .setDescription("O preço do conteúdo")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("expiração")
                .setDescription("A data limite da promoção")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("link")
                .setDescription("O link do conteúdo")
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName("imagem")
                .setDescription("A imagem que será exibida"))
        .addStringOption(option =>
            option.setName("tipo")
                .setDescription("O tipo do conteudo")
                .addChoices(
                    { name: 'Jogo', value: '0' },
                    { name: 'DLC/Expansão', value: '1' },
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (interaction.user.id !== client.owners[0])
            return interaction.reply({ content: ":spy: | Parado ai! Você não pode usar esse comando!", ephemeral: true })

        await interaction.deferReply({ ephemeral: true })

        const item = {
            nome: interaction.options.getString("nome"),
            tipo: interaction.options.getString("tipo"),
            link: interaction.options.getString("link"),
            preco: interaction.options.getNumber("preço"),
            expira: interaction.options.getString("expiração"),
            thumbnail: interaction.options.getAttachment("imagem")
        }

        if (item.thumbnail)
            item.thumbnail = item.thumbnail.attachment

        if (!item.tipo)
            item.tipo = "jogo"

        const objetos_anunciados = [item]

        dispara_anuncio({ client, interaction, objetos_anunciados })
    }
}