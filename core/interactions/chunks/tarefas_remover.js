const { listAllUserTasks } = require('../../database/schemas/Task')

module.exports = async ({ client, user, interaction, autor_original }) => {

    // Verificando se o usuário desabilitou as tasks globais
    const tarefas = await (user?.conf.global_tasks ? listAllUserTasks(interaction.user.id) : listAllUserTasks(interaction.user.id, interaction.guild.id))

    if (tarefas.length < 1) // Sem tarefas
        return client.tls.reply(interaction, user, "util.tarefas.sem_lista_r", true, client.emoji(0))

    const data = {
        alvo: "tarefas_remover",
        values: tarefas
    }

    const obj = {
        content: "Selecione uma tarefa abaixo para remover",
        embeds: [],
        components: [client.create_menus({ client, interaction, user, data })],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    }

    if (!autor_original)
        obj.ephemeral = true

    client.reply(interaction, obj)
}