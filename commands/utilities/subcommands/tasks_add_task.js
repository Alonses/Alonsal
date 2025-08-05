const { createTask } = require('../../../core/database/schemas/User_tasks')
const { listAllUserGroups } = require('../../../core/database/schemas/User_tasks_group')

module.exports = async ({ client, user, interaction }) => {

    // Criando uma nova tarefa
    let listas, timestamp = client.timestamp()

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        listas = await listAllUserGroups(user.uid)
    else
        listas = await listAllUserGroups(user.uid, client.encrypt(interaction.guild.id))

    if (listas.length < 1)
        return client.tls.reply(interaction, user, "util.tarefas.sem_lista", true, client.emoji(0))

    const task = await createTask(user.uid, client.encrypt(interaction.guild.id), client.encrypt(interaction.options.getString("description")), timestamp)

    // Adicionando a tarefa a uma lista automaticamente caso só exista uma lista
    if (listas.length == 1) {
        task.g_timestamp = listas[0].timestamp
        await task.save()

        // Verificando se a lista não possui algum servidor mencionado
        if (!listas[0].sid) {
            listas[0].sid = client.encrypt(interaction.guild.id)
            await listas[0].save()
        }

        return client.reply(interaction, {
            content: `${client.tls.phrase(user, "util.tarefas.tarefa_adicionada", client.defaultEmoji("paper"))} \`${listas[0].name}\`!`,
            flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
        })
    } else {

        // Exibindo todas as listas para o usuário vincular a tarefa a uma lista
        const data = {
            title: { tls: "util.tarefas.escolher_lista_vincular" },
            pattern: "lists",
            alvo: "listas",
            values: listas,
            timestamp: timestamp
        }

        client.reply(interaction, {
            content: client.tls.phrase(user, "util.tarefas.tarefa_lista", 1),
            components: [client.create_menus({ interaction, user, data })],
            flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
        })
    }
}