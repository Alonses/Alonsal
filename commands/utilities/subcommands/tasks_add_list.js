const { createGroup, checkUserGroup } = require('../../../core/database/schemas/User_tasks_group')

module.exports = async ({ client, user, interaction }) => {

    let check_list

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        check_list = await checkUserGroup(user.uid, client.encrypt(interaction.options.getString("description")))
    else
        check_list = await checkUserGroup(user.uid, client.encrypt(interaction.options.getString("description")), client.encrypt(interaction.guild.id))

    if (check_list.length > 0) // Verificando se o nome da nova lista não existe ainda
        return client.tls.reply(interaction, user, "util.tarefas.lista_repetida", true, client.emoji(0))

    // Criando uma nova lista de tarefas
    createGroup(user.uid, client.encrypt(interaction.options.getString("description")), client.encrypt(interaction.guild.id), client.execute("timestamp"))

    client.tls.reply(interaction, user, "util.tarefas.lista_criada", client.decider(user?.conf.ghost_mode, 0), client.defaultEmoji("paper"))
}