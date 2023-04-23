const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("⌠💂⌡ Add emojis and stickers to the server")
        .addSubcommand(subcommand =>
            subcommand
                .setName("emoji")
                .setDescription("⌠💂⌡ Add an emoji")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Adicionar um emoji',
                    "es-ES": '⌠💂⌡ Agrega un emoji',
                    "fr": '⌠💂⌡ Ajouter un emoji',
                    "it": '⌠💂⌡ Aggiungi un\'emoji',
                    "ru": '⌠💂⌡ Добавить смайлик'
                })
                .addStringOption(option =>
                    option.setName("name")
                        .setNameLocalizations({
                            "pt-BR": 'nome',
                            "es-ES": 'nombre',
                            "fr": 'nom',
                            "it": 'nome',
                            "ru": 'имя'
                        })
                        .setDescription("The name of the new emoji")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O nome do novo emoji',
                            "es-ES": 'El nombre del nuevo emoji.',
                            "fr": 'Le nom du nouvel emoji',
                            "it": 'Il nome della nuova emoji',
                            "ru": 'Название нового смайлика'
                        })
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("emoji")
                        .setDescription("Emoji from another server")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Emoji de outro servidor',
                            "es-ES": 'Emoji de otro servidor',
                            "fr": 'Emoji d\'un autre serveur',
                            "it": 'Emoji da un altro server',
                            "ru": 'Эмодзи с другого сервера'
                        }))
                .addAttachmentOption(option =>
                    option.setName("file")
                        .setNameLocalizations({
                            "pt-BR": 'arquivo',
                            "es-ES": 'archivo',
                            "fr": 'dossier',
                            "it": 'file',
                            "ru": 'архив'
                        })
                        .setDescription("Attach an image")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Anexe uma imagem',
                            "es-ES": 'Adjuntar una imagen',
                            "fr": 'Joindre une image',
                            "it": 'Allegare un\'immagine',
                            "ru": 'Прикрепить изображение'
                        })))
        .addSubcommand(subcommand =>
            subcommand
                .setName("sticker")
                .setNameLocalizations({
                    "pt-BR": 'figurinha',
                    "es-ES": 'cifra',
                    "fr": 'chiffre',
                    "it": 'figura',
                    "ru": 'фигура'
                })
                .setDescription("⌠💂⌡ Add a sticker")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Adicionar uma figurinha',
                    "es-ES": '⌠💂⌡ Agrega una pegatina',
                    "fr": '⌠💂⌡ Ajouter un autocollant',
                    "it": '⌠💂⌡ Aggiungi un adesivo',
                    "ru": '⌠💂⌡ Добавить наклейку'
                })
                .addStringOption(option =>
                    option.setName("nome")
                        .setNameLocalizations({
                            "pt-BR": 'nome',
                            "es-ES": 'nombre',
                            "fr": 'nom',
                            "it": 'nome',
                            "ru": 'имя'
                        })
                        .setDescription("The name of the new sticker")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O nome da nova figurinha',
                            "es-ES": 'El nombre de la nueva figura',
                            "fr": 'Le nom de la nouvelle figurine',
                            "it": 'Il nome della nuova figura',
                            "ru": 'Имя новой фигуры'
                        })
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("category")
                        .setNameLocalizations({
                            "pt-BR": 'categoria',
                            "es-ES": 'categoria',
                            "fr": 'categorie',
                            "it": 'categoria',
                            "ru": 'категория'
                        })
                        .setDescription("A brief description...")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Uma breve descrição...',
                            "es-ES": 'Una breve descripción...',
                            "fr": 'Une brève description...',
                            "it": 'Una breve descrizione...',
                            "ru": 'Короткое описание...'
                        })
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
                        .setDescription("Attach an image")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Anexe uma imagem',
                            "es-ES": 'Adjuntar una imagen',
                            "fr": 'Joindre une image',
                            "it": 'Allegare un\'immagine',
                            "ru": 'Прикрепить изображение'
                        })
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
    async execute(client, user, interaction) {

        const membro_sv = await client.getUserGuild(interaction, client.id())

        // Verificando se o bot pode gerenciar emojis e stickers
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers))
            // return client.tls.reply(interaction, user, "mode.clear.permissao_2", true, 0)
            return client.tls.reply(interaction, user, "mode.emojis.permissao", true, 3)

        // Coletando todas as entradas
        const dados = {
            nome: interaction.options.getString("name"),
            personalizado: interaction.options.getString("emoji"),
            categoria: interaction.options.getString("category"),
            url: interaction.options.getAttachment("file")
        }

        // Verificando se um arquivo customizado foi inserido
        if (dados.url)
            dados.url = dados.url.attachment

        // Verificando se foi informado uma URL ou uma entrada customizada
        if (!dados.url && !dados.personalizado)
            return client.tls.reply(interaction, user, "mode.emojis.aviso_1", true, 2)

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
                                if (image.status === 415) dados.url = dados.url.replace(".gif", ".png")

                                criar_item(dados, interaction, client, user)
                            })
                    } else
                        return client.tls.reply(interaction, user, "mode.emojis.emoji_custom", true, 2)
                } catch {
                    return client.tls.reply(interaction, user, "mode.emojis.emoji_custom", true, 2)
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
            .then(emoji => interaction.reply({ content: client.replace(`${emoji} | ${client.tls.phrase(user, "mode.emojis.emoji_criado")}`, dados.nome), ephemeral: true }))
            .catch(err => {

                if (err.rawError.code === 50045)
                    return client.tls.reply(interaction, user, "mode.emojis.emoji_size", true, 0)

                if (err.rawError.code === 30008) // Máximos de emojis
                    return client.tls.reply(interaction, user, "mode.emojis.emoji_max", true, 0)

                return client.tls.reply(interaction, user, "mode.emojis.emoji_error", true, 0)
            })
    } else { // Criando uma figurinha

        interaction.guild.stickers.create({ file: dados.url, name: dados.nome, tags: dados.categoria })
            .then(() => interaction.reply({ content: client.replace(client.tls.phrase(user, "mode.emojis.figurinha_criada"), dados.nome), ephemeral: true }))
            .catch(err => {

                if (err.rawError.code === 50045)
                    return client.tls.reply(interaction, user, "mode.emojis.sticker_size", true, 0)

                if (err.rawError.code === 30039) // Máximo de figurinhas
                    return client.tls.reply(interaction, user, "mode.emojis.sticker_max", true, 0)

                return client.tls.reply(interaction, user, "mode.emojis.sticker_error", true, 0)
            })
    }
}