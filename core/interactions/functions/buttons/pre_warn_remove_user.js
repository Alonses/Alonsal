const { checkUserGuildPreWarned, dropAllUserGuildPreWarns, listAllUserPreWarns } = require('../../../database/schemas/User_pre_warns')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancelar
    // 1 -> Confirma remoção
    // 2 -> Menu para confirmar a escolha de remoção
    // 3 -> Menu para escolher o usuário

    const id_alvo = dados.split(".")[2]
    const id_guild = dados.split(".")[3]

    if (operacao === 0) { // Operação cancelada ( retorna ao embed do usuário )

        dados = `${id_alvo}.${id_guild}.${pagina}`
        return require('../../chunks/verify_pre_warn')({ client, user, interaction, dados })

    } else if (operacao === 1) {

        const user_warn = await listAllUserPreWarns(client.encrypt(id_alvo), client.encrypt(interaction.guild.id))

        // Removendo as anotações do membro no servidor
        dropAllUserGuildPreWarns(client.encrypt(id_alvo), client.encrypt(interaction.guild.id))

        // Verificando se há outros usuários com advertência no servidor para poder continuar editando
        let anotacoes_server = await checkUserGuildPreWarned(client.encrypt(id_guild)), row

        const obj = {
            content: client.tls.phrase(user, "mode.warn.advertencias_removidas", 10),
            embeds: [],
            components: [],
            flags: "Ephemeral"
        }

        if (anotacoes_server.length > 0) {
            row = client.create_buttons([
                { id: "return_button", name: { tls: "menu.botoes.ver_usuarios", alvo: user }, type: 0, emoji: client.emoji(19), data: "remove_pre_warn" }
            ], interaction)

            obj.components.push(row)
        }

        const guild = await client.getGuild(interaction.guild.id)

        if (guild.warn.notify_exclusion) { // Embed de aviso que o membro teve uma advertência apagada
            const embed = client.create_embed({
                title: "mode.anotacoes.reiniciadas",
                color: "salmao",
                description: { tls: "mode.anotacoes.reinciadas_descricao", replace: id_alvo },
                fields: [
                    {
                        name: `:bust_in_silhouette: **${client.tls.phrase(guild, "mode.report.usuario")}**`,
                        value: `${client.emoji("icon_id")} \`${id_alvo}\`\n${client.emoji("mc_name_tag")} \`${client.decifer(user_warn[0].nick)}\`\n( <@${id_alvo}> )`,
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

        return interaction.update(obj)

    } else if (operacao === 2) {

        // Criando os botões para o menu de remoção de anotações de advertências do servidor
        const row = client.create_buttons([
            { id: "pre_warn_remove_user", name: { tls: "menu.botoes.confirmar", alvo: user }, type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${interaction.guild.id}` },
            { id: "pre_warn_remove_user", name: { tls: "menu.botoes.cancelar", alvo: user }, type: 3, emoji: client.emoji(0), data: `0|${id_alvo}.${interaction.guild.id}` }
        ], interaction)

        // Listando os botões para confirmar e cancelar a operação
        return interaction.update({
            components: [row]
        })

    } else if (operacao === 3) {

        // Menu para navegar entre os usuários com anotações com anotações
        const anotacoes_server = await checkUserGuildPreWarned(client.encrypt(interaction.guild.id))

        if (anotacoes_server.length < 1)
            return client.tls.reply(interaction, user, "mode.warns.sem_warns", true, 1)

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (anotacoes_server.length < pagina * 24) pagina--

        const data = {
            title: { tls: "menu.menus.escolher_usuario" },
            pattern: "reports",
            alvo: "remove_pre_warn",
            reback: "browse_button.pre_warn_remove_user",
            operation: 3,
            values: anotacoes_server
        }

        const obj = {
            content: client.tls.phrase(user, "mode.report.escolher_usuario_gerencia"),
            embeds: [],
            components: [client.create_menus({ interaction, user, data, pagina })],
            flags: "Ephemeral"
        }

        let row = client.menu_navigation(user, data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            obj.components.push(client.create_buttons(row, interaction))

        client.reply(interaction, obj)
    }
}