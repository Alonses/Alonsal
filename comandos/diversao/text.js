const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("text")
        .setNameLocalizations({
            "pt-BR": 'texto',
            "es-ES": 'texto',
            "fr": 'texte',
            "it": 'testo',
            "ru": 'текст'
        })
        .setDescription("text operations")
        .addSubcommand(subcommand =>
            subcommand.setName("reverse")
                .setDescription("⌠😂⌡ (Un)invert characters!")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠😂⌡ (Des)inverta caracteres!',
                    "es-ES": '⌠😂⌡ (Des)invertir caracteres!',
                    "fr": '⌠😂⌡ (Dé)inverser les caractères!',
                    "it": '⌠😂⌡ (Dis)invertire il testo!',
                    "ru": '⌠😂⌡ Перевернуть текст!'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "pt-BR": 'texto',
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "ru": 'текст'
                        })
                        .setDescription("The text to be inverted")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O texto a ser invertido',
                            "es-ES": 'El texto a invertir',
                            "fr": 'Le texte à revenir',
                            "it": 'Il testo da invertire',
                            "ru": 'Текст, который нужно инвертировать'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("upper")
                .setDescription("⌠😂⌡ W R I T E  L I K E  T H A T  Q U I C K L Y")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠😂⌡ E S C R E V A  A S S I M  R A P I D A M E N T E',
                    "es-ES": '⌠😂⌡ E S C R I B E  A S I  R A P I D O',
                    "fr": '⌠😂⌡ É C R I S  V I T E  C O M M E  Ç A',
                    "it": '⌠😂⌡ S C R I V I  V E L O C E M E N T E  C O N  Q U E S T O  S T I L E',
                    "ru": '⌠😂⌡ П И Ш И  Т А К  Б Ы С Т Р О'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "pt-BR": 'texto',
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "ru": 'текст'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Escreva algo!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("sans")
                .setDescription("⌠😂⌡ WrItE LiKe tHaT QuIcKlY")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠😂⌡ EsCrEvA DeSsA FoRmA RaPidÃo',
                    "es-ES": '⌠😂⌡ EsCrIbE AsI MuY RaPiDo',
                    "fr": '⌠😂⌡ ÉcRiVeZ CoMmE CeCi rApIdEmEnT',
                    "it": '⌠😂⌡ ScRiVi vElOcEmEnTe cOn qUeStO StIlE',
                    "ru": '⌠😂⌡ ПиШи тАк бЫсТрО'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "pt-BR": 'texto',
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "ru": 'текст'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Escreva algo!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("emoji")
                .setDescription("⌠😂⌡ Write🥶something🥶with🥶emojis")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠😂⌡ Escreva🥶algo🥶com🥶emojis',
                    "es-ES": '⌠😂⌡ Escribe🥶algo🥶con🥶emojis',
                    "fr": '⌠😂⌡ Écrivez🥶quelque🥶chose🥶avec🥶emojis',
                    "it": '⌠😂⌡ Scrivi🥶qualcosa🥶con🥶emoji',
                    "ru": '⌠😂⌡ Напишите🥶что-нибудь🥶с🥶смайликами'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "pt-BR": 'texto',
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "ru": 'текст'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Escreva algo!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("emoji")
                        .setNameLocalizations({
                            "ru": 'эмодзи'
                        })
                        .setDescription("Choose one!")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Escolha algo!',
                            "es-ES": '¡Escoge uno!',
                            "fr": 'Choisissez-en un!',
                            "it": 'Scegline uno!',
                            "ru": 'Выбери один!'
                        })
                        .setRequired(true))),
    async execute(client, user, interaction) {

        let texto_entrada = interaction.options.data[0].options[0].value
        const operation = interaction.options.getSubcommand()

        // Inverte o texto enviado
        if (operation === "reverse") {
            interaction.reply({ content: texto_entrada.split('').reverse().join(""), ephemeral: user?.conf.ghost_mode || false })

            // Torna o texto nesse formato "A A A A A A"
        } else if (operation === "upper") {

            interaction.reply({ content: texto_entrada.toUpperCase().split('').join(" ").trim(), ephemeral: user?.conf.ghost_mode || false })

            // Torna o texto nesse formato "AaAaAaAaAaA"
        } else if (operation === "sans") {

            texto_entrada = texto_entrada.split("")

            for (let i = 0; i < texto_entrada.length; i++)
                if (i % 2 === 0 && i % 1 === 0)
                    texto_entrada[i] = texto_entrada[i].toLocaleUpperCase()
                else
                    texto_entrada[i] = texto_entrada[i].toLocaleLowerCase()

            interaction.reply({ content: texto_entrada.join(""), ephemeral: user?.conf.ghost_mode || false })

            // Torna o texto nesse formato "teste😂testado😂testadamente"
        } else if (operation === "emoji") {

            let emoji = interaction.options.data[0].options[1].value

            // Emoji customizado
            if (emoji.startsWith("<") && emoji.endsWith(">")) {
                const id = emoji.match(/\d{15,}/g)[0]

                emoji = client.emoji(id)

                return interaction.reply({ content: texto_entrada.replaceAll(" ", emoji), ephemeral: user?.conf.ghost_mode || false })
            }

            // Emoji padrão do discord
            interaction.reply({ content: texto_entrada.replaceAll(" ", emoji), ephemeral: user?.conf.ghost_mode || false })
        }
    }
}