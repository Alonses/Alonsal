const { dropTaskByGroup } = require('../../../database/schemas/Task')
const { dropGroup } = require('../../../database/schemas/Task_group')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    // Gerenciamento de listas de tarefas
    if (!operacao)
        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.exclusao_lista_cancelada", client.defaultEmoji("paper")),
            embeds: [],
            components: [],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })

    // Apagando a lista especificada e as tarefas vinculadas a ela
    const lista_timestamp = parseInt(dados.split(".")[2])

    await dropTaskByGroup(interaction.user.id, lista_timestamp)
    await dropGroup(interaction.user.id, lista_timestamp)

    interaction.update({
        content: client.tls.phrase(user, "util.tarefas.exclusao_lista", 13),
        embeds: [],
        components: [],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}