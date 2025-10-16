const { atualiza_user_subscription } = require("../../../auto/triggers/user_subscription")
const { createBadge } = require("../../../database/schemas/User_badges")

const { badges } = require("../../../formatters/patterns/user")

module.exports = async ({ client, user, interaction, dados }) => {

    // Atribuindo assinatura a usuários
    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar e notificar
    // 2 -> Confirmar silenciosamente

    if (!operacao) // Cancelando a atribuição da assinatura
        return client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)

    const id_user = interaction.customId.split("|")[2].split(".")[0]
    const tempo_assinatura = parseInt(interaction.customId.split("|")[2].split(".")[1])
    const alvo = await client.execute("getUser", { id_user })

    // Atualizando os dados da assinatura do usuário 
    alvo.misc.subscriber.active = true
    alvo.misc.subscriber.expires = !tempo_assinatura ? null : tempo_assinatura
    await alvo.save()

    client.cached.subscribers.set(alvo.uid, true)

    // Atribuindo a badge de assinante ao usuário
    await createBadge(id_user, badges.DONATER, client.execute("timestamp"))

    // Atualizando a lista de usuários assinantes em cache
    setTimeout(() => {
        atualiza_user_subscription(client)
    }, 1000)

    if (!tempo_assinatura) expiracao = `\`${client.tls.phrase(user, "misc.assinante.assinatura_infinita")}\``
    else expiracao = `<t:${tempo_assinatura}:D>`

    if (operacao === 1) { // Atribuindo e notificando
        client.discord.users.fetch(id_user, false).then(async () => {

            client.execute("sendDM", { user: alvo, dados: { content: client.tls.phrase(alvo, "misc.assinante.notifica_user", client.emoji("emojis_dancantes"), expiracao) } })

            interaction.update({
                content: `${client.emoji("emojis_dancantes")} | Assinatura de <@${id_user}> atribuída com sucesso até ${expiracao}!`,
                embeds: [],
                components: [],
                flags: "Ephemeral"
            })
        })
    } else // Atribuindo silenciosamente
        interaction.update({
            content: `${client.emoji("emojis_dancantes")} | Assinatura de <@${id_user}> atribuída com sucesso até ${expiracao}!`,
            embeds: [],
            components: [],
            flags: "Ephemeral"
        })
}