const { SlashCommandBuilder } = require('discord.js')

const { createTask } = require('../../adm/database/schemas/Task')
const { listAllUserGroups, createGroup, checkUserGroup } = require('../../adm/database/schemas/Task_group')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tasks")
        .setNameLocalizations({
            "pt-BR": 'tarefas',
            "es-ES": 'tareas',
            "fr": 'taches',
            "it": 'appunti',
            "ru": 'задания'
        })
        .setDescription("⌠💡⌡ Create tasks and lists")
        .addSubcommand(subcommand =>
            subcommand
                .setName("available")
                .setNameLocalizations({
                    "pt-BR": "disponiveis",
                    "es-ES": 'disponible',
                    "fr": 'disponible',
                    "it": 'disponibile',
                    "ru": 'горничные'
                })
                .setDescription("⌠💡⌡ View tasks in progress")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Veja as tarefas em progresso',
                    "es-ES": '⌠💡⌡ Ver tareas en curso',
                    "fr": '⌠💡⌡ Voir les tâches en cours',
                    "it": '⌠💡⌡ Visualizza le attività in corso',
                    "ru": '⌠💡⌡ Просмотр текущих задач'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("completed")
                .setNameLocalizations({
                    "pt-BR": "concluidas",
                    "es-ES": 'terminado',
                    "fr": 'complete',
                    "it": 'completato',
                    "ru": 'заключил'
                })
                .setDescription("⌠💡⌡ View completed tasks")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Veja as tarefas finalizadas',
                    "es-ES": '⌠💡⌡ Ver tareas completadas',
                    "fr": '⌠💡⌡ Afficher les tâches terminées',
                    "it": '⌠💡⌡ Visualizza le attività completate',
                    "ru": '⌠💡⌡ Просмотр выполненных задач'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("lists")
                .setNameLocalizations({
                    "pt-BR": "listas",
                    "es-ES": 'lista',
                    "fr": 'listes',
                    "it": 'elenchi',
                    "ru": 'списки'
                })
                .setDescription("⌠💡⌡ Navigate tasks using lists")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Navegue pelas tarefas usando listas',
                    "es-ES": '⌠💡⌡ Navega por tareas usando listas',
                    "fr": '⌠💡⌡ Naviguez dans les tâches à l\'aide de listes',
                    "it": '⌠💡⌡ Naviga tra le attività utilizzando gli elenchi',
                    "ru": '⌠💡⌡ Навигация по задачам со списками'
                }))
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName("add")
                .setDescription("⌠💡⌡ Add tasks and lists")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("task")
                        .setNameLocalizations({
                            "pt-BR": 'tarefa',
                            "es-ES": 'tarea',
                            "fr": 'tache',
                            "it": 'compito',
                            "ru": 'задача'
                        })
                        .setDescription("⌠💡⌡ Crie uma tarefa nova")
                        .setDescriptionLocalizations({
                            "pt-BR": '⌠💡⌡ Crie uma tarefa nova',
                            "es-ES": '⌠💡⌡ Crear una nueva tarea',
                            "fr": '⌠💡⌡ Créer une nouvelle tâche',
                            "it": '⌠💡⌡ Crea una nuova compito',
                            "ru": '⌠💡⌡ Создать новую задачу'
                        })
                        .addStringOption(option =>
                            option.setName("description")
                                .setNameLocalizations({
                                    "pt-BR": 'descricao',
                                    "es-ES": 'descripcion',
                                    "it": 'descrizione',
                                    "ru": 'описание'
                                })
                                .setDescription("What will be noted?")
                                .setDescriptionLocalizations({
                                    "pt-BR": 'O que será anotado?',
                                    "es-ES": 'Describe tu tarea',
                                    "fr": 'Décrivez votre tâche',
                                    "it": 'Descrivi il tuo compito',
                                    "ru": 'опишите вашу задачу'
                                })
                                .setRequired(true)))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setNameLocalizations({
                            "pt-BR": "lista",
                            "es-ES": 'lista',
                            "fr": 'liste',
                            "it": 'elenco',
                            "ru": 'список'
                        })
                        .setDescription("⌠💡⌡ Add a list")
                        .setDescriptionLocalizations({
                            "pt-BR": '⌠💡⌡ Adicione uma lista',
                            "es-ES": '⌠💡⌡ Añadir lista',
                            "fr": '⌠💡⌡ Ajouter une liste',
                            "it": '⌠💡⌡ Aggiungi elenco',
                            "ru": '⌠💡⌡ Добавить список'
                        })
                        .addStringOption(option =>
                            option.setName("description")
                                .setNameLocalizations({
                                    "pt-BR": 'descricao',
                                    "es-ES": 'descripcion',
                                    "it": 'descrizione',
                                    "ru": 'описание'
                                })
                                .setDescription("What will the name of the list be?")
                                .setDescriptionLocalizations({
                                    "pt-BR": 'Qual será o nome da lista?',
                                    "es-ES": '¿Cuál será el nombre de la lista?',
                                    "fr": 'Quel sera le nom de la liste?',
                                    "it": 'Quale sarà il nome della lista?',
                                    "ru": 'Как будет называться список?'
                                })
                                .setRequired(true))))
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName("remove")
                .setDescription("⌠💡⌡ Remove listas")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setNameLocalizations({
                            "pt-BR": 'lista',
                            "es-ES": 'lista',
                            "fr": 'liste',
                            "it": 'elenco',
                            "ru": 'список'
                        })
                        .setDescription("⌠💡⌡ Remove an list")
                        .setDescriptionLocalizations({
                            "pt-BR": '⌠💡⌡ Remova uma lista',
                            "es-ES": '⌠💡⌡ Eliminar lista',
                            "fr": '⌠💡⌡ Supprimer la liste',
                            "it": '⌠💡⌡ Elimina elenco',
                            "ru": '⌠💡⌡ Удалить список'
                        }))),
    async execute(client, user, interaction) {

        if (!interaction.options.getSubcommandGroup()) {
            if (interaction.options.getSubcommand() === "available") { // Tarefas disponíveis
                const operador = "a|tarefas"
                return require('../../adm/interacoes/chunks/tarefas')({ client, user, interaction, operador })
            } else if (interaction.options.getSubcommand() === "completed") { // Tarefas completadas
                const operador = "f|tarefas"
                return require('../../adm/interacoes/chunks/tarefas')({ client, user, interaction, operador })
            } else
                return require('../../adm/interacoes/chunks/listas_navegar')({ client, user, interaction })
        } else {

            const timestamp = parseInt(new Date() / 1000)

            if (interaction.options.getSubcommandGroup() === "add") {
                if (interaction.options.getSubcommand() === "task") {

                    // Criando uma nova tarefa
                    let listas

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
                } else {

                    let check_list

                    // Verificando se o usuário desabilitou as tasks globais
                    if (client.decider(user?.conf.global_tasks, 1))
                        check_list = await checkUserGroup(interaction.user.id, interaction.options.getString("description"))
                    else
                        check_list = await checkUserGroup(interaction.user.id, interaction.options.getString("description"), interaction.guild.id)

                    if (check_list.length > 0) // Verificando se o nome da nova lista não existe ainda
                        return client.tls.reply(interaction, user, "util.tarefas.lista_repetida", true, client.emoji(0))

                    // Criando a lista
                    createGroup(interaction.user.id, interaction.options.getString("description"), interaction.guild.id, timestamp)

                    client.tls.reply(interaction, user, "util.tarefas.lista_criada", client.decider(user?.conf.ghost_mode, 0), client.defaultEmoji("paper"))
                }
            } else {

                // Excluindo tarefas e listas
                if (interaction.options.getSubcommand() === "list") {

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
            }
        }
    }
}