const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nazar")
        .setDescription("⌠🎲⌡ Madame Nazar's location today")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Mostra onde a Madame Nazar se encontra hoje',
            "es-ES": '⌠🎲⌡ Ubicación de Madame Nazar hoy',
            "fr": '⌠🎲⌡ Emplacement de Madame Nazar aujourd\'hui',
            "it": '⌠🎲⌡ La location di Madame Nazar oggi',
            "ru": '⌠🎲⌡ Показывает, где сегодня находится мадам Назар'
        }),
    async execute(client, user, interaction) {

        fetch('https://madam-nazar-location-api.herokuapp.com/location/current')
            .then(res => res.json())
            .then(dados => {

                dados = dados.data

                const embed = new EmbedBuilder()
                    .setTitle(`> ${client.tls.phrase(user, "game.nazar.titulo")}`)
                    .setColor(client.embed_color(user.misc.color))
                    .setDescription(`${client.tls.phrase(user, "game.nazar.descricao").replace("regiao_repl", dados.location.region.name).replace("preciso_repl", dados.location.region.precise).replace("proximo_repl", dados.location.near_by[0]).replace("proximo_2_repl", dados.location.near_by[1])}`)
                    .setImage(dados.location.image)

                interaction.reply({ embeds: [embed], ephemeral: user?.conf.ghost_mode || false })
            })
            .catch(() => {
                client.tls.reply(interaction, user, "game.nazar.error_1", true, 1)
            })
    }
}