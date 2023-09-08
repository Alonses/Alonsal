const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("text")
        .setNameLocalizations({
            "es-ES": 'texto',
            "fr": 'texte',
            "it": 'testo',
            "pt-BR": 'texto',
            "ru": 'текст'
        })
        .setDescription("text operations")
        .addSubcommand(subcommand =>
            subcommand.setName("reverse")
                .setDescription("⌠😂⌡ (Un)invert characters!")
                .setDescriptionLocalizations({
                    "de": '⌠😂⌡ invertierte Zeichen!',
                    "es-ES": '⌠😂⌡ (Des)invertir caracteres!',
                    "fr": '⌠😂⌡ (Dé)inverser les caractères!',
                    "it": '⌠😂⌡ (Dis)invertire il testo!',
                    "pt-BR": '⌠😂⌡ (Des)inverta caracteres!',
                    "ru": '⌠😂⌡ Перевернуть текст!'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "pt-BR": 'texto',
                            "ru": 'текст'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "de": 'Schreibe etwas!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "pt-BR": 'Escreva algo!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("upper")
                .setDescription("⌠😂⌡ W R I T E  L I K E  T H A T  Q U I C K L Y")
                .setDescriptionLocalizations({
                    "de": '⌠😂⌡ S C H R E I B E N   S I E   D A S   S C H N E L L',
                    "es-ES": '⌠😂⌡ E S C R I B E  A S I  R A P I D O',
                    "fr": '⌠😂⌡ É C R I S  V I T E  C O M M E  Ç A',
                    "it": '⌠😂⌡ S C R I V I  V E L O C E M E N T E  C O N  Q U E S T O  S T I L E',
                    "pt-BR": '⌠😂⌡ E S C R E V A  A S S I M  R A P I D A M E N T E',
                    "ru": '⌠😂⌡ П И Ш И  Т А К  Б Ы С Т Р О'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "pt-BR": 'texto',
                            "ru": 'текст'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "de": 'Schreibe etwas!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "pt-BR": 'Escreva algo!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("sans")
                .setDescription("⌠😂⌡ WrItE LiKe tHaT QuIcKlY")
                .setDescriptionLocalizations({
                    "de": '⌠😂⌡ LaSsEn sIe dEn tExT So',
                    "es-ES": '⌠😂⌡ EsCrIbE AsI MuY RaPiDo',
                    "fr": '⌠😂⌡ ÉcRiVeZ CoMmE CeCi rApIdEmEnT',
                    "it": '⌠😂⌡ ScRiVi vElOcEmEnTe cOn qUeStO StIlE',
                    "pt-BR": '⌠😂⌡ EsCrEvA DeSsA FoRmA RaPidÃo',
                    "ru": '⌠😂⌡ ПиШи тАк бЫсТрО'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "pt-BR": 'texto',
                            "ru": 'текст'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "de": 'Schreibe etwas!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "pt-BR": 'Escreva algo!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("emoji")
                .setDescription("⌠😂⌡ Write🥶something🥶with🥶emojis")
                .setDescriptionLocalizations({
                    "de": '⌠😂⌡ Schreibe🥶etwas🥶mit🥶Emojis',
                    "es-ES": '⌠😂⌡ Escribe🥶algo🥶con🥶emojis',
                    "fr": '⌠😂⌡ Écrivez🥶quelque🥶chose🥶avec🥶emojis',
                    "it": '⌠😂⌡ Scrivi🥶qualcosa🥶con🥶emoji',
                    "pt-BR": '⌠😂⌡ Escreva🥶algo🥶com🥶emojis',
                    "ru": '⌠😂⌡ Напишите🥶что-нибудь🥶с🥶смайликами'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "pt-BR": 'texto',
                            "ru": 'текст'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "de": 'Schreibe etwas!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "pt-BR": 'Escreva algo!',
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
                            "de": 'Schreibe etwas!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "pt-BR": 'Escreva algo!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("counter")
                .setDescription("⌠😂⌡ Count characters in text")
                .setDescriptionLocalizations({
                    "de": '⌠😂⌡ Zeichen im Text zählen',
                    "es-ES": '⌠😂⌡ Contar caracteres en texto',
                    "fr": '⌠😂⌡ Compter les caractères dans le texte',
                    "it": '⌠😂⌡ Contare i caratteri nel testo',
                    "pt-BR": '⌠😂⌡ Conte caracteres no texto',
                    "ru": '⌠😂⌡ Считать символы в тексте'
                })
                .addStringOption(option =>
                    option.setName("text")
                        .setNameLocalizations({
                            "es-ES": 'texto',
                            "fr": 'texte',
                            "it": 'testo',
                            "pt-BR": 'texto',
                            "ru": 'текст'
                        })
                        .setDescription("Write something!")
                        .setDescriptionLocalizations({
                            "de": 'Schreibe etwas!',
                            "es-ES": '¡Escribe algo!',
                            "fr": 'Écris quelque chose!',
                            "it": 'Scrivi qualcosa!',
                            "pt-BR": 'Escreva algo!',
                            "ru": 'Напиши что-нибудь!'
                        })
                        .setRequired(true))),
    async execute(client, user, interaction) {

        let texto_entrada = interaction.options.getString("text") || interaction.options.getString("emoji")

        // Redirecionando para o subcomando respectivo
        require(`./subcommands/text_${interaction.options.getSubcommand()}`)({ client, user, interaction, texto_entrada })
    }
}