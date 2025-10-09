const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

module.exports = async ({ client, user, interaction, user_command }) => {

    fetch(`${process.env.url_apisal}/random?rasputia`)
        .then(response => response.json())
        .then(async res => {

            const embed = client.create_embed({
                title: res.nome,
                thumbnail: res.foto,
                description: `- "${res.texto}"`
            }, user)

            interaction.reply({
                embeds: [embed],
                flags: client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
            })
        })
}