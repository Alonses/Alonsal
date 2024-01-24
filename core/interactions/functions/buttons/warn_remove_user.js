const { checkUserGuildWarned, dropAllUserGuildWarns } = require('../../../database/schemas/Warns')

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
        return require('../../chunks/verify_warn')({ client, user, interaction, dados })
    }

    if (operacao === 1) {

        // Removendo os warns e os cargos de advertências do usuário no servidor
        await dropAllUserGuildWarns(id_alvo, interaction.guild.id)
        client.verifyUserWarnRoles(id_alvo, interaction.guild.id, 10)

        // Verificando se há outros usuários com advertência no servidor para poder continuar editando
        let advertencias_server = await checkUserGuildWarned(id_guild), row

        const obj = {
            content: client.tls.phrase(user, "mode.report.usuario_removido", 10),
            embeds: [],
            components: [],
            ephemeral: true
        }

        if (advertencias_server.length > 0) {
            row = client.create_buttons([
                { id: "return_button", name: client.tls.phrase(user, "menu.botoes.ver_usuarios"), type: 0, emoji: client.emoji(19), data: "remove_warn" }
            ], interaction)

            obj.components.push(row)
        }

        return interaction.update(obj)
    }

    if (operacao === 2) {

        // Criando os botões para o menu de remoção de advertências do servidor
        const row = client.create_buttons([
            { id: "warn_remove_user", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1|${id_alvo}.${interaction.guild.id}` },
            { id: "warn_remove_user", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0|${id_alvo}.${interaction.guild.id}` }
        ], interaction)

        // Listando os botões para confirmar e cancelar a operação
        return interaction.update({
            components: [row]
        })
    }

    if (operacao === 3) {
        // Menu para navegar entre os usuários advertidos
        const advertencias_server = await checkUserGuildWarned(interaction.guild.id)

        if (advertencias_server.length < 1)
            return client.tls.reply(interaction, user, "mode.warns.sem_warns", true, 1)

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (advertencias_server.length < pagina * 24)
            pagina--

        const data = {
            alvo: "remove_warn",
            reback: "browse_button.warn_remove_user",
            operation: 3,
            values: advertencias_server
        }

        const obj = {
            content: client.tls.phrase(user, "mode.report.escolher_usuario_gerencia"),
            embeds: [],
            components: [client.create_menus({ client, interaction, user, data, pagina })],
            ephemeral: true
        }

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            obj.components.push(client.create_buttons(row, interaction))

        client.reply(interaction, obj)
    }
}