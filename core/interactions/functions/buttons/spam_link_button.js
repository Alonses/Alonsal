const { EmbedBuilder } = require("discord.js")
const { dropSuspiciousLink, getCachedSuspiciousLink, getAllGuildSuspiciousLinks } = require("../../../database/schemas/Spam_link")

module.exports = async ({ client, user, interaction, dados, pagina_guia }) => {

    const pagina = pagina_guia || 0

    // Gerenciamento de anotações
    const operacao = parseInt(dados.split(".")[1])
    const timestamp = parseInt(dados.split(".")[2])

    // Códigos de operação
    // 0 -> Apagar link em cache
    // 1 -> Registrar link suspeito

    // 2 -> Menu de links suspeitos

    const link = await getCachedSuspiciousLink(interaction.guild.id, timestamp)

    if (!operacao) {

        // Removendo o link suspeito em cache
        await dropSuspiciousLink(link.link)

        return client.reply(interaction, {
            content: "🛑 | O Link informado não foi registrado, operação cancelada.",
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
        client.notify(guild.logger.channel, { content: `:link: :inbox_tray: | Um novo link suspeito foi adicionado manualmente neste servidor!\n( \`${link.link.split("").join(" ")}\` )` })

        return client.reply(interaction, {
            content: `🔗 | O Link suspeito informado foi registrado!\n\nUm relatório foi enviado ao <#${guild.logger.channel}> avisando sobre a adição.`,
            embeds: [],
            components: [],
            ephemeral: true
        })

    } else if (operacao === 2) {

        const links = await getAllGuildSuspiciousLinks(interaction.guild.id)

        if (links.length < 1) // Sem links suspeitos registrados no servidor
            return interaction.reply({
                content: `${client.emoji(1)} | Não há links suspeitos identificados e reportados neste servidor!\nVocê pode adicionar um link suspeito através do comando </link add:1020561785620803674> caso acredite que ele seja malicioso!`,
                ephemeral: true
            })

        // Navegando pelos links suspeitos do servidor
        const embed = new EmbedBuilder()
            .setTitle("> Navegando por links suspeitos 🔗")
            .setColor(client.embed_color(user.misc.color))
            .setDescription("Links suspeitos são links que consideramos maliciosos e que podem trazer problemas para usuários que clicarem.\n\nGeralmente esses links são usados para conceder acesso a sua conta Discord ou de outras redes para pessoas má intencionadas, sem o consentimento do usuário que veio a clicar por engano, acreditando ser um link oficial.")
            .setFooter({
                text: "Use o menu abaixo para navegar pelos links suspeitos do servidor!",
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        // Definindo o canal de avisos do log de eventos
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "spam_link_panel",
            reback: "browse_button.spam_link_button",
            operation: operacao,
            values: links
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [{ id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "2" }]
        let row = client.menu_navigation(data, pagina)

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