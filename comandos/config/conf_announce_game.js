const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const dispara_anuncio = require('../../adm/automaticos/dispara_anuncio.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_anunciar')
        .setDescription('⌠🤖⌡ Anúnciar games/dlcs free')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('O nome do conteúdo')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('preço')
                .setDescription('O preço do conteúdo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('expiração')
                .setDescription('A data limite da promoção')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('link')
                .setDescription('O link do conteúdo')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('imagem')
                .setDescription("A imagem que será exibida")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('O tipo do conteudo')
                .addChoices(
                    { name: 'Jogo', value: 'jogo' },
                    { name: 'DLC/Expansão', value: 'dlc' },
                ))
        .addStringOption(option =>
            option.setName('urgência')
                .setDescription('A urgência do anúncio')
                .addChoices(
                    { name: 'Normal', value: 'n' },
                    { name: 'Urgente', value: 'u' },
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        if (interaction.user.id !== "665002572926681128") return

        await interaction.deferReply()

        let entradas = interaction.options.data

        const item = {
            nome: null,
            tipo: null,
            link: null,
            preco: null,
            expira: null,
            urgencia: null,
            thumbnail: null
        }

        entradas.forEach(valor => {
            if (valor.name == "nome")
                item.nome = valor.value

            if (valor.name == "tipo")
                item.tipo = valor.value

            if (valor.name == "link")
                item.link = valor.value

            if (valor.name == "preço")
                item.preco = valor.value

            if (valor.name == "expiração")
                item.expira = valor.value

            if (valor.name == "urgência")
                item.urgencia = valor.value

            if (valor.name == "imagem")
                item.thumbnail = valor.attachment.attachment
        })

        if (item.tipo == null)
            item.tipo = "jogo"

        if (item.urgencia == null)
            item.urgencia = "n"

        const objetos_anunciados = [item]

        dispara_anuncio({ client, interaction, objetos_anunciados })
    }
}