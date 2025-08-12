const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nazar")
        .setDescription("⌠🎲⌡ Madame Nazar's location today")
        .setDescriptionLocalizations({
            "de": '⌠🎲⌡ Zeigt, wo Madam Nazar heute ist',
            "es-ES": '⌠🎲⌡ Ubicación de Madame Nazar hoy',
            "fr": '⌠🎲⌡ Emplacement de Madame Nazar aujourd\'hui',
            "it": '⌠🎲⌡ La location di Madame Nazar oggi',
            "pt-BR": '⌠🎲⌡ Mostra onde a Madame Nazar se encontra hoje',
            "ru": '⌠🎲⌡ Показывает, где сегодня находится мадам Назар'
        }),
    async execute({ client, user, interaction }) {

        fetch("https://madam-nazar-location-api.herokuapp.com/location/current")
            .then(res => res.json())
            .then(dados => {

                dados = dados.data

                const embed = client.create_embed({
                    title: `> ${client.tls.phrase(user, "game.nazar.titulo")}`,
                    image: dados.location.image,
                    description: {
                        tls: "game.nazar.descricao",
                        replace: [dados.location.region.name, dados.location.region.precise, dados.location.near_by[0], dados.location.near_by[1]]
                    }
                }, user)

                client.reply(interaction, {
                    embeds: [embed],
                    flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
                })
            })
            .catch(() => client.tls.reply(interaction, user, "game.nazar.error_1", true, 1))
    }
}