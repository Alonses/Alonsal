const { getTask } = require('../../../database/schemas/Task')
const { getUserGroup } = require('../../../database/schemas/Task_group')

module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    if (!autor_original)
        return interaction.reply({ content: "Você deve usar o comando </tasks add:1137792790143696992> para ter acesso a este botão!", ephemeral: true })

    const timestamp_lista = parseInt(dados.split(".")[1])
    const timestamp_task = parseInt(dados.split(".")[2])

    // Coletando os dados da tarefa
    const task = await getTask(interaction.user.id, timestamp_task)

    // Botão para retornar até as listas do usuário
    let row_2 = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "listas_navegar" }
    ], interaction)

    if (!task)
        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.tarefa_inexistente", 1),
            embeds: [],
            components: [row_2],
            ephemeral: true
        })

    // Atualizando os dados da lista
    const lista = await getUserGroup(interaction.user.id, timestamp_lista)

    if (!lista)
        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.lista_inexistente", 1),
            embeds: [],
            components: [row_2],
            ephemeral: true
        })

    client.atualiza_dados(task, interaction)
    client.atualiza_dados(lista, interaction)

    task.g_timestamp = timestamp_lista
    await task.save()

    // Botão para levar o usuário até a lista que foi incluída a tarefa
    let row = client.create_buttons([
        { id: "return_button", name: client.tls.phrase(user, "menu.botoes.ver_lista"), type: 1, emoji: client.defaultEmoji("paper"), data: `k.${timestamp_lista}` }
    ], interaction)

    interaction.update({
        content: client.replace(client.tls.phrase(user, "util.tarefas.tarefa_adicionada_2", client.defaultEmoji("paper")), lista.name),
        components: [row],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}