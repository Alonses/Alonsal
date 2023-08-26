const { SlashCommandBuilder } = require('discord.js')

const { createTask } = require('../../adm/database/schemas/Task')
const { listAllUserGroups, createGroup, checkUserGroup } = require('../../adm/database/schemas/Task_group')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tasks")
        .setNameLocalizations({
            "de": 'aufgaben',
            "es-ES": 'tareas',
            "fr": 'taches',
            "it": 'appunti',
            "pt-BR": 'tarefas',
            "ru": 'задания'
        })
        .setDescription("⌠💡⌡ Create tasks and lists")
        .addSubcommand(subcommand =>
            subcommand
                .setName("available")
                .setNameLocalizations({
                    "de": 'verfügbar',
                    "es-ES": 'disponible',
                    "fr": 'disponible',
                    "it": 'disponibile',
                    "pt-BR": "disponiveis",
                    "ru": 'горничные'
                })
                .setDescription("⌠💡⌡ View tasks in progress")
                .setDescriptionLocalizations({
                    "de": '⌠💡⌡ Laufende Aufgaben anzeigen',
                    "es-ES": '⌠💡⌡ Ver tareas en curso',
                    "fr": '⌠💡⌡ Voir les tâches en cours',
                    "it": '⌠💡⌡ Visualizza le attività in corso',
                    "pt-BR": '⌠💡⌡ Veja as tarefas em progresso',
                    "ru": '⌠💡⌡ Просмотр текущих задач'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("completed")
                .setNameLocalizations({
                    "de": 'vollständig',
                    "es-ES": 'terminado',
                    "fr": 'complete',
                    "it": 'completato',
                    "pt-BR": "concluidas",
                    "ru": 'заключил'
                })
                .setDescription("⌠💡⌡ View completed tasks")
                .setDescriptionLocalizations({
                    "de": '⌠💡⌡ Abgeschlossene Aufgaben anzeigen',
                    "es-ES": '⌠💡⌡ Ver tareas completadas',
                    "fr": '⌠💡⌡ Afficher les tâches terminées',
                    "it": '⌠💡⌡ Visualizza le attività completate',
                    "pt-BR": '⌠💡⌡ Veja as tarefas finalizadas',
                    "ru": '⌠💡⌡ Просмотр выполненных задач'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("lists")
                .setNameLocalizations({
                    "de": 'listen',
                    "es-ES": 'lista',
                    "fr": 'listes',
                    "it": 'elenchi',
                    "pt-BR": "listas",
                    "ru": 'списки'
                })
                .setDescription("⌠💡⌡ Navigate tasks using lists")
                .setDescriptionLocalizations({
                    "de": '⌠💡⌡ Navigieren Sie durch Aufgaben mithilfe von Listen',
                    "es-ES": '⌠💡⌡ Navega por tareas usando listas',
                    "fr": '⌠💡⌡ Naviguez dans les tâches à l\'aide de listes',
                    "it": '⌠💡⌡ Naviga tra le attività utilizzando gli elenchi',
                    "pt-BR": '⌠💡⌡ Navegue pelas tarefas usando listas',
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
                            "de": 'aufgabe',
                            "es-ES": 'tarea',
                            "fr": 'tache',
                            "it": 'compito',
                            "pt-BR": 'tarefa',
                            "ru": 'задача'
                        })
                        .setDescription("⌠💡⌡ Crie uma tarefa nova")
                        .setDescriptionLocalizations({
                            "de": '⌠💡⌡ Erstellen Sie eine neue Aufgabe',
                            "es-ES": '⌠💡⌡ Crear una nueva tarea',
                            "fr": '⌠💡⌡ Créer une nouvelle tâche',
                            "it": '⌠💡⌡ Crea una nuova compito',
                            "pt-BR": '⌠💡⌡ Crie uma tarefa nova',
                            "ru": '⌠💡⌡ Создать новую задачу'
                        })
                        .addStringOption(option =>
                            option.setName("description")
                                .setNameLocalizations({
                                    "de": 'beschreibung',
                                    "es-ES": 'descripcion',
                                    "it": 'descrizione',
                                    "pt-BR": 'descricao',
                                    "ru": 'описание'
                                })
                                .setDescription("What will be noted?")
                                .setDescriptionLocalizations({
                                    "de": 'Beschreiben Sie Ihre Aufgabe',
                                    "es-ES": 'Describe tu tarea',
                                    "fr": 'Décrivez votre tâche',
                                    "it": 'Descrivi il tuo compito',
                                    "pt-BR": 'O que será anotado?',
                                    "ru": 'опишите вашу задачу'
                                })
                                .setRequired(true)))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setNameLocalizations({
                            "de": 'liste',
                            "es-ES": 'lista',
                            "fr": 'liste',
                            "it": 'elenco',
                            "pt-BR": "lista",
                            "ru": 'список'
                        })
                        .setDescription("⌠💡⌡ Add a list")
                        .setDescriptionLocalizations({
                            "de": '⌠💡⌡ Fügen Sie eine Liste hinzu',
                            "es-ES": '⌠💡⌡ Añadir lista',
                            "fr": '⌠💡⌡ Ajouter une liste',
                            "it": '⌠💡⌡ Aggiungi elenco',
                            "pt-BR": '⌠💡⌡ Adicione uma lista',
                            "ru": '⌠💡⌡ Добавить список'
                        })
                        .addStringOption(option =>
                            option.setName("description")
                                .setNameLocalizations({
                                    "de": 'beschreibung',
                                    "es-ES": 'descripcion',
                                    "it": 'descrizione',
                                    "pt-BR": 'descricao',
                                    "ru": 'описание'
                                })
                                .setDescription("What will the name of the list be?")
                                .setDescriptionLocalizations({
                                    "de": 'Wie wird die Liste heißen?',
                                    "es-ES": '¿Cuál será el nombre de la lista?',
                                    "fr": 'Quel sera le nom de la liste?',
                                    "it": 'Quale sarà il nome della lista?',
                                    "pt-BR": 'Qual será o nome da lista?',
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
                            "de": 'liste',
                            "es-ES": 'lista',
                            "fr": 'liste',
                            "it": 'elenco',
                            "pt-BR": 'lista',
                            "ru": 'список'
                        })
                        .setDescription("⌠💡⌡ Remove an list")
                        .setDescriptionLocalizations({
                            "de": '⌠💡⌡ Eine Liste entfernen',
                            "es-ES": '⌠💡⌡ Eliminar lista',
                            "fr": '⌠💡⌡ Supprimer la liste',
                            "it": '⌠💡⌡ Elimina elenco',
                            "pt-BR": '⌠💡⌡ Remova uma lista',
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