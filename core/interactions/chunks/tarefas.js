const { listAllUserTasks, listAllUserGroupTasks } = require('../../database/schemas/User_tasks')

module.exports = async ({ client, user, interaction, operador, autor_original }) => {

    if (!autor_original) // Redirecionando o usuário secundário
        return require('./listas_navegar')({ client, user, interaction, autor_original })

    if (!operador.includes("x") && !operador.includes("k")) {

        const casos = {
            aberto: 0,
            finalizado: 0
        }

        // Verificando se o usuário desabilitou as tasks globais
        const tarefas = await (user?.conf.global_tasks ? listAllUserTasks(user.uid) : listAllUserTasks(user.uid, client.encrypt(interaction.guild.id)))

        // Validando se há tasks registradas para o usuário
        if (tarefas.length < 1)
            return client.tls.report(interaction, user, "util.tarefas.sem_tarefa", true, client.emoji(0), interaction.customId)

        tarefas.forEach(tarefa => {

            if (tarefa.concluded)
                casos.finalizado++
            else
                casos.aberto++

            // Descriptografando o ID momentaneamente
            tarefa.uid = client.decifer(tarefa.uid)
        })

        if (operador === "a|tarefas") {
            // Tarefas abertas
            if (casos.aberto < 1)
                return client.tls.report(interaction, user, "util.tarefas.sem_tarefa_a", true, client.emoji(0), interaction.customId)

            const data = {
                title: { tls: "menu.menus.escolher_tarefa" },
                pattern: "tasks",
                alvo: "tarefas",
                values: filtra_tarefas(tarefas, 0),
                operador: operador
            }

            return client.reply(interaction, {
                content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                embeds: [],
                components: [client.create_menus({ client, interaction, user, data })],
                flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
            })
        }

        if (operador === "f|tarefas") {
            // Tarefas finalizadas
            if (casos.finalizado < 1)
                return client.tls.report(interaction, user, "util.tarefas.sem_tarefa_f", true, client.emoji(0), interaction.customId)

            const data = {
                title: { tls: "menu.menus.escolher_tarefa" },
                pattern: "tasks",
                alvo: "tarefas",
                values: filtra_tarefas(tarefas, 1),
                operador: "f"
            }

            return client.reply(interaction, {
                content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                embeds: [],
                components: [client.create_menus({ client, interaction, user, data })],
                flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
            })
        }
    } else if (operador.includes("k")) {

        // Retornando a lista superior ( apenas uma lista criada )
        const lista_timestamp = parseInt(operador.split("|")[1])

        // Retornando o usuário para a lista escolhida anteriormente
        const tarefas = await listAllUserGroupTasks(user.uid, lista_timestamp)

        if (tarefas.length < 1) {

            // Botão para retornar até as listas do usuário
            let row = client.create_buttons([
                { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "listas_navegar" }
            ], interaction)

            return interaction.update({
                content: client.tls.phrase(user, "util.tarefas.sem_tarefa_l", 1),
                components: [row],
                flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
            })
        }

        tarefas.forEach(tarefa => { // Descriptografando o ID momentaneamente
            tarefa.uid = client.decifer(tarefa.uid)
        })

        const data = {
            title: { tls: "menu.menus.escolher_tarefa" },
            pattern: "tasks",
            alvo: "tarefa_visualizar",
            values: tarefas,
            operador: `k.${lista_timestamp}`
        }

        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
            embeds: [],
            components: [client.create_menus({ client, interaction, user, data })],
            flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
        })

    } else {

        const lista_timestamp = parseInt(operador.split("|")[1])

        // Retornando o usuário para a lista escolhida anteriormente
        const tarefas = await listAllUserGroupTasks(user.uid, lista_timestamp)

        if (tarefas.length < 1) {

            // Botão para retornar até as listas do usuário
            let row = client.create_buttons([
                { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "listas_navegar" }
            ], interaction)

            return interaction.update({
                content: client.tls.phrase(user, "util.tarefas.sem_tarefa_l", 1),
                components: [row],
                flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
            })
        }

        tarefas.forEach(tarefa => { // Descriptografando o ID momentaneamente
            tarefa.uid = client.decifer(tarefa.uid)
        })

        const data = {
            title: { tls: "menu.menus.escolher_tarefa" },
            pattern: "tasks",
            alvo: "tarefa_visualizar",
            values: tarefas,
            operador: `x.${lista_timestamp}`
        }

        const row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "listas_navegar" }
        ], interaction)

        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
            embeds: [],
            components: [client.create_menus({ client, interaction, user, data }), row],
            flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
        })
    }
}

filtra_tarefas = (tarefas, caso) => {

    const array = []

    // Filtrando o array para o estado de conclusão
    for (let i = 0; i < tarefas.length; i++)
        if (tarefas[i].concluded == caso)
            array.push(tarefas[i])

    return array
}