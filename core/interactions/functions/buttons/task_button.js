const { dropTask, getTask } = require('../../../database/schemas/Task')
const { listAllUserGroups } = require('../../../database/schemas/Task_group')

module.exports = async ({ client, user, interaction, dados }) => {

    // Gerenciamento de anotações
    const operacao = parseInt(dados.split(".")[1])
    const timestamp = parseInt(dados.split(".")[2])

    // Códigos de operação
    // 0 -> Apagar
    // 1 -> Finalizar tarefa
    // 2 -> Alterar de lista
    // 3 -> Reabrir tarefa

    if (operacao === 2) {

        let listas

        // Verificando se o usuário desabilitou as tasks globais
        if (client.decider(user?.conf.global_tasks, 1))
            listas = await listAllUserGroups(interaction.user.id)
        else
            listas = await listAllUserGroups(interaction.user.id, interaction.guild.id)

        const data = {
            alvo: "listas",
            values: listas,
            timestamp: timestamp
        }

        let row = client.create_buttons([
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `a|tarefas` }
        ], interaction)

        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.tarefa_lista", client.defaultEmoji("paper")),
            embeds: [],
            components: [client.create_menus(client, interaction, user, data), row],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }

    if (operacao === 0) {
        await dropTask(interaction.user.id, timestamp)

        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.tarefa_excluida", 10),
            embeds: [],
            components: [],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }

    if (operacao === 1) {

        const task = await getTask(interaction.user.id, timestamp)

        // Verificando se a task não possui algum servidor mencionado
        if (!task.sid)
            task.sid = interaction.guild.id

        task.concluded = true
        await task.save()

        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.tarefa_movida_1", 10),
            embeds: [],
            components: [],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }

    if (operacao === 3) {

        const task = await getTask(interaction.user.id, timestamp)

        // Verificando se a task não possui algum servidor mencionado
        if (!task.sid)
            task.sid = interaction.guild.id

        task.concluded = false
        await task.save()

        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.tarefa_movida_2", 10),
            embeds: [],
            components: [],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }
}