const { EmbedBuilder } = require("discord.js")

const { dropSuspiciousLink, getCachedSuspiciousLink, getAllGuildSuspiciousLinks, listAllSuspiciouLinks } = require("../../../database/schemas/Spam_link")

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    pagina = pagina || 0

    // Gerenciamento de links suspeitos
    const operacao = parseInt(dados.split(".")[1])
    const timestamp = parseInt(dados.split(".")[2])

    // Códigos de operação
    // 0 -> Apagar link em cache
    // 1 -> Registrar link suspeito

    // 2 -> Menu de links suspeitos

    const link = await getCachedSuspiciousLink(timestamp)

    if (!operacao) {

        // Removendo o link suspeito em cache
        await dropSuspiciousLink(link.link)

        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.link_suspeito.operacao_cancelada_adicao", client.emoji(0)),
            embeds: [],
            components: [],
            ephemeral: true
        })
    }

    if (operacao === 1) {

        // Atualizando o status de validade do link suspeito
        link.valid = true
        await link.save()

        const guild = await client.getGuild(interaction.guild.id)

        // Notificando sobre a adição de um novo link suspeito ao banco do Alonsal e ao servidor original
        client.notify(process.env.channel_feeds, { content: `:link: :inbox_tray: | Um novo link suspeito foi adicionado manualmente!\n( \`${link.link.split("").join(" ")}\` )` })
        client.notify(guild.spam.channel || guild.logger.channel, { content: client.tls.phrase(user, "mode.link_suspeito.adicionado_manualmente", [44, 10], link.link.split("").join(" ")) })

        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.link_suspeito.aviso_adicao", [44, 10], guild.spam.channel || guild.logger.channel),
            embeds: [],
            components: [],
            ephemeral: true
        })

    } else if (operacao === 2) {

        let links

        if (interaction.guild.id === process.env.guild_id && process.env.owner_id.includes(interaction.user.id)) // Lista todos os links maliciosos salvos no Alonsal
            links = await listAllSuspiciouLinks()
        else
            links = await getAllGuildSuspiciousLinks(interaction.guild.id)

        if (links.length < 1) // Sem links suspeitos registrados no servidor
            return interaction.reply({
                content: client.tls.phrase(user, "mode.link_suspeito.sem_links", 1),
                ephemeral: true
            })

        // Navegando pelos links suspeitos do servidor
        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "mode.link_suspeito.navegando_titulo"))
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.tls.phrase(user, "mode.link_suspeito.descricao_links_suspeitos"))
            .setFooter({
                text: client.tls.phrase(user, "mode.link_suspeito.navegar_links"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        // Definindo o canal de avisos do log de eventos
        const data = {
            title: { tls: "menu.menus.escolher_link" },
            alvo: "spam_link_panel",
            reback: "browse_button.spam_link_button",
            operation: operacao,
            values: links
        }

        // Retorna na página aberta anteriormente
        if (dados.split(".")[2]) pagina = parseInt(dados.split(".")[2])

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        let botoes = [{ id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "2" }]
        let row = client.menu_navigation(client, user, data, pagina)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return client.reply(interaction, {
            content: "",
            embeds: [embed],
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    } else if (operacao === 5) {

        // Sub menu para gerenciar se o link suspeito será excluído ou não
        const row = client.create_buttons([
            { id: "spam_link_remove", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${timestamp}.${link.sid}` },
            { id: "spam_link_remove", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: "0" }
        ], interaction)

        // Listando os botões para confirmar e cancelar a operação
        return interaction.update({
            components: [row]
        })
    }
}