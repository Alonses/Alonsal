const { getUserWarn, listAllUserWarns, removeUserWarn } = require("../../../database/schemas/User_warns")

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])

    const id_alvo = dados.split(".")[2]
    const timestamp = parseInt(dados.split(".")[3])

    // Tratamento dos cliques
    // 0 -> Cancela
    // 3 -> Menu com escolha para exclusão ou não
    // 2 -> Acesso aos botões deste painel

    // 4 -> Mantêm ou remove o motivo informado para usar em outras advertências

    // 9 -> Sub guia com os detalhes da advertência escolhida

    if (escolha === 1) {

        const row = [], user_warn = await getUserWarn(client.encrypt(id_alvo), client.encrypt(interaction.guild.id), timestamp)
        const user_warns = await listAllUserWarns(client.encrypt(id_alvo), client.encrypt(interaction.guild.id))

        // Removendo a advertência do usuário e verificando os cargos do mesmo
        await removeUserWarn(user_warn.uid, user_warn.sid, user_warn.timestamp)
        client.verifyUserWarnRoles(client.encrypt(id_alvo), client.encrypt(interaction.guild.id))

        if (user_warns.length - 1 > 0)
            row.push({ id: "panel_guild_browse_warns", name: { tls: "menu.botoes.remover_outras" }, type: 0, emoji: client.emoji(41), data: `0|${id_alvo}` })

        const obj = {
            content: client.tls.phrase(user, "mode.warn.advertencia_removida", 10),
            embeds: [],
            components: [],
            flags: "Ephemeral"
        }

        if (row.length > 0) // Botão para ver outras advertências
            obj.components = [client.create_buttons(row, interaction, user)]

        const guild = await client.getGuild(interaction.guild.id)

        if (guild.warn.notify_exclusion) { // Embed de aviso que o membro teve uma advertência apagada

            let warns_restantes = client.tls.phrase(user, "mode.warn.advertencias_restantes", null, user_warns.length - 1), motivo_remocao = ""

            if ((user_warns.length - 1) === 1)
                warns_restantes = client.tls.phrase(user, "mode.warn.advertencia_restante")

            if (client.cached.warns.has(interaction.user.id))
                motivo_remocao = `\`\`\`fix\n${client.tls.phrase(user, "mode.warn.motivo_remocao", client.defaultEmoji("judge"))}:\n\n${client.cached.warns.get(interaction.user.id).relatory}\`\`\`\n`

            if (!client.cached.warns.get(interaction.user.id)?.keep || user_warns.length === 1) // Removendo o motivo para a remoção da advertência
                client.cached.warns.delete(interaction.user.id)

            const embed = client.create_embed({
                title: { tls: "mode.warn.advertencia_removida_titulo" },
                color: "salmao",
                description: `${client.tls.phrase(guild, "mode.warn.descricao_advertencia_removida", null, id_alvo)}${client.tls.phrase(user, "mode.warn.descricao_advertencia", null, [client.decifer(user_warn.relatory), motivo_remocao])}${warns_restantes}`,
                fields: [
                    {
                        name: `:bust_in_silhouette: **${client.tls.phrase(user, "mode.report.usuario")}**`,
                        value: `${client.emoji("icon_id")} \`${id_alvo}\`\n${client.emoji("mc_name_tag")} \`${client.decifer(user_warns[0].nick)}\`\n( <@${id_alvo}> )`,
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("guard")} **${client.tls.phrase(guild, "mode.warn.moderador_responsavel")}**`,
                        value: `${client.emoji("icon_id")} \`${interaction.user.id}\`\n${client.emoji("mc_name_tag")} \`${interaction.user.username}\`\n( <@${interaction.user.id}> )`,
                        inline: true
                    }
                ],
                timestamp: true
            }, guild)

            client.notify(guild.warn.channel, {
                content: guild.warn.notify ? "@here" : "", // Servidor com ping de advertência ativo
                embeds: [embed]
            })
        }

        return client.reply(interaction, obj)

    } else if (escolha === 3) {

        // Criando os botões para o menu de remoção de advertências
        const row = client.create_buttons([
            { id: "warn_user_verify", name: { tls: "menu.botoes.confirmar" }, type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${timestamp}` },
            { id: "warn_user_verify", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `9|${id_alvo}.${timestamp}` }
        ], interaction, user)

        // Listando os botões para confirmar e cancelar a operação
        return interaction.update({
            components: [row]
        })

    } else if (escolha === 9 || escolha === 4) {

        if (escolha === 4) // Inverte o valor para manter ou não o motivo para uso em outras advertências
            client.cached.warns.get(interaction.user.id).keep = !client.cached.warns.get(interaction.user.id).keep

        const user_warn = await getUserWarn(client.encrypt(id_alvo), client.encrypt(interaction.guild.id), timestamp)
        let motivo_remocao = ""

        if (client.cached.warns.has(interaction.user.id))
            motivo_remocao = `\`\`\`fix\n${client.tls.phrase(user, "mode.warn.motivo_remocao", client.defaultEmoji("judge"))}:\n\n${client.cached.warns.get(interaction.user.id).relatory}\`\`\``

        // Exibindo os detalhes da advertência escolhida
        const embed = client.create_embed({
            title: { tls: "mode.warn.titulo_verificando_advertencia" },
            description: { tls: "mode.warn.descricao_advertencia", replace: [client.decifer(user_warn.relatory), motivo_remocao] },
            fields: [
                {
                    name: `${client.defaultEmoji("person")} **${client.tls.phrase(user, "util.server.membro")}**`,
                    value: `${client.emoji("icon_id")} \`${id_alvo}\`\n\`${user_warn.nick ? client.decifer(user_warn.nick) : client.tls.phrase(user, "mode.warn.sem_nome")}\`\n( <@${id_alvo}> )`,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("guard")} **${client.tls.phrase(user, "mode.warn.moderador")}**`,
                    value: `${client.emoji("icon_id")} \`${client.decifer(user_warn.assigner)}\`\n\`${user_warn.assigner_nick ? client.decifer(user_warn.nick) : client.tls.phrase(user, "mode.warn.sem_nome")}\`\n( <@${client.decifer(user_warn.assigner)}> )`,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "mode.warn.aplicado")} <t:${user_warn.timestamp}:R>**`,
                    value: `<t:${user_warn.timestamp}:f>`,
                    inline: true
                }
            ],
            footer: {
                text: { tls: "mode.warn.gerenciar_advertencia_escolha" },
                iconURL: interaction.user.avatarURL({ dynamic: true })
            }
        }, user)

        const botoes = [
            { id: "warn_user_verify", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: `0|${id_alvo}.${timestamp}` },
            { id: "warn_user_verify", name: { tls: "menu.botoes.remover_advertencia" }, type: 1, emoji: client.emoji(13), data: `3.${id_alvo}.${timestamp}` }
        ]

        if (client.cached.warns.get(interaction.user.id)) // Motivo salvo em cache para remover a advertência
            botoes.push({
                id: "warn_user_verify", name: { tls: "menu.botoes.manter_motivo" }, type: client.execute("functions", "emoji_button.type_button", client.cached.warns.get(interaction.user.id)?.keep), emoji: client.defaultEmoji("pen"), data: `4.${id_alvo}.${timestamp}`
            })

        return interaction.update({
            embeds: [embed],
            components: [client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })
    }

    dados = { id: id_alvo }
    require('../../chunks/panel_guild_browse_warns')({ client, user, interaction, dados })
}