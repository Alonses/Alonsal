const { dropTaskByGroup } = require('../../../database/schemas/Task')
const { getUserGroup, dropGroup } = require('../../../database/schemas/Task_group')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    // Gerenciamento de listas de tarefas
    if (!operacao)
        return interaction.update({ content: `${client.defaultEmoji("paper")} | Exclusão da lista de tarefas cancelada.`, embeds: [], components: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })

    // Apagando a lista especificada e as tarefas vinculadas a ela
    const lista_timestamp = parseInt(dados.split(".")[2])
    const lista = await getUserGroup(interaction.user.id, lista_timestamp)

    await dropTaskByGroup(interaction.user.id, lista.name)
    await dropGroup(interaction.user.id, lista.timestamp)

    interaction.update({ content: ":wastebasket: | `Lista` e `tarefas` vinculadas excluídas com sucesso!", embeds: [], components: [], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}