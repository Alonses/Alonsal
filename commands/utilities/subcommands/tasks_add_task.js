const { createTask } = require('../../../core/database/schemas/Task')
const { listAllUserGroups } = require('../../../core/database/schemas/Task_group')

module.exports = async ({ client, user, interaction }) => {

    // Criando uma nova tarefa
    let listas, timestamp = client.timestamp()

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        listas = await listAllUserGroups(interaction.user.id)
    else
        listas = await listAllUserGroups(interaction.user.id, interaction.guild.id)

    if (listas.length < 1)
        return client.tls.reply(interaction, user, "util.tarefas.sem_lista", true, client.emoji(0))

    const task = await createTask(interaction.user.id, interaction.guild.id, interaction.options.getString("description"), timestamp)

    // Adicionando a tarefa a uma lista automaticamente caso só exista uma lista
    if (listas.length == 1) {
        task.g_timestamp = listas[0].timestamp
        await task.save()

        // Verificando se a lista não possui algum servidor mencionado
        if (typeof listas[0].sid === "undefined") {
            listas[0].sid = interaction.guid.id
            await listas[0].save()
        }

        return interaction.reply({
            content: `${client.tls.phrase(user, "util.tarefas.tarefa_adicionada", client.defaultEmoji("paper"))} \`${listas[0].name}\`!`,
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    } else {

        // Exibindo todas as listas para o usuário vincular a tarefa a uma lista
        const data = {
            alvo: "listas",
            values: listas,
            timestamp: timestamp
        }

        interaction.reply({
            content: client.tls.phrase(user, "util.tarefas.tarefa_lista", 1),
            components: [client.create_menus(client, interaction, user, data)],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }
}