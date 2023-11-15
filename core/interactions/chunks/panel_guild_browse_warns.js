const { EmbedBuilder } = require('discord.js')

const { checkUserGuildWarned } = require('../../database/schemas/Warns')

module.exports = async ({ client, user, interaction, pagina }) => {

    pagina = pagina || 0

    if (!interaction.customId)
        await interaction.deferReply({ ephemeral: true })
    else
        await interaction.deferUpdate({ ephemeral: true })

    const warned_users = await checkUserGuildWarned(interaction.guild.id)

    // Verificando a quantidade de entradas e estimando o número de páginas
    const pages = warned_users.length / 6
    let paginas = pages - Math.floor(pages) > 0.5 ? Math.floor(pages) + 1 : Math.floor(pages)
    let rodape = ""

    if (warned_users.length / 6 < 1)
        paginas = 1

    if (warned_users.length > 6)
        rodape = `${paginas + 1} ${client.tls.phrase(user, "mode.report.varias_paginas")}`
    else
        rodape = client.tls.phrase(user, "mode.report.uma_pagina")

    if (pagina > paginas) // Número de página escolhida maior que as disponíveis
        return client.tls.editReply(interaction, user, "dive.rank.error_1", client.decider(user?.conf.ghost_mode, 0), client.emoji(1))

    const embed = new EmbedBuilder()
        .setTitle(`> ${interaction.guild.name}`)
        .setColor(client.embed_color(user.misc.color))
        .setThumbnail(interaction.guild.iconURL({ size: 2048 }))

    if (warned_users.length > 0)
        embed.setDescription(`\`\`\`📻 | ${client.tls.phrase(user, "mode.report.com_reportes_guild")}\`\`\``)
            .addFields({
                name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportados")}: ${warned_users.length}**`,
                value: "⠀",
                inline: true
            })
            .setFooter({
                text: rodape,
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })
    else
        embed.setDescription(`\`\`\`✅ | Não há membros no servidor com advertências registradas!\`\`\``)

    const obj = {
        content: client.tls.phrase(user, "mode.report.escolher_usuario"),
        embeds: [embed],
        ephemeral: true
    }

    if (warned_users.length > 0) {
        // Menu para navegar entre os usuários com advertências do servidor
        const reportes_guild = await checkUserGuildWarned(interaction.guild.id)

        if (reportes_guild.length > 0) {
            // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
            if (reportes_guild.length < pagina * 24)
                pagina--

            const data = {
                alvo: "warn_browse",
                reback: "browse_button.warn_browse_user",
                operation: 0,
                values: reportes_guild
            }

            obj.components = [client.create_menus({ client, interaction, user, data, pagina })]

            let row = client.menu_navigation(data, pagina)

            if (row.length > 0) // Botões de navegação
                obj.components.push(client.create_buttons(row, interaction))
        }
    }

    interaction.editReply(obj)
}