const { listAllUserGroupTasks } = require('../../../database/schemas/Task')
const { getUserGroup } = require('../../../database/schemas/Task_group')

module.exports = async ({ client, user, interaction, dados }) => {

    // Apagando uma lista especificada
    const lista_timestamp = dados.split(".")[1]
    const lista = await getUserGroup(interaction.user.id, parseInt(lista_timestamp))
    let tarefas

    client.atualiza_dados(lista, interaction)

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        tarefas = await listAllUserGroupTasks(interaction.user.id, lista.name)
    else
        tarefas = await listAllUserGroupTasks(interaction.user.id, lista.name, interaction.guild.id)

    const row = client.create_buttons([{ id: "delete_list", name: client.tls.phrase(user, "menu.botoes.cancelar"), value: '0', type: 1, data: 0 }, { id: "delete_list", name: client.tls.phrase(user, "menu.botoes.apagar"), value: '0', type: 3, data: `1|${lista_timestamp}` }], interaction)

    interaction.update({ content: client.tls.phrase(user, "util.tarefas.lista_confirmar_exclusao", 8).replace("tarefas_repl", tarefas.length), components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}