const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cattle")
        .setNameLocalizations({
            "pt-BR": 'gado',
            "es-ES": 'ganado',
            "fr": 'betail',
            "it": 'bestiame'
        })
        .setDescription("⌠😂⌡ Test someone\'s horn size")
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Teste a gadisse de alguém',
            "es-ES": '⌠😂⌡ Prueba el tamaño del cuerno de alguien',
            "fr": '⌠😂⌡ Testez la taille de la corne de quelqu\'un',
            "it": '⌠😂⌡ Metti alla prova il gadisse di qualcuno'
        })
        .addUserOption(option =>
            option.setName("user")
                .setNameLocalizations({
                    "de": 'benutzer',
                    "es-ES": 'usuario',
                    "it": 'utente',
                    "pt-BR": 'usuario',
                    "ru": 'пользователь'
                })
                .setDescription("Mention a user")
                .setDescriptionLocalizations({
                    "de": 'Erwähnen Sie einen anderen Benutzer',
                    "es-ES": 'Mencionar a otro usuario',
                    "fr": 'Mentionner un utilisateur',
                    "it": 'Menziona un altro utente',
                    "pt-BR": 'Mencione outro usuário',
                    "ru": 'Упомянуть другого пользователя'
                })
                .setRequired(true)),
    async execute(client, user, interaction) {

        let idioma_definido = client.idioma.getLang(interaction)
        if (idioma_definido === "al-br") idioma_definido = "pt-br"

        const alvo = interaction.options.getUser("user")

        if (client.id() === alvo.id)
            return client.tls.reply(interaction, user, "dive.gado.error_2", true, 2)

        // Lista de frases de gado
        const { gadisissimo } = require(`../../arquivos/json/text/${idioma_definido}/gado.json`)
        const num = client.random(gadisissimo)

        if (alvo.id !== interaction.user.id)
            if (idioma_definido === "pt-br")
                interaction.reply({
                    content: `O <@${alvo.id}> ${gadisissimo[num]}`,
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
            else
                interaction.reply({
                    content: `The <@${alvo.id}> ${gadisissimo[num]}`,
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
        else
            if (idioma_definido === "pt-br")
                interaction.reply({
                    content: `Você ${interaction.user} ${gadisissimo[num]}`,
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
            else
                interaction.reply({
                    content: `You ${interaction.user} ${gadisissimo[num]}`,
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
    }
}