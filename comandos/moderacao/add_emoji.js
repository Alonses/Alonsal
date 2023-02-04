const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("⌠💂⌡ Add emojis and stickers to the server")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ Adicione emojis e figurinhas ao servidor'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName("emoji")
                .setDescription("⌠💂⌡ Adicionar um emoji")
                .addStringOption(option =>
                    option.setName("nome")
                        .setDescription("O nome do novo emoji")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("emoji")
                        .setDescription("Emoji de outro servidor"))
                .addAttachmentOption(option =>
                    option.setName("file")
                        .setNameLocalizations({
                            "pt-BR": 'arquivo',
                            "es-ES": 'archivo',
                            "fr": 'dossier',
                            "it": 'file',
                            "ru": 'архив'
                        })
                        .setDescription("Attach files if needed")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Anexe uma imagem'
                        })))
        .addSubcommand(subcommand =>
            subcommand
                .setName("figurinha")
                .setDescription("⌠💂⌡ Adicionar uma figurinha")
                .addStringOption(option =>
                    option.setName("nome")
                        .setDescription("O nome da nova figurinha")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("categoria")
                        .setDescription("Uma descrição breve...")
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName("file")
                        .setNameLocalizations({
                            "pt-BR": 'arquivo',
                            "es-ES": 'archivo',
                            "fr": 'dossier',
                            "it": 'file',
                            "ru": 'архив'
                        })
                        .setDescription("Attach files if needed")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Anexe uma imagem'
                        })
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
    async execute(client, user, interaction) {

        const membro_sv = await interaction.guild.members.cache.get(client.id())

        // Verificando se o bot pode gerenciar emojis e stickers
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers))
            // return client.tls.reply(interaction, user, "mode.clear.permissao_2", true, 0)
            return interaction.reply({ content: "Eu não posso gerenciar os emojis e figurinhas deste servidor.", ephemeral: true })

        const entradas = interaction.options.data[0].options

        const dados = {
            nome: null,
            personalizado: null,
            categoria: null,
            url: null
        }

        // Coletando todas as entradas
        entradas.forEach(valor => {

            if (valor.name == "nome")
                dados.nome = valor.value

            if (valor.name == "emoji") // Emoji personalizado
                dados.personalizado = valor.value

            if (valor.name == "file")
                dados.url = valor.attachment.url

            if (valor.name == "categoria") // Categoria para a figurinha
                dados.categoria = valor.value
        })

        // Verificando se foi informado uma URL ou uma entrada customizada
        if (!dados.url && !dados.personalizado)
            return interaction.reply({ content: ":warning: | Insira um arquivo de imagem um mencione um emoji para usar esse comando!", ephemeral: true })

        // Criando emojis
        if (interaction.options.getSubcommand() === "emoji") {

            // Verificando se o emoji mencionado é válido
            if (dados.personalizado) {
                try {
                    if (dados.personalizado.startsWith("<") && dados.personalizado.endsWith(">")) {
                        const id = dados.personalizado.match(/\d{15,}/g)[0]
                        dados.url = `https://cdn.discordapp.com/emojis/${id}.gif`

                        fetch(dados.url)
                            .then(image => {

                                // Validando se a imagem do emoji é um gif
                                if (image.status == 415) dados.url = dados.url.replace(".gif", ".png")

                                criar_item(dados, interaction, client, user)
                            })
                    } else
                        return interaction.reply({ content: ":warning: | Informe um emoji customizado para adicionar", ephemeral: true })
                } catch (err) {
                    return interaction.reply({ content: ":warning: | Informe um emoji customizado para adicionar", ephemeral: true })
                }
            } else
                criar_item(dados, interaction, client, user)

        } else // Criando figurinhas
            criar_item(dados, interaction, client, user)
    }
}

function criar_item(dados, interaction, client, user) {

    // Criando um emoji
    if (!dados.categoria) {
        interaction.guild.emojis.create({ attachment: dados.url, name: dados.nome })
            .then(emoji => interaction.reply({ content: `${emoji} | Emoji \`${emoji.name}\` criado com sucesso!`, ephemeral: true }))
            .catch(err => {

                if (err.rawError.code == 30008) // Máximos de emojis
                    return interaction.reply({ content: ":octagonal_sign: | O número máximo de emojis para este servidor foi atingido", ephemeral: true })

                interaction.reply({ content: ":octagonal_sign: | Não foi possível criar o emoji", ephemeral: true })
            })
    } else { // Criando uma figurinha

        interaction.guild.stickers.create({ file: dados.url, name: dados.nome, tags: dados.categoria })
            .then(sticker => interaction.reply({ content: `Figurinha \`${sticker.name}\` criada com sucesso!`, ephemeral: true }))
            .catch(err => {
                if (err.rawError.code == 30039) // Máximo de figurinhas
                    return interaction.reply({ content: ":octagonal_sign: | O número máximo de figurinhas para este servidor foi atingido", ephemeral: true })

                interaction.reply({ content: ':octagonal_sign: | Não foi possível criar a figurinha', ephemeral: true })
            })
    }
}