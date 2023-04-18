const { SlashCommandBuilder } = require('discord.js')

const create_menus = require('../../adm/discord/create_menus')
const { listAllUserTasks, createTask, deleteUserCachedTasks } = require('../../adm/database/schemas/Task')
const { getUserGroups, createGroup, checkUserGroup } = require('../../adm/database/schemas/Task_group')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tasks")
        .setNameLocalizations({
            "pt-BR": 'tarefas'
        })
        .setDescription("⌠💡⌡ Create tasks and lists")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Crie tarefas e afazeres'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName("available")
                .setNameLocalizations({
                    "pt-BR": "disponiveis"
                })
                .setDescription("⌠💡⌡ View tasks in progress")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Veja as tarefas em progresso'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("completed")
                .setNameLocalizations({
                    "pt-BR": "concluidas"
                })
                .setDescription("⌠💡⌡ View completed tasks")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Veja as tarefas finalizadas'
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("lists")
                .setNameLocalizations({
                    "pt-BR": "listas"
                })
                .setDescription("⌠💡⌡ Navigate tasks using lists")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💡⌡ Navegue pelas tarefas usando listas'
                }))
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName("add")
                .setDescription("⌠💡⌡ Add tasks and lists")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("task")
                        .setNameLocalizations({
                            "pt-BR": 'tarefa'
                        })
                        .setDescription("⌠💡⌡ Crie uma tarefa nova")
                        .addStringOption(option =>
                            option.setName("description")
                                .setNameLocalizations({
                                    "pt-BR": 'descricao'
                                })
                                .setDescription("What will be noted?")
                                .setDescriptionLocalizations({
                                    "pt-BR": 'O que será anotado?'
                                })
                                .setRequired(true)))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setNameLocalizations({
                            "pt-BR": 'lista'
                        })
                        .setDescription("⌠💡⌡ Add a list")
                        .setDescriptionLocalizations({
                            "pt-BR": '⌠💡⌡ Adicione uma lista'
                        })
                        .addStringOption(option =>
                            option.setName("description")
                                .setNameLocalizations({
                                    "pt-BR": 'descricao'
                                })
                                .setDescription("Qual será o nome do grupo?")
                                .setRequired(true))))
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName("remove")
                .setDescription("⌠💡⌡ Remove listas")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("group")
                        .setNameLocalizations({
                            "pt-BR": 'lista'
                        })
                        .setDescription("⌠💡⌡ Remove an group")
                        .setDescriptionLocalizations({
                            "pt-BR": '⌠💡⌡ Remova uma lista'
                        }))),
    async execute(client, user, interaction) {

        const casos = {
            aberto: 0,
            finalizado: 0
        }

        const tarefas = await listAllUserTasks(interaction.user.id)

        if (!interaction.options.getSubcommandGroup()) {

            if (tarefas.length < 1)
                return interaction.reply({ content: ":octagonal_sign: | Você não possui nenhuma tarefa criada! Crie alguma para poder usar este comando.", ephemeral: true })

            for (let i = 0; i < tarefas.length; i++) {
                if (tarefas[i].concluded)
                    casos.finalizado++
                else
                    casos.aberto++
            }

            if (interaction.options.getSubcommand() === "available") {

                // Tarefas abertas
                if (casos.aberto < 1)
                    return interaction.reply({ content: ":octagonal_sign: | Você não possui nenhuma tarefa em aberto! Crie alguma para poder usar este comando.", ephemeral: true })

                interaction.reply({ content: ":mag: | Escolha uma das notas abaixo para mais detalhes", components: [create_menus("tasks", client, interaction, user, filtra_tarefas(tarefas, 0))], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

            } else if (interaction.options.getSubcommand() === "completed") {

                // Tarefas finalizadas
                if (casos.finalizado < 1)
                    return interaction.reply({ content: ":octagonal_sign: | Você não possui nenhuma tarefa finalizada! Finalize algumas para poder usar este comando.", ephemeral: true })

                interaction.reply({ content: ":mag: | Escolha uma das tarefas abaixo para mais detalhes", components: [create_menus("tasks", client, interaction, user, filtra_tarefas(tarefas, 1))], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
            } else {

                // Navegando por tarefas que pertencem a listas
                const groups = await getUserGroups(interaction.user.id)

                // Listando listas
                if (groups.length < 1)
                    return interaction.reply({ content: ":octagonal_sign: | Você não possui nenhuma lista para poder navegar!", ephemeral: true })

                interaction.reply({ content: ":mag: | Escolha uma das listas abaixo para visualizar anotações.", components: [create_menus("groups_n", client, interaction, user, groups)], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

            }
        } else {

            const date1 = parseInt(new Date() / 1000)

            if (interaction.options.getSubcommandGroup() === "add") {
                if (interaction.options.getSubcommand() === "task") {

                    // Removendo as tarefas que estão em cache
                    await deleteUserCachedTasks(interaction.user.id)

                    // Criando uma tarefa para ser usada
                    let grupos = await getUserGroups(interaction.user.id)

                    if (grupos.length < 1)
                        return interaction.reply({ content: ":octagonal_sign: | Você não possui nenhuma lista criada! Crie alguma para poder usar este comando.", ephemeral: true })

                    const task = await createTask(interaction.user.id, interaction.guild.id, interaction.options.getString("description"), date1)

                    // Adicionando a tarefa a uma lista automaticamente caso só exista uma lista
                    if (grupos.length == 1) {
                        nome_lista = grupos[0].name

                        task.group = grupos[0].name
                        task.save()

                        return interaction.reply({ content: `${client.defaultEmoji("paper")} | Sua nova tarefa foi adicionada automaticamente na lista \`${task.group}\`!`, ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
                    } else
                        interaction.reply({ content: ":mag: | Escolha uma das listas abaixo para adicionar esta tarefa.", components: [create_menus("groups", client, interaction, user, grupos, date1)], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
                } else {

                    // Verificando se o nome da nova lista não existe ainda
                    const check_group = await checkUserGroup(interaction.user.id, interaction.options.getString("description"))

                    if (check_group.length > 0)
                        return interaction.reply({ content: ":octagonal_sign: | Você já possui uma lista com esse nome! Por favor, insira uma lista com outro nome", ephemeral: true })

                    // Criando listas
                    createGroup(interaction.user.id, interaction.options.getString("description"), date1)

                    interaction.reply({ content: `${client.defaultEmoji("paper")} | Sua lista foi criada, use o comando \`/tarefas add tarefa\` para adicionar tarefas!`, ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
                }
            } else {
                // Excluindo tarefas e listas

                if (interaction.options.getSubcommand() === "group") {

                    const grupos = await getUserGroups(interaction.user.id)

                    // Removendo listas
                    if (grupos.length < 1)
                        return interaction.reply({ content: ":octagonal_sign: | Você não possui nenhuma lista para poder excluir!", ephemeral: true })

                    interaction.reply({ content: ":mag: | Escolha uma das listas abaixo para excluir.", components: [create_menus("groups_r", client, interaction, user, grupos)], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
                }
            }
        }
    }
}

function filtra_tarefas(tarefas, caso) {

    const array = []

    // Filtrando o array para o estado de conclusão
    for (let i = 0; i < tarefas.length; i++)
        if (tarefas[i].concluded == caso)
            array.push(tarefas[i])

    return array
}