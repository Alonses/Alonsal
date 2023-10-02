const { listAllUserTasks } = require('../../database/schemas/Task')

module.exports = async ({ client, user, interaction, autor_original }) => {

    let tarefas

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        tarefas = await listAllUserTasks(interaction.user.id)
    else
        tarefas = await listAllUserTasks(interaction.user.id, interaction.guild.id)

    if (tarefas.length < 1) // Sem tarefas
        return client.tls.reply(interaction, user, "util.tarefas.sem_lista_r", true, client.emoji(0))

    const data = {
        alvo: "tarefas_remover",
        values: tarefas
    }

    if (autor_original) {
        if (!interaction.customId)
            interaction.reply({
                content: "Selecione uma tarefa abaixo para remover",
                embeds: [],
                components: [client.create_menus(client, interaction, user, data)],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
        else
            interaction.update({
                content: "Selecione uma tarefa abaixo para remover",
                embeds: [],
                components: [client.create_menus(client, interaction, user, data)],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
    } else
        interaction.reply({
            content: "Selecione uma tarefa abaixo para remover",
            embeds: [],
            components: [client.create_menus(client, interaction, user, data)],
            ephemeral: true
        })
}