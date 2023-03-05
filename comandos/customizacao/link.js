const { SlashCommandBuilder } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("⌠👤⌡ Connect your social networks to Alonsal")
        .addSubcommand(subcommand =>
            subcommand
                .setName("steam")
                .setDescription("⌠👤⌡ Link to Steam")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Linkar ao Steam',
                    "es-ES": '⌠👤⌡ Enlace a Steam',
                    "fr": '⌠👤⌡ Lien vers Steam',
                    "it": '⌠👤⌡ Collegati a Steam',
                    "ru": '⌠👤⌡ Ссылка на Steam'
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
                        .setDescription("Your name on the platform")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Seu nome na plataforma',
                            "es-ES": 'Tu nombre en la plataforma',
                            "fr": 'Votre nom sur la plateforme',
                            "it": 'Il tuo nome sulla piattaforma',
                            "ru": 'Ваше имя на платформе'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("lastfm")
                .setDescription("⌠👤⌡ Link to LastFM")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Linkar ao LastFM',
                    "es-ES": '⌠👤⌡ Enlace a LastFM',
                    "fr": '⌠👤⌡ Lien vers LastFM',
                    "it": '⌠👤⌡ Collegati a LastFM',
                    "ru": '⌠👤⌡ Ссылка на LastFM'
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
                        .setDescription("Your name on the platform")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Seu nome na plataforma',
                            "es-ES": 'Tu nombre en la plataforma',
                            "fr": 'Votre nom sur la plateforme',
                            "it": 'Il tuo nome sulla piattaforma',
                            "ru": 'Ваше имя на платформе'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("pula")
                .setDescription("⌠👤⌡ Link to Pula Prédios")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Linkar ao Pula Prédios',
                    "es-ES": '⌠👤⌡ Enlace a Pula Prédios',
                    "fr": '⌠👤⌡ Lien vers Pula Prédios',
                    "it": '⌠👤⌡ Collegati a Pula Prédios',
                    "ru": '⌠👤⌡ Ссылка на Pula Prédios'
                })
                .addStringOption(option =>
                    option.setName("token")
                        .setDescription("Your unique token")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O seu token único',
                            "es-ES": 'Tu ficha única',
                            "fr": 'Votre jeton unique',
                            "it": 'Il tuo token unico',
                            "ru": 'Ваш уникальный токен'
                        })
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand
                .setName("locale")
                .setDescription("⌠👤⌡ Set a location")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Definir um local',
                    "es-ES": '⌠👤⌡ Establecer una ubicación',
                    "fr": '⌠👤⌡ Définir un emplacement',
                    "it": '⌠👤⌡ Impostare una posizione',
                    "ru": '⌠👤⌡ Установить местоположение'
                })
                .addStringOption(option =>
                    option.setName("place")
                        .setNameLocalizations({
                            "pt-BR": 'local',
                            "es-ES": 'lugar',
                            "fr": 'mettre',
                            "it": 'posto',
                            "ru": 'место'
                        })
                        .setDescription("The location to always use")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O Lugar a ser definido',
                            "es-ES": 'La ubicación para usar siempre',
                            "fr": 'Lieu d\'utilisation',
                            "it": 'La posizione da usare sempre',
                            "ru": 'Место, которое необходимо определить'
                        })
                        .setRequired(true))),
    async execute(client, user, interaction) {

        let plataforma = "steam", entrada = interaction.options.data[0].options[0].value
        let link_comando = ""

        if (interaction.options.getSubcommand() === "steam") { // Linkando a Steam, LastFM e Pula Prédios ao usuário discord
            user.social.steam = entrada
            link_comando = "</steam:1018609879562334384>"
        } else if (interaction.options.getSubcommand() === "lastfm") {
            user.social.lastfm = entrada
            plataforma = "lastfm"
            link_comando = "</lastfm:1018609879512006796>"
        } else if (interaction.options.getSubcommand() === "locale") {
            user.misc.locale = entrada
            plataforma = "locale"
        } else {
            user.social.pula_predios = entrada
            plataforma = "Pula prédios"
            link_comando = "</pula:1023486895327555584>"
        }

        user.save()

        if (plataforma !== "locale")
            interaction.reply({ content: `${client.emoji(emojis_dancantes)} | ${client.tls.phrase(user, "util.lastfm.new_link").replaceAll("plat_repl", plataforma.toLocaleLowerCase().split(" ")[0]).replace("comando_repl", link_comando)}`, ephemeral: true })
        else // Link de local do /tempo
            interaction.reply({ content: `${client.emoji(emojis_dancantes)} | ${client.tls.phrase(user, "util.tempo.new_link").replace("entrada_repl", entrada)}`, ephemeral: true })
    }
}