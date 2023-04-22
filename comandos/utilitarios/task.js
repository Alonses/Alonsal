const { SlashCommandBuilder } = require('discord.js')

const { createTask } = require('../../adm/database/schemas/Task')
const { listAllUserGroups, createGroup, checkUserGroup } = require('../../adm/database/schemas/Task_group')

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
                                .setDescription("Qual será o nome da lista?")
                                .setRequired(true))))
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName("remove")
                .setDescription("⌠💡⌡ Remove listas")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setNameLocalizations({
                            "pt-BR": 'lista'
                        })
                        .setDescription("⌠💡⌡ Remove an list")
                        .setDescriptionLocalizations({
                            "pt-BR": '⌠💡⌡ Remova uma lista'
                        }))),
    async execute(client, user, interaction) {

        if (!interaction.options.getSubcommandGroup()) {
            if (interaction.options.getSubcommand() === "available") { // Tarefas disponíveis
                const operador = "a"
                return require('../../adm/interacoes/chunks/tarefas')({ client, user, interaction, operador })
            } else if (interaction.options.getSubcommand() === "completed") { // Tarefas completadas
                const operador = "f"
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
                        return client.tls.reply(interaction, user, "util.tarefas.sem_lista", true, 0)

                    const task = await createTask(interaction.user.id, interaction.guild.id, interaction.options.getString("description"), timestamp)

                    // Adicionando a tarefa a uma lista automaticamente caso só exista uma lista
                    if (listas.length == 1) {
                        nome_lista = listas[0].name

                        task.group = listas[0].name
                        task.save()

                        // Verificando se a lista não possui algum servidor mencionado
                        if (typeof listas[0].sid === "undefined") {
                            listas[0].sid = interaction.guid.id
                            listas[0].save()
                        }

                        return interaction.reply({ content: `${client.defaultEmoji("paper")} | ${client.tls.phrase(user, "util.tarefas.tarefa_adicionada")} \`${nome_lista}\`!`, ephemeral: client.decider(user?.conf.ghost_mode, 0) })
                    } else {

                        const data = {
                            alvo: "listas",
                            values: listas,
                            timestamp: timestamp
                        }

                        interaction.reply({ content: client.tls.phrase(user, "util.tarefas.tarefa_lista", 1), components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
                    }
                } else {

                    let check_list

                    // Verificando se o usuário desabilitou as tasks globais
                    if (client.decider(user?.conf.global_tasks, 1))
                        check_list = await checkUserGroup(interaction.user.id, interaction.options.getString("description"))
                    else
                        check_list = await checkUserGroup(interaction.user.id, interaction.options.getString("description"), interaction.guild.id)

                    if (check_list.length > 0) // Verificando se o nome da nova lista não existe ainda
                        return client.tls.reply(interaction, user, "util.tarefas.lista_repetida", true, 0)

                    // Criando listas
                    createGroup(interaction.user.id, interaction.options.getString("description"), interaction.guild.id, timestamp)

                    interaction.reply({ content: `${client.defaultEmoji("paper")} | ${client.tls.phrase(user, "util.tarefas.lista_criada")}`, ephemeral: client.decider(user?.conf.ghost_mode, 0) })
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
                        return client.tls.reply(interaction, user, "util.tarefas.sem_lista_r", true, 0)

                    const data = {
                        alvo: "listas_remover",
                        values: listas
                    }

                    interaction.reply({ content: client.tls.phrase(user, "util.tarefas.lista_e", 1), components: [client.create_menus(client, interaction, user, data)], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
                }
            }
        }
    }
}