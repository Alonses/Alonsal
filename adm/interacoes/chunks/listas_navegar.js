const { listAllUserGroups } = require('../../database/schemas/Task_group')
const { listAllUserGroupTasks } = require('../../database/schemas/Task')

module.exports = async ({ client, user, interaction }) => {

    // Navegando por listas de tarefas
    let listas

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        listas = await listAllUserGroups(interaction.user.id)
    else
        listas = await listAllUserGroups(interaction.user.id, interaction.guild.id)

    // Listando listas
    if (listas.length < 1)
        return client.tls.reply(interaction, user, "util.tarefas.sem_lista_n", true, 0)

    const data = {
        title: client.tls.phrase(user, "util.tarefas.lista_escolher", 1),
        alvo: "listas_navegar",
        values: listas
    }

    // Apenas uma lista criada
    if (listas.length === 1) {

        // Listando todas as tarefas vinculadas a lista criada
        const tarefas = await listAllUserGroupTasks(interaction.user.id, listas[0].timestamp)

        if (tarefas.length < 1)
            return client.tls.report(interaction, user, "util.tarefas.sem_tarefa_l", client.decider(user?.conf.ghost_mode, 0), 1, interaction.customId)

        data.title = `:mega: | ${client.tls.phrase(user, "util.tarefas.tarefa_escolher", 1)}`
        data.alvo = "tarefa_visualizar"
        data.values = tarefas
        data.operador = `k.${listas[0].timestamp}`
    }

    if (!interaction.customId)
        interaction.reply({ content: data.title, components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    else
        interaction.update({ content: data.title, components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}