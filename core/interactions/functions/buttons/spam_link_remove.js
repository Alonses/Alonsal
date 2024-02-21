const { dropSuspiciousLink, getCachedSuspiciousLink, getAllGuildSuspiciousLinks } = require("../../../database/schemas/Spam_link")

module.exports = async ({ client, user, interaction, dados, pagina_guia }) => {

    // Gerenciamento de anotações
    const operacao = parseInt(dados.split(".")[1])

    let row = []

    // Códigos de operação
    // 0 -> Cancela o apagamento do link
    // 1 -> Exclui o link suspeito informado

    if (!operacao) {

        const links = await getAllGuildSuspiciousLinks(interaction.guild.id)

        if (links.length > 0) // Verificando se há links suspeitos no servidor
            row = client.create_buttons([
                { id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "2" }
            ], interaction)

        return client.reply(interaction, {
            content: "🛑 | O Link selecionado não foi excluído, operação cancelada.",
            embeds: [],
            components: [row],
            ephemeral: true
        })
    }

    if (operacao === 1) {

        const timestamp = dados.split(".")[2]
        const guild_id = dados.split(".")[3]

        const link = await getCachedSuspiciousLink(guild_id, timestamp)
        const guild = await client.getGuild(interaction.guild.id)

        // Notificando sobre a adição de um novo link suspeito ao banco do Alonsal e ao servidor original
        client.notify(process.env.channel_feeds, { content: `:link: :no_entry_sign: | Um link suspeito foi removido manualmente!\n( \`${link.link.split("").join(" ")}\` )` })
        client.notify(guild.logger.channel, { content: `:link: :no_entry_sign: | Um link suspeito foi removido manualmente neste servidor!\n( \`${link.link.split("").join(" ")}\` )` })

        // Excluindo o link suspeito
        await dropSuspiciousLink(link.link)

        const links = await getAllGuildSuspiciousLinks(interaction.guild.id)

        if (links.length > 0) // Verificando se há links suspeitos no servidor
            row = client.create_buttons([
                { id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "2" }
            ], interaction)

        return client.reply(interaction, {
            content: `🔗 | O Link suspeito foi excluído!\n\nUm relatório foi enviado ao <#${guild.logger.channel}> avisando sobre a remoção.`,
            embeds: [],
            components: [row],
            ephemeral: true
        })
    }
}