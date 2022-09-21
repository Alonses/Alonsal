const { SlashCommandBuilder } = require('discord.js')
const { existsSync, writeFileSync } = require('fs')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
const busca_emojis = require('../../adm/discord/busca_emoji')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('⌠👤⌡ Link suas redes ao Alonsal')
        .addSubcommand(subcommand =>
            subcommand
                .setName('steam')
                .setDescription('⌠👤⌡ Link to Steam')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Linkar ao Steam',
                    "es-ES": '⌠👤⌡ Enlace a Steam',
                    "fr": '⌠👤⌡ Lien vers Steam'
                })
                .addStringOption(option =>
                    option.setName("name")
                        .setNameLocalizations({
                            "pt-BR": 'nome',
                            "es-ES": 'nombre',
                            "fr": 'nom'
                        })
                        .setDescription("Your name on the platform")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Seu nome na plataforma',
                            "es-ES": 'Tu nombre en la plataforma',
                            "fr": 'Votre nom sur la plateforme'
                        })
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('lastfm')
                .setDescription('⌠👤⌡ Link to LastFM')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Linkar ao LastFM',
                    "es-ES": '⌠👤⌡ Enlace a LastFM',
                    "fr": '⌠👤⌡ Lien vers LastFM'
                })
                .addStringOption(option =>
                    option.setName("name")
                        .setNameLocalizations({
                            "pt-BR": 'nome',
                            "es-ES": 'nombre',
                            "fr": 'nom'
                        })
                        .setDescription("Your name on the platform")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Seu nome na plataforma',
                            "es-ES": 'Tu nombre en la plataforma',
                            "fr": 'Votre nom sur la plateforme'
                        })
                        .setRequired(true))),
    async execute(client, interaction) {

        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id)

        let plataforma = "steam", entrada = interaction.options.data[0].options[0].value
        const emoji_dancando = busca_emojis(client, emojis_dancantes)

        if (interaction.options.getSubcommand() === "steam") // Linkando a Steam e o LastFM ao usuário discord
            user.steam = entrada
        else {
            user.lastfm = entrada
            plataforma = "lastfm"
        }

        client.usuarios.saveUser(user)

        return interaction.reply({ content: `${emoji_dancando} | ${utilitarios[20]["new_link"].replaceAll("plat_repl", plataforma)}`, ephemeral: true })
    }
}