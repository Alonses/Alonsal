const { SlashCommandBuilder } = require('discord.js')
const { getUser } = require("../../adm/database/schemas/User.js");

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('⌠👤⌡ Connect your social networks to Alonsal')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Link suas redes ao Alonsal',
            "es-ES": '⌠👤⌡ Conecta tus redes a Alonsal',
            "fr": '⌠👤⌡ Connectez vos réseaux à Alonsal',
            "it": '⌠👤⌡ Collega le tue reti ad Alonsal'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName('steam')
                .setDescription('⌠👤⌡ Link to Steam')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Linkar ao Steam',
                    "es-ES": '⌠👤⌡ Enlace a Steam',
                    "fr": '⌠👤⌡ Lien vers Steam',
                    "it": '⌠👤⌡ Collegati a Steam'
                })
                .addStringOption(option =>
                    option.setName("name")
                        .setNameLocalizations({
                            "pt-BR": 'nome',
                            "es-ES": 'nombre',
                            "fr": 'nom',
                            'it': 'nome'
                        })
                        .setDescription("Your name on the platform")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Seu nome na plataforma',
                            "es-ES": 'Tu nombre en la plataforma',
                            "fr": 'Votre nom sur la plateforme',
                            "it": 'Il tuo nome sulla piattaforma'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('lastfm')
                .setDescription('⌠👤⌡ Link to LastFM')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Linkar ao LastFM',
                    "es-ES": '⌠👤⌡ Enlace a LastFM',
                    "fr": '⌠👤⌡ Lien vers LastFM',
                    "it": '⌠👤⌡ Collegati a LastFM'
                })
                .addStringOption(option =>
                    option.setName("name")
                        .setNameLocalizations({
                            "pt-BR": 'nome',
                            "es-ES": 'nombre',
                            "fr": 'nom',
                            "it": "nome"
                        })
                        .setDescription("Your name on the platform")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Seu nome na plataforma',
                            "es-ES": 'Tu nombre en la plataforma',
                            "fr": 'Votre nom sur la plateforme',
                            "it": 'Il tuo nome sulla piattaforma'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('pula')
                .setDescription('⌠👤⌡ Link to Pula Prédios')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Linkar ao Pula Prédios',
                    "es-ES": '⌠👤⌡ Enlace a Pula Prédios',
                    "fr": '⌠👤⌡ Lien vers Pula Prédios',
                    "it": '⌠👤⌡ Collegati a Pula Prédios'
                })
                .addStringOption(option =>
                    option.setName("token")
                        .setDescription("Your unique token")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O seu token único',
                            "es-ES": 'Tu ficha única',
                            "fr": 'Votre jeton unique',
                            "it": 'Il tuo token unico'
                        })
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand
                .setName('locale')
                .setDescription('⌠👤⌡ Set a location')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Definir um local',
                    "es-ES": '⌠👤⌡ Establecer una ubicación',
                    "fr": '⌠👤⌡ Définir un emplacement',
                    "it": '⌠👤⌡ Impostare una posizione'
                })
                .addStringOption(option =>
                    option.setName("place")
                        .setNameLocalizations({
                            "pt-BR": 'local',
                            "es-ES": 'lugar',
                            'it': 'posto'
                        })
                        .setDescription("The location to always use")
                        .setDescriptionLocalizations({
                            "pt-BR": 'O Lugar a ser definido',
                            "es-ES": 'La ubicación para usar siempre',
                            "fr": 'Lieu d\'utilisation',
                            "it": 'La posizione da usare sempre'
                        })
                        .setRequired(true))),
    async execute(client, interaction) {

        const user = await getUser(interaction.user.id), emoji_dancando = client.emoji(emojis_dancantes)
        let plataforma = "steam", entrada = interaction.options.data[0].options[0].value

        if (interaction.options.getSubcommand() === "steam") // Linkando a Steam, LastFM e Pula Prédios ao usuário discord
            user.social.steam = entrada
        else if (interaction.options.getSubcommand() === "lastfm") {
            user.social.lastfm = entrada
            plataforma = "lastfm"
        } else if (interaction.options.getSubcommand() === "locale") {
            user.misc.locale = entrada
            plataforma = "locale"
        } else {
            user.social.pula_predios = entrada
            plataforma = "Pula prédios"
        }

        user.save();

        if (plataforma !== "locale")
            return interaction.reply({ content: `${emoji_dancando} | ${client.tls.phrase(client, interaction, "util.lastfm.new_link").replaceAll("plat_repl", plataforma.toLocaleLowerCase().split(" ")[0])}`, ephemeral: true })
        else // Link de local do /tempo
            return interaction.reply({ content: `${emoji_dancando} | ${client.tls.phrase(client, interaction, "util.tempo.new_link").replace("entrada_repl", entrada)}`, ephemeral: true })
    }
}