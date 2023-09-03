const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')

const { relation } = require('../../files/songs/faustop/songs.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("faustop")
        .setDescription("⌠😂⌡ Faustão\'s phrases")
        .addSubcommand(subcommand =>
            subcommand
                .setName("fala")
                .setDescription("⌠😂|🇧🇷⌡ Invoca uma fala aleatória do faustão"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("menu")
                .setDescription("⌠😂|🇧🇷⌡ Escolha uma fala do faustão")),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "fala") {

            const data = new Date()
            let num = client.random(client.countFiles("./files/songs/faustop", "ogg") - 1)

            if (data.getHours() === 20 && data.getMinutes() === 7)
                num = client.random(1, 1) > 1 ? 7 : 12

            const file = new AttachmentBuilder(`./files/songs/faustop/faustop_${num}.ogg`, { name: "faustop.ogg" })

            interaction.reply({
                files: [file],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
        } else {

            const data = {
                alvo: "faustop",
                values: relation
            }

            interaction.reply({
                content: client.tls.phrase(user, "menu.menus.escolher_frase", 6),
                components: [client.create_menus(client, interaction, user, data)],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
        }
    }
}