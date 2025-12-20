const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_user_ceira')
        .setDescription('⌠🤖⌡ (Des)ativa a marcação de enceirado para determinado usuário')
        .addStringOption(option =>
            option.setName('usuario')
                .setDescription('O ID do usuário')
                .setRequired(true)),
    async execute({ client, user, interaction }) {

        // Apenas o proprietário principal pode usar este comando
        if (interaction.user.id !== client.x.owners[0])
            return interaction.reply({ content: ':no_entry: | Permissão negada.', flags: 'Ephemeral' })

        let targetUserId = interaction.options.getString('usuario')

        // Usuário mencionado ao invés de informado apenas o ID
        if (targetUserId.includes("<@"))
            targetUserId = targetUserId.replace("<@", "").replace("!", "").replace(">", "")

        try {
            const targetUser = await client.execute('getUser', { id_user: targetUserId })

            if (!targetUser)
                return interaction.reply({ content: ':warning: | Usuário não encontrado.', flags: 'Ephemeral' })

            // Garantir que a configuração exista
            targetUser.misc = targetUser.misc || {}

            // Alterna o estado de 'enceirado' (usuário enceirado)
            targetUser.misc.enceirado = !Boolean(targetUser.misc.enceirado)
            await targetUser.save()

            const content = targetUser.misc.enceirado
                ? `${client.emoji('mc_wax')} | O usuário <@${targetUserId}> agora é um enceirado!`
                : `${client.emoji('dog_panelaco')} | O usuário <@${targetUserId}> não é mais um enceirado.`

            return interaction.reply({ content, flags: 'Ephemeral' })
        } catch (err) {
            client.log.error('conf_ignore_user', err)
            return interaction.reply({ content: ':x: | Ocorreu um erro ao processar a solicitação.', flags: 'Ephemeral' })
        }
    }
}