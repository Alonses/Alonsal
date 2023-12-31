const { spamTimeoutMap } = require('../../../database/schemas/Strikes')

const { getGuildWarn } = require('../../../database/schemas/Warns_guild')

const guildActions = {
    "none": null,
    "member_mute": 0,
    "member_kick_2": 1,
    "member_ban": 2
}

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    const id_warn = parseInt(dados.split(".")[2])
    let operacao = parseInt(dados.split(".")[1]), reback = `warn_configure_button.${id_warn}`

    const warn = await getGuildWarn(interaction.guild.id, id_warn) // Cria uma nova advertência caso o ID passado não exista
    const guild = await client.getGuild(interaction.guild.id)

    // Tratamento dos cliques
    // 1 -> Escolher penalidade
    // 2 -> Escolher cargo
    // 3 -> Escolher tempo de mute
    // 4 -> Atualizar advertência
    // 5 -> Criar uma nova advertência

    // 9 -> Guia de customização das advertências

    if (operacao === 1) {

        // Submenu para escoler a penalidade da advertência
        const eventos = []

        Object.keys(guildActions).forEach(evento => {
            if (evento !== warn.action)
                eventos.push({ type: evento, status: guild.logger[evento], id_warn: id_warn })
        })

        // Definindo os eventos que o log irá relatar no servidor
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "warn_config#events",
            reback: "browse_button.warn_configure_button",
            operation: operacao,
            values: eventos
        }

        const botoes = client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback }], interaction)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), botoes],
            ephemeral: true
        })

    } else if (operacao === 2) {

        // Submenu para escolher o cargo que será anexado com a advertência
        let cargos = []

        if (warn.role) // Opção de remover o cargo
            cargos.push({ name: "Nenhum cargo", id: 0 })

        // Listando todos os cargos do servidor
        cargos = cargos.concat(await client.getGuildRoles(interaction, warn.role))

        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "warn_config#role",
            reback: "browse_button.warn_configure_button",
            operation: operacao,
            submenu: id_warn,
            values: cargos
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24)
            pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback },
            { id: "warn_configure_button", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: `2.${id_warn}` }
        ]

        let row = client.menu_navigation(data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })

    } else if (operacao === 3) {

        // Submenu para escolher o escopo do tempo a ser aplicado
        const valores = []

        Object.keys(spamTimeoutMap).forEach(key => {
            valores.push(spamTimeoutMap[key])
        })

        // Definindo o tempo mínimo que um usuário deverá ficar mutado no servidor
        const data = {
            title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
            alvo: "warn_config_timeout",
            submenu: `${id_warn}.${operacao}`,
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: reback
        }], interaction)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), row],
            ephemeral: true
        })
    }

    require('../../chunks/warn_configure')({ client, user, interaction, dados })
}