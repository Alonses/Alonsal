const { listAllUserGroups } = require('../../database/schemas/Task_group')
const { listAllUserGroupTasks } = require('../../database/schemas/Task')

module.exports = async ({ client, user, interaction, autor_original }) => {

    // Navegando por listas de tarefas
    // Verificando se o usuário desabilitou as tasks globais
    let listas = await (user?.conf.global_tasks ? listAllUserGroups(interaction.user.id) : listAllUserGroups(interaction.user.id, interaction.guild.id))

    // Listando listas
    if (listas.length < 1)
        return client.tls.reply(interaction, user, "util.tarefas.sem_lista_n", true, client.emoji(0))

    const data = {
        title: { tls: "util.tarefas.escolher_lista_navegar", emoji: 1 },
        alvo: "listas_navegar",
        values: listas
    }

    // Apenas uma lista criada
    if (listas.length === 1) {

        // Listando todas as tarefas vinculadas a lista criada
        const tarefas = await listAllUserGroupTasks(interaction.user.id, listas[0].timestamp)

        if (tarefas.length < 1)
            if (autor_original)
                return client.tls.report(interaction, user, "util.tarefas.sem_tarefa_l", client.decider(user?.conf.ghost_mode, 0), 1, interaction.customId)
            else
                return client.tls.reply(interaction, user, "util.tarefas.sem_tarefa_l", true, 1)

        data.title = { tls: "menu.menus.escolher_tarefa", emoji: [6, 1] }
        data.alvo = "tarefa_visualizar"
        data.values = tarefas
        data.operador = `k.${listas[0].timestamp}`
    }

    const obj = {
        content: client.tls.phrase(user, "util.tarefas.tarefa_escolher"),
        components: [client.create_menus({ client, interaction, user, data })],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    }

    if (!autor_original) {
        interaction.customId = null
        obj.ephemeral = true
    }

    client.reply(interaction, obj)
}