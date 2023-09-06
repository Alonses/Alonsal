const { listAllUserGroups } = require('../../../core/database/schemas/Task_group')

module.exports = async ({ client, user, interaction }) => {

    let listas

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        listas = await listAllUserGroups(interaction.user.id)
    else
        listas = await listAllUserGroups(interaction.user.id, interaction.guild.id)

    // Removendo listas
    if (listas.length < 1)
        return client.tls.reply(interaction, user, "util.tarefas.sem_lista_r", true, client.emoji(0))

    const data = {
        alvo: "listas_remover",
        values: listas
    }

    interaction.reply({
        content: client.tls.phrase(user, "util.tarefas.lista_e", 1),
        components: [client.create_menus(client, interaction, user, data)],
        ephemeral: client.decider(user?.conf.ghost_mode, 0)
    })
}