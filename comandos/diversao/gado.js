const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cattle')
        .setNameLocalizations({
            "pt-BR": 'gado',
            "es-ES": 'ganado',
            "fr": 'betail',
            "it": 'bestiame'
        })
        .setDescription('⌠😂⌡ Test someone\'s horn size')
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ Teste a gadisse de alguém',
            "es-ES": '⌠😂⌡ Prueba el tamaño del cuerno de alguien',
            "fr": '⌠😂⌡ Testez la taille de la corne de quelqu\'un',
            "it": '⌠😂⌡ Metti alla prova il gadisse di qualcuno'
        })
        .addUserOption(option =>
            option.setName('user')
                .setNameLocalizations({
                    "pt-BR": 'usuario',
                    "es-ES": 'usuario',
                    "fr": 'user',
                    "it": 'utente'
                })
                .setDescription('Mention a user as a target')
                .setDescriptionLocalizations({
                    "pt-BR": 'Marque outro usuário como alvo',
                    "es-ES": 'Mencionar a otro usuario',
                    "fr": 'Mentionner un utilisateur comme cible',
                    "it": 'Menziona un altro utente'
                })
                .setRequired(true)),
    async execute(client, interaction) {

        let idioma_definido = client.idioma.getLang(interaction)
        if (idioma_definido === "al-br") idioma_definido = "pt-br"

        const alvo = interaction.options.getUser('user')

        if (client.id() === alvo.id)
            return client.tls.reply(client, interaction, "dive.gado.error_2")

        // Lista de frases de gado
        const { gadisissimo } = require(`../../arquivos/json/text/${idioma_definido}/gado.json`)
        const num = Math.round((gadisissimo.length - 1) * Math.random())

        if (alvo.id !== interaction.user.id)
            if (idioma_definido === "pt-br")
                interaction.reply(`O <@${alvo.id}> ${gadisissimo[num]}`)
            else
                interaction.reply(`The <@${alvo.id}> ${gadisissimo[num]}`)
        else
            if (idioma_definido === "pt-br")
                interaction.reply(`Você ${interaction.user} ${gadisissimo[num]}`)
            else
                interaction.reply(`You ${interaction.user} ${gadisissimo[num]}`)
    }
}