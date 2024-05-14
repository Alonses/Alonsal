const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_ignore_user")
        .setDescription("⌠🤖⌡ Desligar respostas do bot para determinado usuário")
        .addStringOption(option =>
            option.setName("usuario")
                .setDescription("O ID do usuário")
                .setRequired(true)),
    async execute({ client, user, interaction }) {

        if (interaction.user.id !== client.x.owners[0] || client.x.owners.includes(interaction.options.getString("usuario"))) return

        const user_alvo = await client.getUser(interaction.options.getString("usuario"))

        // Ativa ou desativa o banimento do membro
        user_alvo.conf.banned = !user_alvo.conf.banned
        await user_alvo.save()

        if (user_alvo.conf.banned)
            interaction.reply({
                content: `${client.emoji("pare_agr")} | O usuário <@${user_alvo.uid}> será ignorado pelo bot a partir de agora!`,
                ephemeral: true
            })
        else
            interaction.reply({
                content: `${client.emoji("dog_panelaco")} | O usuário <@${user_alvo.uid}> não será mais ignorado pelo bot`,
                ephemeral: true
            })
    }
}