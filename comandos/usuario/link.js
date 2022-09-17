const { SlashCommandBuilder } = require('discord.js')
const { existsSync, writeFileSync } = require('fs')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
const busca_emojis = require('../../adm/funcoes/busca_emoji')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('⌠👤⌡ Link suas redes ao Alonsal')
        .addSubcommand(subcommand =>
            subcommand
                .setName('steam')
                .setDescription('⌠😂⌡ Summons a rasputia gif')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠😂⌡ Linkar a Steam',
                    "fr": '⌠😂⌡ Invoque un rasputia gif'
                })
                .addStringOption(option =>
                    option.setName("nome")
                        .setDescription("Seu nome na plataforma")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('lastfm')
                .setDescription('⌠😂⌡ Summons a rasputia gif')
                .setDescriptionLocalizations({
                    "pt-BR": '⌠😂⌡ Linkar o LastFM',
                    "fr": '⌠😂⌡ Invoque un rasputia gif'
                })
                .addStringOption(option =>
                    option.setName("nome")
                        .setDescription("Seu nome na plataforma")
                        .setRequired(true))),
    async execute(client, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)

        const user = {
            id: interaction.user.id,
            lang: null,
            steam: null,
            lastfm: null
        }

        if (existsSync(`./arquivos/data/user/${user.id}.json`)) {
            delete require.cache[require.resolve(`../../arquivos/data/user/${user.id}.json`)]
            const { lang, steam, lastfm } = require(`../../arquivos/data/user/${user.id}.json`)

            user.lang = lang
            user.steam = steam
            user.lastfm = lastfm
        }

        let plataforma = "steam", entrada = interaction.options.data[0].options[0].value
        const emoji_dancando = busca_emojis(client, emojis_dancantes)

        if (interaction.options.getSubcommand() === "steam") // Linkando a Steam e o LastFM ao usuário discord
            user.steam = entrada
        else {
            user.lastfm = entrada
            plataforma = "lastfm"
        }

        writeFileSync(`./arquivos/data/user/${user.id}.json`, JSON.stringify(user))
        delete require.cache[require.resolve(`../../arquivos/data/user/${user.id}.json`)]

        return interaction.reply({ content: `${emoji_dancando} | O Alonsal foi vinculado a sua conta \`${plataforma}\`! Agora ao usar \`/${plataforma}\` você não precisará escrever seu nome toda hora :P`, ephemeral: true })
    }
}