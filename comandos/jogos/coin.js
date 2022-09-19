const { SlashCommandBuilder } = require('discord.js')
const busca_emoji = require('../../adm/discord/busca_emoji')
const { emojis, emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('⌠🎲⌡ Jogue cara ou coroa')
        .addStringOption(option =>
            option.setName('escolha')
                .setDescription('Cara ou coroa?')
                .addChoices(
                    { name: '🟡', value: '0' },
                    { name: '👑', value: '1' }
                )
                .setRequired(true)),
    async execute(client, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        const { jogos } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

        const escolha = parseInt(interaction.options.data[0].value)

        const emoji_epic_embed_fail = busca_emoji(client, emojis.epic_embed_fail2)
        const emoji_dancando = busca_emoji(client, emojis_dancantes)

        const moeda = Math.round(Math.random())
        let emoji_exib = ":coin:"

        if (moeda === 1)
            emoji_exib = ":crown:"

        let resultado = `[ ${emoji_exib} ] ${jogos[1]["acertou"]} ${emoji_dancando}`

        if (escolha != moeda) // Acertou
            resultado = `[ ${emoji_exib} ] ${jogos[1]["errou"]} ${emoji_epic_embed_fail}`

        return interaction.reply(resultado)
    }
}