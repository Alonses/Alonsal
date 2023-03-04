const { SlashCommandBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_ignore_user")
        .setDescription("⌠🤖⌡ Desliga respostas do bot para determinado usuário")
        .addStringOption(option =>
            option.setName("usuario")
                .setDescription("O ID do usuário")
                .setRequired(true)),
    async execute(client, user, interaction) {

        if (interaction.user.id !== client.owners[0]) return

        let user_alvo = await client.getUser(interaction.options.data[0].value)

        // Ativa ou desativa o modo fantasma e salva
        if (typeof user_alvo.conf.banned !== "undefined")
            user_alvo.conf.banned = !user.conf.banned
        else
            user_alvo.conf.banned = true

        user_alvo.save()

        if (user_alvo.conf.banned)
            interaction.reply({ content: `${client.emoji(emojis.pare_agr)} | O usuário <@${user_alvo.uid}> será ignorado pelo bot a partir de agora!`, ephemeral: true })
        else
            interaction.reply({ content: `${client.emoji(emojis.dog_panelaco)} | O usuário <@${user_alvo.uid}> não será mais ignorado pelo bot!`, ephemeral: true })
    }
}