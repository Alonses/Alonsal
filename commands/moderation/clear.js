const { ContextMenuCommandBuilder, ApplicationCommandType, SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, InteractionContextType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("⌠💂⌡ Delete multiple chat messages")
        .setDescriptionLocalizations({
            "de": '⌠💂⌡ Löscht mehrere Chatnachrichten',
            "es-ES": '⌠💂⌡ Eliminar varios mensajes de chat',
            "fr": '⌠💂⌡ Supprimer plusieurs messages de chat',
            "it": '⌠💂⌡ Elimina più messaggi di chat',
            "pt-BR": '⌠💂⌡ Exclui várias mensagens do chat',
            "ru": '⌠💂⌡ Удалить несколько сообщений из чата'
        })
        .addIntegerOption(option =>
            option.setName("amount")
                .setNameLocalizations({
                    "de": 'menge',
                    "es-ES": 'monto',
                    "fr": 'quantite',
                    "it": 'quantita',
                    "pt-BR": 'quantia',
                    "ru": 'количество'
                })
                .setDescription("The amount of messages to delete")
                .setDescriptionLocalizations({
                    "de": 'Die Anzahl der zu löschenden Nachrichten',
                    "es-ES": 'El número de mensajes que se eliminarán',
                    "fr": 'Le nombre de messages à supprimer',
                    "it": 'La quantità di messaggi da eliminare',
                    "pt-BR": 'A quantidade de mensagens para excluir',
                    "ru": 'Количество сообщений, которые нужно удалить'
                })
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    menu_data: new ContextMenuCommandBuilder()
        .setName("Clear below")
        .setNameLocalizations({
            "de": 'unten löschen',
            "es-ES": 'Eliminar a continuación',
            "fr": 'Supprimer ci-dessous',
            "it": 'Cancella sotto',
            "pt-BR": 'Limpar abaixo',
            "ru": 'удалить ниже'
        })
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setContexts(InteractionContextType.Guild),
    async execute({ client, user, interaction }) {
        const qtd_msg = interaction.options.getInteger("amount")
        deleteMessages({ client, user, interaction, qtd_msg })
    },
    async menu({ client, user, interaction }) {
        const messageDate = interaction.targetMessage.createdAt

        interaction.targetMessage.channel.messages.fetch()
            .then(messages => {
                const qtd_msg = messages.filter(m => m.createdAt >= messageDate).size

                deleteMessages({ client, user, interaction, qtd_msg })
            })
            .catch(console.error)
    }
}

deleteMessages = async ({ client, user, interaction, qtd_msg }) => {

    if (interaction.guild) { // Verificando se o bot pode gerenciar as mensagens do servidor
        if (!await client.permissions(interaction, client.id(), [PermissionsBitField.Flags.ManageMessages]))
            return client.tls.reply(interaction, user, "mode.clear.permissao", true, 3)

        interaction.channel.bulkDelete(qtd_msg, true)
            .then(messages => {
                const count = messages.size
                const texto = count > 1 ? `\`${count} ${client.tls.phrase(user, "mode.clear.apagado_1")}` : `\`1 ${client.tls.phrase(user, "mode.clear.apagado_2")}`

                interaction.reply({
                    content: `:recycle: | ${texto}`,
                    ephemeral: true
                })
            })
            .catch(() => client.tls.reply(interaction, user, "mode.clear.error", true, client.emoji(0)))
    } else {

        // Excluindo as mensagens enviadas pelo bot da DM do usuário
        await interaction.deferReply({ ephemeral: true })

        client.discord.users.fetch(interaction.user.id)
            .then(u => {
                u.createDM()
                    .then(dmchannel => {
                        dmchannel.messages.fetch({ limit: qtd_msg })
                            .then(messages => {

                                let c = messages.size
                                messages = messages.filter(m => { return m.author.id === client.id() })

                                messages.forEach(msg => {
                                    msg.delete().then(() => {

                                        c--

                                        if (c === 0)
                                            interaction.editReply({ content: `:recycle: | \`${qtd_msg} mensagens\` foram removidas com sucesso!`, ephemeral: true })

                                    }).catch(err => {
                                        interaction.editReply({ content: `:fire: | Houve um erro ao tentar excluir as mensagens.`, ephemeral: true })
                                    })
                                })
                            }).catch(err => {
                                interaction.editReply({ content: `:fire: | Houve um erro ao procurar mensagens para deletar.`, ephemeral: true })
                            })
                    }).catch(err => {
                        interaction.editReply({ content: `:fire: | Houve um erro ao procurar esse canal de mensagens diretas.`, ephemeral: true })
                    })
            }).catch(err => {
                interaction.editReply({ content: `:fire: | Houve um erro ao procurar você pelo meu cache de mensagens diretas.`, ephemeral: true })
            })
    }
}