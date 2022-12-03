const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { getUser } = require("../../adm/database/schemas/User.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nazar')
        .setDescription('⌠🎲⌡ Madame Nazar\'s location today')
        .setDescriptionLocalizations({
            "pt-BR": "⌠🎲⌡ Mostra onde a Madame Nazar se encontra hoje",
            "es-ES": "⌠🎲⌡ Ubicación de Madame Nazar hoy",
            "fr": "⌠🎲⌡ Emplacement de Madame Nazar aujourd'hui",
            "it": "⌠🎲⌡ La location di Madame Nazar oggi"
        }),
    async execute(client, interaction) {

        const user = await getUser(interaction.user.id)

        fetch('https://madam-nazar-location-api.herokuapp.com/location/current')
            .then(res => res.json())
            .then(dados => {

                dados = dados.data

                const embed = new EmbedBuilder()
                    .setTitle("> :wind_chime: Madame Nazar hoje")
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(`A Madame Nazar se encontra hoje na região de \n\`${dados.location.region.name}\`, em \`${dados.location.region.precise}\`\n\n:round_pushpin: Próximo a \`${dados.location.near_by[0]}\` e \`${dados.location.near_by[1]}\``)
                    .setImage(dados.location.image)

                interaction.reply({ embeds: [embed], ephemeral: true })
            })
            .catch(() => {
                interaction.reply({ content: ":mag: | Não foi possível localizar a Madame Nazar no momento, por favor, tente novamente mais tarde", ephemeral: true })
            })
    }
}