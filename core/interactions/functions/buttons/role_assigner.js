const { PermissionsBitField } = require('discord.js')

const { getRoleAssigner } = require('../../../database/schemas/Role_assigner')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "role_assigner"

    // Operações
    // 0 -> Retorna ao original

    // 1 -> Iniciar atribuição
    // 2 -> Escolher cargos
    // 3 -> Escolher cargos ignorados

    // 4 -> Remover todos os cargos para atribuir
    // 5 -> Remover todos os cargos para ignorar

    // 10 -> Confirmar atribuição de cargos para o servidor

    const cargos = await getRoleAssigner(interaction.guild.id)

    if (operacao === 1) {

        let botoes = [
            { id: "role_assigner", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "role_assigner", name: "Confirmar", type: 2, emoji: client.emoji(10), data: "10" }
        ]

        return client.reply(interaction, {
            components: [client.create_buttons(botoes, interaction)]
        })

    } else if (operacao === 2) {

        // Permissão para atualizar os cargos de membros do servidor
        if (!await client.permissions(interaction, client.id(), PermissionsBitField.Flags.ManageRoles))
            return interaction.update({
                content: client.tls.phrase(user, "mode.anuncio.permissao_cargos", 7),
                ephemeral: true
            })

        // Definindo o cargo que receberá o avisos de games free
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "role_assigner_give#role",
            reback: "browse_button.role_assigner",
            operation: operacao,
            values: await client.getGuildRoles(interaction)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "role_assigner", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "2" }
        ]

        if (cargos.atribute)
            botoes.push({ id: "role_assigner", name: client.tls.phrase(user, "menu.botoes.remover_todos"), type: 3, emoji: client.emoji(13), data: "4" })

        const multi_select = true
        let row = client.menu_navigation(client, user, data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina, multi_select }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })

    } else if (operacao === 3) {

        // Permissão para atualizar os cargos de membros do servidor
        if (!await client.permissions(interaction, client.id(), PermissionsBitField.Flags.ManageRoles))
            return interaction.update({
                content: client.tls.phrase(user, "mode.anuncio.permissao_cargos", 7),
                ephemeral: true
            })

        // Definindo o cargo que receberá o avisos de games free
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "role_assigner_ignore#role",
            reback: "browse_button.role_assigner",
            operation: operacao,
            values: [{ name: client.tls.phrase(user, "mode.roles.se_possuir_cargo"), id: "all" }]
        }

        const cargos_server = await client.getGuildRoles(interaction)
        data.values = data.values.concat(cargos_server)

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "role_assigner", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: "3" }
        ]

        if (cargos.ignore)
            botoes.push({ id: "role_assigner", name: client.tls.phrase(user, "menu.botoes.remover_todos"), type: 3, emoji: client.emoji(13), data: "5" })

        const multi_select = true
        let row = client.menu_navigation(client, user, data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina, multi_select }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })
    }

    if (operacao === 10) // Atribuindo os cargos selecionados aos usuários do servidor
        return require('../../../auto/role_assigner')({ client, user, interaction })

    if (operacao === 11) { // Interrompendo a atribuição de cargos aos usuários do servidor
        const force_stop = true
        return require('../../../auto/role_assigner')({ client, user, interaction, force_stop })
    }

    // Removendo os cargos salvos em cache
    if (operacao === 4)
        cargos.atribute = null
    else if (operacao === 5)
        cargos.ignore = null

    await cargos.save()

    require('../../chunks/role_assigner')({ client, user, interaction })
}