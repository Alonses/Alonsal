const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("⌠👤⌡ Connect your social networks to Alonsal")
        .addSubcommand(subcommand =>
            subcommand
                .setName("steam")
                .setDescription("⌠👤⌡ Link to Steam")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡Link zu Steam',
                    "es-ES": '⌠👤⌡ Enlace a Steam',
                    "fr": '⌠👤⌡ Lien vers Steam',
                    "it": '⌠👤⌡ Collegati a Steam',
                    "pt-BR": '⌠👤⌡ Linkar ao Steam',
                    "ru": '⌠👤⌡ Ссылка на Steam'
                })
                .addStringOption(option =>
                    option.setName("name")
                        .setNameLocalizations({
                            "es-ES": 'nombre',
                            "fr": 'nom',
                            "it": 'nome',
                            "pt-BR": 'nome',
                            "ru": 'имя'
                        })
                        .setDescription("Your name on the platform")
                        .setDescriptionLocalizations({
                            "de": 'Ihr Name auf der Plattform',
                            "es-ES": 'Tu nombre en la plataforma',
                            "fr": 'Votre nom sur la plateforme',
                            "it": 'Il tuo nome sulla piattaforma',
                            "pt-BR": 'Seu nome na plataforma',
                            "ru": 'Ваше имя на платформе'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("lastfm")
                .setDescription("⌠👤⌡ Link to LastFM")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡ Link zu LastFM',
                    "es-ES": '⌠👤⌡ Enlace a LastFM',
                    "fr": '⌠👤⌡ Lien vers LastFM',
                    "it": '⌠👤⌡ Collegati a LastFM',
                    "pt-BR": '⌠👤⌡ Linkar ao LastFM',
                    "ru": '⌠👤⌡ Ссылка на LastFM'
                })
                .addStringOption(option =>
                    option.setName("name")
                        .setNameLocalizations({
                            "es-ES": 'nombre',
                            "fr": 'nom',
                            "it": 'nome',
                            "pt-BR": 'nome',
                            "ru": 'имя'
                        })
                        .setDescription("Your name on the platform")
                        .setDescriptionLocalizations({
                            "de": 'Ihr Name auf der Plattform',
                            "es-ES": 'Tu nombre en la plataforma',
                            "fr": 'Votre nom sur la plateforme',
                            "it": 'Il tuo nome sulla piattaforma',
                            "pt-BR": 'Seu nome na plataforma',
                            "ru": 'Ваше имя на платформе'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("pula")
                .setDescription("⌠👤⌡ Link to Pula Prédios")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡ Link zu Pula-Gebäuden',
                    "es-ES": '⌠👤⌡ Enlace a Pula Prédios',
                    "fr": '⌠👤⌡ Lien vers Pula Prédios',
                    "it": '⌠👤⌡ Collegati a Pula Prédios',
                    "pt-BR": '⌠👤⌡ Linkar ao Pula Prédios',
                    "ru": '⌠👤⌡ Ссылка на Pula Prédios'
                })
                .addStringOption(option =>
                    option.setName("token")
                        .setDescription("Your unique token")
                        .setDescriptionLocalizations({
                            "de": 'Ihr einzigartiger Token',
                            "es-ES": 'Tu ficha única',
                            "fr": 'Votre jeton unique',
                            "it": 'Il tuo token unico',
                            "pt-BR": 'O seu token único',
                            "ru": 'Ваш уникальный токен'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("locale")
                .setDescription("⌠👤⌡ Set a location")
                .setDescriptionLocalizations({
                    "de": '⌠👤⌡ Legen Sie einen Standort fest',
                    "es-ES": '⌠👤⌡ Establecer una ubicación',
                    "fr": '⌠👤⌡ Définir un emplacement',
                    "it": '⌠👤⌡ Impostare una posizione',
                    "pt-BR": '⌠👤⌡ Definir um local',
                    "ru": '⌠👤⌡ Установить местоположение'
                })
                .addStringOption(option =>
                    option.setName("place")
                        .setNameLocalizations({
                            "de": 'lokal',
                            "es-ES": 'lugar',
                            "fr": 'mettre',
                            "it": 'posto',
                            "pt-BR": 'local',
                            "ru": 'место'
                        })
                        .setDescription("The location to always use")
                        .setDescriptionLocalizations({
                            "de": 'Der zu definierende Standort',
                            "es-ES": 'La ubicación para usar siempre',
                            "fr": 'Lieu d\'utilisation',
                            "it": 'La posizione da usare sempre',
                            "pt-BR": 'O Lugar a ser definido',
                            "ru": 'Место, которое необходимо определить'
                        })
                        .setRequired(true))),
    async execute(client, user, interaction) {

        let plataforma = "steam", entrada = interaction.options.getString("name") || interaction.options.getString("token") || interaction.options.getString("place")
        let link_comando = "", invalido = false

        if (interaction.options.getSubcommand() === "steam") { // Linkando a Steam, LastFM e Pula Prédios ao usuário discord

            user.social.steam = entrada
            link_comando = "</steam:1018609879562334384>"

            await interaction.deferReply({
                ephemeral: true
            })

            // Verificando se o local existe antes de salvar
            await fetch(`https://steamcommunity.com/id/${user.social.steam}`)
                .then(response => response.text())
                .then(async res => {

                    if (res.includes("The specified profile could not be found.")) {
                        interaction.editReply({
                            content: client.tls.phrase(user, "util.steam.nome_invalido", 1),
                            ephemeral: true
                        })
                        invalido = true
                    }
                })
        } else if (interaction.options.getSubcommand() === "lastfm") {
            user.social.lastfm = entrada
            plataforma = "lastfm"
            link_comando = "</lastfm:1018609879512006796>"
        } else if (interaction.options.getSubcommand() === "locale") {

            await interaction.deferReply({
                ephemeral: true
            })

            user.misc.locale = entrada
            plataforma = "locale"

            // Verificando se o local existe antes de salvar
            await fetch(`${process.env.url_weather}appid=${process.env.key_weather}&q=${user.misc.locale}&units=metric&lang=pt`)
                .then(response => response.json())
                .then(async res => {

                    if (res.cod === '404') {
                        interaction.editReply({
                            content: client.tls.phrase(user, "util.tempo.sem_local", 1),
                            ephemeral: true
                        })
                        invalido = true
                    }
                })
        } else {
            user.social.pula_predios = entrada
            plataforma = "Pula prédios"
            link_comando = "</pula:1023486895327555584>"
        }

        if (!invalido) {
            await user.save()

            if (plataforma !== "locale")
                client.tls.reply(interaction, user, "util.lastfm.new_link", true, client.emoji("emojis_dancantes"), [plataforma.toLocaleLowerCase().split(" ")[0], link_comando])
            else // Link de local do /tempo
                interaction.editReply({
                    content: client.replace(client.tls.phrase(user, "util.tempo.new_link", client.emoji("emojis_dancantes")), entrada),
                    ephemeral: true
                })
        }
    }
}