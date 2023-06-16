const { EmbedBuilder, PermissionsBitField } = require('discord.js')

const { buildAllBadges } = require('../../data/badges')
const { getUserReports } = require('../../database/schemas/Report')

const { emojis } = require('../../../arquivos/json/text/emojis.json')

module.exports = async (client, user, interaction, dados) => {

    // Códigos de operação
    // 0 -> Perfil
    // 1 -> Permissões
    // 2 -> Badges
    // 3 -> Histórico de reportes

    let operacao = 0, membro_sv = null
    let user_alvo, badges, descricao_reportes, avisos_reportes = 0, permissoes_fn = "", cargos_fn

    // Coletando os dados do usuário
    if (dados) {
        operacao = parseInt(dados.split(".")[1])
        user_alvo = await client.getUserGuild(interaction, dados.split(".")[2])
        membro_sv = user_alvo

        if (!user_alvo)
            return interaction.update({ content: ":o: | Este comando está desatualizado! Por favor, use o mesmo novamente.", components: [] })

        user_alvo = user_alvo.user
    } else
        user_alvo = interaction.options.getUser("user") || interaction.user

    if (!membro_sv) // Coleta dados como membro
        membro_sv = await client.getUserGuild(interaction, user_alvo.id)

    const user_c = await client.getUser(user_alvo.id), historico = []
    const avatar_user = user_alvo.avatarURL({ dynamic: true, size: 2048 })

    let data_entrada = `<t:${Math.floor(membro_sv.joinedTimestamp / 1000)}:f>`
    let diferenca_entrada = `<t:${Math.floor(membro_sv.joinedTimestamp / 1000)}:R>`

    let data_criacao = `<t:${Math.floor(user_alvo.createdAt / 1000)}:f>` // Cadastro do usuário
    let diferenca_criacao = `<t:${Math.floor(user_alvo.createdAt / 1000)}:R>`

    let apelido = membro_sv.user.username, tipo_user = "🤖", nota_rodape = ""
    let nome_usuario = `\`${user_alvo.username.replace(/ /g, "")}#${user_alvo.discriminator}\``

    // Usuário sem discriminador
    if (user_alvo.discriminator == 0)
        nome_usuario = `\`@${user_alvo.username.replace(/ /g, "")}\``

    if (membro_sv.user.nickname)
        apelido = membro_sv.user.nickname

    if (membro_sv.permissions.has(PermissionsBitField.Flags.Administrator)) {
        tipo_user = "🛡️"
        nota_rodape = client.tls.phrase(user, "util.user.moderador")
    }

    if (!tipo_user.includes("🛡️") && !user_alvo.bot)
        tipo_user = client.defaultEmoji("person")

    if (user_alvo.id === client.id())
        nota_rodape = client.tls.phrase(user, "util.user.alonsal")

    if (process.env.ids_enceirados.includes(user_alvo.id)) {
        if (nota_rodape !== "")
            nota_rodape += ", "

        nota_rodape += client.tls.phrase(user, "util.user.enceirado")
    }

    let emoji_hypesquad = "⠀", discord_premium = "⠀"
    const flags_user = user_alvo.flags.toArray()

    if (!user_alvo.bot) {
        if (flags_user.includes("HypeSquadOnlineHouse1")) // HypeSquad
            emoji_hypesquad = client.emoji(emojis.squad_bravery)

        if (flags_user.includes("HypeSquadOnlineHouse2"))
            emoji_hypesquad = client.emoji(emojis.squad_brilliance)

        if (flags_user.includes("HypeSquadOnlineHouse3"))
            emoji_hypesquad = client.emoji(emojis.squad_balance)

        if (flags_user.includes("PremiumEarlySupporter"))
            discord_premium = client.emoji(emojis.early_supporter)

        if (membro_sv.premiumSinceTimestamp) // Impulsionadores do servidor
            discord_premium += ` ${client.emoji(emojis.boost)}`
    }

    // Permissões e cargos do usuário
    if (operacao === 1) {
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
        cargos_fn = membro_sv.roles.cache.map(r => `${r}`).join(" ")
    }

    // Badges do usuário
    if (operacao === 2) {
        let id_badges = await client.getUserBadges(user_alvo.id)
        badges = await buildAllBadges(client, user, id_badges)
        // let achievements = busca_achievements(client, all, user.id, interaction)
    }

    // Reportes sobre o usuário
    if (operacao === 3) {

        // Coletando os dados de histórico do usuário
        const reports = await getUserReports(user_alvo.id)

        // Quantificando os relatórios sobre o usuário
        reports.forEach(valor => {
            avisos_reportes++

            historico.push(`-> ${new Date(valor.timestamp * 1000).toLocaleDateString("pt-BR")} | ${valor.relatory}`)
        })

        if (avisos_reportes > 0)
            descricao_reportes = `\`\`\`💢 | ${client.tls.phrase(user, "mode.report.com_report")}\n\n${historico.join("\n").slice(0, 1000)}\`\`\``
    }

    const infos_user = new EmbedBuilder()
        .setTitle(`> ${apelido} ${emoji_hypesquad} ${discord_premium}`)
        .setColor(client.embed_color(user_c.misc.color))
        .addFields(
            {
                name: ":globe_with_meridians: **Discord**",
                value: `${nome_usuario}\n( <@${user_alvo.id}>)`,
                inline: true
            },
            {
                name: ":label: **Discord ID**",
                value: `\`${user_alvo.id}\``,
                inline: true
            }
        )
        .setFooter({ text: `${tipo_user} ${nota_rodape}` })

    // Informações básicas do usuário
    if (operacao === 0)
        infos_user.addFields(
            {
                name: `:birthday: **${client.tls.phrase(user, "util.user.conta_criada")}**`,
                value: `${data_criacao}\n( ${diferenca_criacao} )`,
                inline: false
            },
            {
                name: `:parachute: **${client.tls.phrase(user, "util.user.entrada")}**`,
                value: `${data_entrada}\n( ${diferenca_entrada} )`,
                inline: false
            }
        )

    // Permissões e cargos
    if (operacao === 1)
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

    // Badges do usuário
    if (operacao === 2) {
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
    if (operacao === 3) {
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

    if (avatar_user) // Usuário com avatar definido
        infos_user.setThumbnail(avatar_user)

    // Liga e desliga os botões conforme a página que o usuário se encontra
    const b_disabled = [false, false, false, false]
    b_disabled[operacao] = true

    const row = client.create_buttons([{ id: "user_info_button", name: "Perfil", type: 1, emoji: '👤', data: `0|${user_alvo.id}`, disabled: b_disabled[0] }, { id: "user_info_button", name: "Permissões", type: 1, emoji: '🏷️', data: `1|${user_alvo.id}`, disabled: b_disabled[1] }, { id: "user_info_button", name: "Badges", type: 1, emoji: '🏆', data: `2|${user_alvo.id}`, disabled: b_disabled[2] }, { id: "user_info_button", name: "Histórico", type: 1, emoji: '📠', data: `3|${user_alvo.id}`, disabled: b_disabled[3] }], interaction)

    if (!interaction.customId)
        return interaction.reply({ embeds: [infos_user], components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    else
        return interaction.update({ embeds: [infos_user], components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}