const { dropTask } = require('../../../database/schemas/User_tasks')

module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    const operacao = parseInt(dados.split(".")[1])

    if (!autor_original) // Redirecionando o usuário secundário
        return require('../../chunks/tarefas_remover')({ client, user, interaction, autor_original })

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    // Gerenciamento de tarefas
    if (!operacao) {

        let row = client.create_buttons([
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "tarefas_remover" }
        ], interaction, user)

        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.exclusao_tarefa_cancelada", client.defaultEmoji("paper")),
            embeds: [],
            components: [row],
            flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
        })
    }

    // Apagando a tarefa
    const tarefa_timestamp = parseInt(dados.split(".")[2])

    await dropTask(user.uid, tarefa_timestamp)

    // Botão para retornar até as listas do usuário
    let row = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: "listas_navegar" }
    ], interaction, user)

    interaction.update({
        content: client.tls.phrase(user, "util.tarefas.exclusao_tarefa", 13),
        embeds: [],
        components: [row],
        flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
    })
}