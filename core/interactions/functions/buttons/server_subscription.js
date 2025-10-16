module.exports = async ({ client, user, interaction, dados }) => {

    let operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Abre o menu com os detalhes do impulso
    // 1 -> Menu para confirmação remoção de impulso
    // 2 -> Menu para confirmar adição de impulso

    // 11 e 12 -> Confirmam a remoção e adição do impulso ao servidor respectivamente

    if (operacao === 10) // Redirecionando o usuário para os benefícios do suporte
        return require("../../../formatters/chunks/model_support")({ client, user, interaction })

    let row = [{ id: "server_info_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: '0' }], data_impulso
    const guild = await client.getGuild(interaction.guild.id)

    if (guild.misc.subscription.expires) data_impulso = `<t:${guild.misc.subscription.expires}:f>`
    else data_impulso = client.tls.phrase(user, "misc.assinante.assinatura_infinita")

    const embed = client.create_embed({
        title: { tls: "misc.assinante.impulso_servidor" },
        description: `${guild.misc.subscription.active ? client.tls.phrase(user, "misc.assinante.descricao_impulso_servidor", null, data_impulso) : client.tls.phrase(user, "misc.assinante.descricao_sem_impulso_servidor")}${client.tls.phrase(user, "misc.assinante.recursos_impulso")}`
    }, user)

    if (!operacao) {
        if (guild.misc?.subscription.id_owner === user.uid) // Verificando se o impulsionar é o usuário atual
            row.push({ id: "server_subscription", name: { tls: "menu.botoes.remover_impulso" }, type: 0, emoji: "❌", data: 1 })
        else if (!guild.misc?.subscription.active && client.cached.subscribers.has(user.uid))
            row.push({ id: "server_subscription", name: { tls: "menu.botoes.impulsionar_servidor" }, type: 0, emoji: "⚡", data: 2 })
    }

    if (!client.cached.subscribers.has(user.uid)) // Verificando se o usuário da interação é um assinante
        row.push({ id: "server_subscription", name: { tls: "menu.botoes.virar_assinante" }, type: 2, emoji: "🏆", data: 10 })

    if (operacao === 1 || operacao === 2) {

        // Sub-menu para confirmar a remoção do impulso
        row = [
            { id: "server_subscription", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: operacao + 10 },
            { id: "server_subscription", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: 0 }
        ]

    } else if (operacao === 11) {

        // Removendo o impulso do servidor
        guild.misc.subscription.active = false
        guild.misc.subscription.id_owner = null
        guild.misc.subscription.expires = null
        await guild.save()

        return interaction.update({
            content: client.tls.phrase(user, "misc.assinante.vinculado_servidor", 74),
            embeds: [],
            components: [client.create_buttons([{ id: "server_subscription", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: '0' }], interaction, user)],
            flags: "Ephemeral"
        })

    } else if (operacao === 12) {

        // Adicionado o impulso ao servidor
        guild.misc.subscription.active = true
        guild.misc.subscription.id_owner = user.uid
        guild.misc.subscription.expires = user?.misc.subscriber.expires ? user.misc.subscriber.expires + 259200 : null
        await guild.save()

        return interaction.update({
            content: client.tls.phrase(user, "misc.assinante.vinculado_servidor", 73),
            embeds: [],
            components: [client.create_buttons([{ id: "server_subscription", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: '0' }], interaction, user)],
            flags: "Ephemeral"
        })
    }

    client.reply(interaction, {
        content: "",
        embeds: [embed],
        components: [client.create_buttons(row, interaction, user)],
        flags: "Ephemeral"
    })
}