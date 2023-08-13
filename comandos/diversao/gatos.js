const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cats")
        .setNameLocalizations({
            "pt-BR": 'gatos',
            "es-ES": 'gatos',
            "fr": 'chats',
            "it": 'gatti',
            "ru": 'кошки'
        })
        .setDescription("⌠🐱⌡ Gatos!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🐱⌡ Gatos!',
            "es-ES": '⌠🐱⌡ Gatos!',
            "fr": '⌠🐱⌡ Chats!',
            "it": '⌠🐱⌡ Gatti!',
            "ru": '⌠🐱⌡ кошки!'
        }),
    async execute(client, user, interaction) {

        fetch(`https://api.thecatapi.com/v1/images/search?api_key=${process.env.key_catapi}`)
            .then(res => res.json())
            .then(res => {
                interaction.reply({
                    content: res[0].url,
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
            })
    }
}