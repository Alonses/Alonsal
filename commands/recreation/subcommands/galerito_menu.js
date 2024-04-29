const { relation } = require('../../../files/songs/galerito/songs.json')

module.exports = async ({ client, user, interaction }) => {

    const data = {
        title: { tls: "Escolha uma frase do galerito e cia!" },
        alvo: "galerito",
        values: relation
    }

    interaction.reply({
        content: client.tls.phrase(user, "menu.menus.escolher_frase", 6),
        components: [client.create_menus({ client, interaction, user, data })],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}