const { ContextMenuCommandBuilder, ApplicationCommandType, SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("⌠💂⌡ Delete multiple chat messages")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ Exclui várias mensagens do chat',
            "es-ES": '⌠💂⌡ Eliminar varios mensajes de chat',
            "fr": '⌠💂⌡ Supprimer plusieurs messages de chat',
            "it": '⌠💂⌡ Elimina più messaggi di chat',
            "ru": '⌠💂⌡ Удалить несколько сообщений из чата'
        })
        .addIntegerOption(option =>
            option.setName("amount")
                .setNameLocalizations({
                    "pt-BR": 'quantia',
                    "es-ES": 'monto',
                    "fr": 'quantite',
                    "it": 'quantita',
                    "ru": 'количество'
                })
                .setDescription("The amount of messages to delete")
                .setDescriptionLocalizations({
                    "pt-BR": 'A quantidade de mensagens para excluir',
                    "es-ES": 'El número de mensajes que se eliminarán',
                    "fr": 'Le nombre de messages à supprimer',
                    "it": 'La quantità di messaggi da eliminare',
                    "ru": 'Количество сообщений, которые нужно удалить'
                })
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    menu_data: new ContextMenuCommandBuilder()
        .setName("Clear")
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(client, user, interaction) {
        const qtd_msg = interaction.options.getInteger("amount")
        deleteMessages(client, user, interaction, qtd_msg)
    },
    async menu(client, user, interaction) {
        const messageDate = interaction.targetMessage.createdAt;

        interaction.targetMessage.channel.messages.fetch()
            .then(messages => {
                const count = messages.filter(m => m.createdAt >= messageDate).size;

                deleteMessages(client, user, interaction, count)
            })
            .catch(console.error);
    }
}

async function deleteMessages(client, user, interaction, qtd_msg) {
    const membro_sv = await client.getUserGuild(interaction, client.id())

    // Verificando se o bot pode gerenciar as mensagens do servidor
    if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return client.tls.reply(interaction, user, "mode.clear.permissao", true, 3)

    const channel = interaction.channel

    channel.bulkDelete(qtd_msg, true)
        .then(messages => {
            const count = messages.size;
            const texto = count > 1 ? `\`${count} ${client.tls.phrase(user, "mode.clear.apagado_1")}` : `\`1 ${client.tls.phrase(user, "mode.clear.apagado_2")}`

            interaction.reply({ content: `:recycle: | ${texto}`, ephemeral: true })
        })
        .catch(() => client.tls.reply(interaction, user, "mode.clear.error", true, 0))
}