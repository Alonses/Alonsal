const { listAllUserGroupTasks } = require('../../../database/schemas/Task')
const { getUserGroup } = require('../../../database/schemas/Task_group')

module.exports = async ({ client, user, interaction, dados }) => {

    // Selecionando uma lista para visualizar as tarefas incluídas nela
    const lista_timestamp = dados.split(".")[1]
    const lista = await getUserGroup(interaction.user.id, parseInt(lista_timestamp))
    let tarefas

    // Atualiza os dados das tarefas e listas
    client.atualiza_dados(lista, interaction)

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        tarefas = await listAllUserGroupTasks(interaction.user.id, lista.name)
    else
        tarefas = await listAllUserGroupTasks(interaction.user.id, lista.name, interaction.guild.id)

    if (tarefas.length < 1)
        return interaction.reply({ content: ":mag: | Não há nenhuma tarefa anexada à essa lista ainda!", ephemeral: client.decider(user?.conf.ghost_mode, 0) })

    const data = {
        alvo: "tarefa_visualizar",
        values: tarefas
    }

    interaction.update({ content: ":mag: | Escolha uma das tarefas abaixo para mais detalhes", components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}