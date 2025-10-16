const { getReportedUsers } = require('../../database/schemas/User_reports')

module.exports = async ({ client, user, interaction }) => {

    // Deferindo a interação
    const ephemeral = "Ephemeral"
    await client.deferedResponse({ interaction, ephemeral })

    const users = [], users_ids = [], id_membros_guild = []
    const usuarios_reportados = await getReportedUsers()
    const warned_users = await client.execute("getSingleWarnedGuildUser", { id_guild: interaction.guild.id, escopo: "warn" })
    const user_notes = await client.execute("getSingleWarnedGuildUser", { id_guild: interaction.guild.id, escopo: "pre_warn" })

    interaction.guild.members.fetch()
        .then(async membros => {

            // Salvando os dados no formato apropriado
            usuarios_reportados.forEach(valor => { users.push(valor) })

            // Listando todos os usuários do servidor para comparação
            membros.forEach(membro => { id_membros_guild.push(membro.user.id) })

            for (const user of usuarios_reportados) // Listando os usuários que possuem denúncias e estão no servidor
                if (id_membros_guild.includes(client.decifer(user.uid))) users_ids.push(client.decifer(user.uid))

            const embed = client.create_embed({
                title: `> ${interaction.guild.name}`,
                thumbnail: interaction.guild.iconURL({ size: 2048 }),
                description: { tls: "mode.warn.descricao_painel_visualizacao" },
                fields: [
                    {
                        name: `${client.emoji(0)} **${client.tls.phrase(user, "mode.warn.advertidos")}: \`${warned_users.length}\`**`,
                        value: "⠀",
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("pen")} **${client.tls.phrase(user, "menu.botoes.anotacoes")}: \`${user_notes.length}\`**`,
                        value: "⠀",
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.report.reportados")}: \`${users_ids.length}\`**`,
                        value: "⠀",
                        inline: true
                    }
                ],
                footer: {
                    text: { tls: "mode.warn.verificar_warn" },
                    iconURL: interaction.user.avatarURL({ dynamic: true })
                }
            }, user)

            const b_disabled = [false, false, false]

            // Sem membros que receberam advertências no servidor
            if (warned_users.length < 1)
                b_disabled[0] = true

            // Sem membros reportados externamente presentes no servidor
            if (users_ids.length < 1)
                b_disabled[1] = true

            // Sem membros com anotações ativas no servidor
            if (user_notes.length < 1)
                b_disabled[3] = true

            const botoes = [
                { id: "guild_verify_button", name: { tls: "menu.botoes.atualizar" }, type: 2, emoji: client.emoji(42), data: "3" },
                { id: "guild_verify_button", name: { tls: "mode.warn.advertencias" }, type: 0, emoji: client.emoji(0), data: "1", disabled: b_disabled[0] },
                { id: "guild_verify_button", name: { tls: "menu.botoes.anotacoes" }, type: 0, emoji: client.defaultEmoji("pen"), data: "4", disabled: b_disabled[3] },
                { id: "guild_verify_button", name: { tls: "mode.report.reportados" }, type: 0, emoji: client.defaultEmoji("guard"), data: "2", disabled: b_disabled[1] }
            ]

            return interaction.editReply({
                embeds: [embed],
                components: [client.create_buttons(botoes, interaction, user)],
                flags: "Ephemeral"
            })
        })
}