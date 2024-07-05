const { removeUserWarn, listAllCachedUserWarns } = require("../../../database/schemas/User_warns")

module.exports = async ({ client, user, interaction, dados }) => {

    const id_alvo = dados.split(".")[2]
    const operacao = parseInt(dados.split(".")[1])

    // Rascunhos de advertências salvas em cache
    const user_warns = await listAllCachedUserWarns(id_alvo, interaction.guild.id)

    if (operacao === 0) { // Operação cancelada

        // Excluindo a advertência registrada em cache
        removeUserWarn(id_alvo, interaction.guild.id, user_warns[user_warns.length - 1].timestamp)

        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.warn.advertencia_cancelada", client.emoji(0)),
            embeds: [],
            components: [],
            ephemeral: true
        })
    }

    // Advertência confirmada
    const user_warn = user_warns[user_warns.length - 1]

    if (!user_warn) // Advertência salva em cache não existe mais
        return interaction.update({
            content: "❌ Eita bixo! Parece que os dados dessa advertência sumiram, por gentileza, use o comando novamente",
            components: [],
            ephemeral: true
        })

    user_warn.timestamp = client.timestamp()
    user_warn.valid = true

    await user_warn.save()

    const member_guild = await client.getMemberGuild(interaction, id_alvo)

    require('../../../events/warn')({ client, user, interaction, member_guild, user_warn })
}