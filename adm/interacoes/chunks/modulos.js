const { listAllUserModules } = require('../../database/schemas/Module')

module.exports = async ({ client, user, interaction }) => {

    // Listando todos os módulos do usuário
    let modulos = await listAllUserModules(interaction.user.id)

    // Listando listas
    if (modulos.length < 1)
        return client.tls.reply(interaction, user, "util.tarefas.sem_lista_n", true, 0)

    const data = {
        title: client.tls.phrase(user, "util.tarefas.lista_escolher", 1),
        alvo: "modulo_visualizar",
        values: modulos
    }

    if (!interaction.customId)
        interaction.reply({ content: data.title, components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    else
        interaction.update({ content: data.title, components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}