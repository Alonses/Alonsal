const { relation } = require('../../../files/songs/faustop/songs.json')

module.exports = async ({ client, user, interaction }) => {

    const data = {
        alvo: "faustop",
        values: relation
    }

    interaction.reply({
        content: client.tls.phrase(user, "menu.menus.escolher_frase", 6),
        components: [client.create_menus({ client, interaction, user, data })],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}