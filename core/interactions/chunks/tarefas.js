const { listAllUserTasks, listAllUserGroupTasks } = require('../../database/schemas/Task')

module.exports = async ({ client, user, interaction, operador, autor_original }) => {

    if (!operador.includes("x") && !operador.includes("k")) {

        const casos = {
            aberto: 0,
            finalizado: 0
        }

        let tarefas

        // Verificando se o usuário desabilitou as tasks globais
        if (client.decider(user?.conf.global_tasks, 1))
            tarefas = await listAllUserTasks(interaction.user.id)
        else
            tarefas = await listAllUserTasks(interaction.user.id, interaction.guild.id)

        // Validando se há tasks registradas para o usuário
        if (tarefas.length < 1)
            return client.tls.report(interaction, user, "util.tarefas.sem_tarefa", true, client.emoji(0), interaction.customId)

        for (let i = 0; i < tarefas.length; i++) {
            if (tarefas[i].concluded)
                casos.finalizado++
            else
                casos.aberto++
        }

        if (operador === "a|tarefas") {
            // Tarefas abertas
            if (casos.aberto < 1)
                if (autor_original)
                    return client.tls.report(interaction, user, "util.tarefas.sem_tarefa_a", true, client.emoji(0), interaction.customId)
                else
                    return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa_a", true, client.emoji(0))

            const data = {
                alvo: "tarefas",
                values: filtra_tarefas(tarefas, 0),
                operador: operador
            }

            if (autor_original) {
                if (!interaction.customId) // Interação original
                    interaction.reply({
                        content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                        embeds: [],
                        components: [client.create_menus(client, interaction, user, data)],
                        ephemeral: client.decider(user?.conf.ghost_mode, 0)
                    })
                else // Interação por botões/menus

                    interaction.update({
                        content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                        embeds: [],
                        components: [client.create_menus(client, interaction, user, data)],
                        ephemeral: client.decider(user?.conf.ghost_mode, 0)
                    })
            } else // Envia uma interação secundária efémera para o usuário que não é o autor original
                interaction.reply({
                    content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                    embeds: [],
                    components: [client.create_menus(client, interaction, user, data)],
                    ephemeral: true
                })
        }

        if (operador === "f|tarefas") {
            // Tarefas finalizadas
            if (casos.finalizado < 1)
                if (autor_original)
                    return client.tls.report(interaction, user, "util.tarefas.sem_tarefa_f", true, client.emoji(0), interaction.customId)
                else
                    return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa_f", true, client.emoji(0))

            const data = {
                alvo: "tarefas",
                values: filtra_tarefas(tarefas, 1),
                operador: "f"
            }

            if (autor_original) {
                if (!interaction.customId)
                    interaction.reply({
                        content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                        embeds: [],
                        components: [client.create_menus(client, interaction, user, data)],
                        ephemeral: client.decider(user?.conf.ghost_mode, 0)
                    })
                else
                    interaction.update({
                        content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                        embeds: [],
                        components: [client.create_menus(client, interaction, user, data)],
                        ephemeral: client.decider(user?.conf.ghost_mode, 0)
                    })
            } else // Envia uma interação secundária efémera para o usuário que não é o autor original
                interaction.reply({
                    content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                    embeds: [],
                    components: [client.create_menus(client, interaction, user, data)],
                    ephemeral: true
                })
        }
    } else if (operador.includes("k")) {

        // Retornando a lista superior ( apenas uma lista criada )
        const lista_timestamp = parseInt(operador.split("|")[1])

        // Retornando o usuário para a lista escolhida anteriormente
        const tarefas = await listAllUserGroupTasks(interaction.user.id, lista_timestamp)

        if (tarefas.length < 1)
            if (autor_original) {

                // Botão para retornar até as listas do usuário
                let row = client.create_buttons([
                    { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `listas_navegar` }
                ], interaction)

                return interaction.update({
                    content: client.tls.phrase(user, "util.tarefas.sem_tarefa_l", 1),
                    components: [row],
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
            } else
                return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa_l", true, 1)

        const data = {
            alvo: "tarefa_visualizar",
            values: tarefas,
            operador: `k.${lista_timestamp}`
        }

        interaction.update({
            content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
            embeds: [],
            components: [client.create_menus(client, interaction, user, data)],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })

    } else {

        const lista_timestamp = parseInt(operador.split("|")[1])

        // Retornando o usuário para a lista escolhida anteriormente
        const tarefas = await listAllUserGroupTasks(interaction.user.id, lista_timestamp)

        if (tarefas.length < 1)
            if (autor_original) {

                // Botão para retornar até as listas do usuário
                let row = client.create_buttons([
                    { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `listas_navegar` }
                ], interaction)

                return interaction.update({
                    content: client.tls.phrase(user, "util.tarefas.sem_tarefa_l", 1),
                    components: [row],
                    ephemeral: client.decider(user?.conf.ghost_mode, 0)
                })
            } else
                return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa_l", true, 1)

        const data = {
            alvo: "tarefa_visualizar",
            values: tarefas,
            operador: `x.${lista_timestamp}`
        }

        const row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `listas_navegar` }
        ], interaction)

        if (autor_original)
            interaction.update({
                content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                embeds: [],
                components: [client.create_menus(client, interaction, user, data), row],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
        else
            interaction.reply({
                content: client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1),
                embeds: [],
                components: [client.create_menus(client, interaction, user, data), row],
                ephemeral: true
            })
    }
}

function filtra_tarefas(tarefas, caso) {

    const array = []

    // Filtrando o array para o estado de conclusão
    for (let i = 0; i < tarefas.length; i++)
        if (tarefas[i].concluded == caso)
            array.push(tarefas[i])

    return array
}