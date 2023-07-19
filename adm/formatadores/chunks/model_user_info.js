const { buildAllBadges, busca_badges } = require('../../data/badges')
const { getUserReports } = require('../../database/schemas/Report')

module.exports = async (client, user, interaction, dados) => {

    // Códigos de operação
    // 0 -> Perfil
    // 1 -> Permissões
    // 2 -> Badges
    // 3 -> Histórico de reportes

    let operador = 0, historico = []
    let id_alvo, badges, descricao_reportes, avisos_reportes = 0, permissoes_fn = "", cargos_fn

    // Coletando os dados do usuário
    if (dados) {
        operador = parseInt(dados.split(".")[1])
        id_alvo = dados.split(".")[2]
    } else
        id_alvo = interaction.options.getUser("user")?.id || interaction.user.id

    const membro_sv = await client.getUserGuild(interaction, id_alvo)
    const infos_user = await client.create_profile({ client, interaction, user, id_alvo, operador })

    if (!membro_sv) // Usuário foi removido do cache do bot
        return interaction.update({ content: ":o: | Este comando está desatualizado! Por favor, use o mesmo novamente.", components: [] })

    // Permissões e cargos
    if (operador === 1) {

        const permissoes_user = membro_sv.permissions.toArray()

        // Listando todas as permissões do usuário
        for (let i = 0; i < permissoes_user.length; i++) {
            if (typeof permissoes_user[i + 1] === "undefined")
                permissoes_fn += " & "

            permissoes_fn += `\`${permissoes_user[i]}\``

            if (typeof permissoes_user[i + 2] !== "undefined")
                permissoes_fn += ", "
        }

        permissoes_fn = permissoes_fn.slice(0, 2000)
        cargos_fn = membro_sv.roles.cache.map(r => `${r}`).join(" ").replace(" @everyone", "")

        infos_user.addFields(
            {
                name: `${client.defaultEmoji("guard")} **Cargos**`,
                value: `${cargos_fn}`,
                inline: false
            },
            {
                name: `:shield: **Permissões**`,
                value: `${permissoes_fn}`,
                inline: false
            }
        )
    }

    // Badges do usuário
    if (operador === 2) {

        let id_badges = await client.getUserBadges(id_alvo)
        badges = await buildAllBadges(client, user, id_badges)
        // let achievements = busca_achievements(client, all, user.id, interaction)

        const internal_user = await client.getUser(id_alvo)

        if (internal_user.misc.fixed_badge) {
            const fixed_badge = busca_badges(client, 1, internal_user)

            infos_user.addFields({
                name: `**:pushpin: Badge fixada**`,
                value: `${fixed_badge.emoji} \`${fixed_badge.name}\``,
                inline: false
            })
        }

        if (badges.length > 0)
            infos_user.addFields({
                name: ":trophy: **Badges**",
                value: badges,
                inline: false
            })
        else
            infos_user.setDescription(`\`\`\`🏆 | Este usuário não ganhou nenhuma badge ainda!\`\`\``)
    }

    // Reportes sobre o usuário
    if (operador === 3) {

        // Coletando os dados de histórico do usuário
        const reports = await getUserReports(id_alvo)

        // Quantificando os relatórios sobre o usuário
        reports.forEach(valor => {
            avisos_reportes++

            historico.push(`-> ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory}`)
        })

        if (avisos_reportes > 0)
            descricao_reportes = `\`\`\`💢 | ${client.tls.phrase(user, "mode.report.com_report")}\n\n${historico.join("\n").slice(0, 1000)}\`\`\``

        if (descricao_reportes)
            infos_user.setDescription(descricao_reportes)
                .addFields(
                    {
                        name: `**:man_guard: ${client.tls.phrase(user, "mode.report.reporte")}: ${avisos_reportes}**`,
                        value: "⠀",
                        inline: true
                    }
                )
        else
            infos_user.setDescription(`\`\`\`✅ | Este usuário não possui reportes\`\`\``)
    }

    // Liga e desliga os botões conforme a página que o usuário se encontra
    const b_disabled = [false, false, false, false]
    b_disabled[operador] = true

    const row = client.create_buttons([{ id: "user_info_button", name: "Perfil", type: 1, emoji: '👤', data: `0|${id_alvo}`, disabled: b_disabled[0] }, { id: "user_info_button", name: "Permissões", type: 1, emoji: '🏷️', data: `1|${id_alvo}`, disabled: b_disabled[1] }, { id: "user_info_button", name: "Badges", type: 1, emoji: '🏆', data: `2|${id_alvo}`, disabled: b_disabled[2] }, { id: "user_info_button", name: "Histórico", type: 1, emoji: '📠', data: `3|${id_alvo}`, disabled: b_disabled[3] }], interaction)

    if (!interaction.customId)
        return interaction.reply({ embeds: [infos_user], components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    else
        return interaction.update({ embeds: [infos_user], components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}