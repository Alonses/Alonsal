const { AttachmentBuilder, EmbedBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')
const { getCacheTask, getTask, listAllUserGroupTasks } = require('../database/schemas/Task')
const { getUserGroup, getUserGroups } = require('../database/schemas/Task_group')

const create_menus = require('../discord/create_menus')

const { clear_data } = require('../../adm/data/update_data')


module.exports = async ({ client, user, interaction }) => {

    const escolha = interaction.values[0]
    if (!interaction.customId.includes(interaction.user.id))
        return interaction.reply({ content: "Parado aí seu salafrário! Esse menu só pode ser usado pelo autor do comando!", ephemeral: true })

    if (interaction.customId === `select_badges_${interaction.user.id}`) {

        // Fixando a badge escolhida pelo usuário
        user.misc.fixed_badge = escolha

        user.save()
        let new_badge = busca_badges(client, badgeTypes.SINGLE, parseInt(escolha))

        interaction.update({ content: `${new_badge.emoji} | Badge \`${new_badge.name}\` ${client.tls.phrase(user, "dive.badges.badge_fixada")}`, components: [], ephemeral: true })

    } else if (interaction.customId === `select_fausto_${interaction.user.id}`) {

        // Enviando uma das frases do faustão selecionada pelo menu
        const file = new AttachmentBuilder(`./arquivos/songs/faustop/faustop_${escolha}.ogg`, { name: "faustop.ogg" })

        interaction.update({ content: "", files: [file], components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
    } else if (interaction.customId === `select_norbit_${interaction.user.id}`) {

        // Enviando uma das frases do filme Norbit selecionada pelo menu
        const file = new AttachmentBuilder(`./arquivos/songs/norbit/norbit_${escolha}.ogg`, { name: "norbit.ogg" })

        interaction.update({ content: "", files: [file], components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

    } else if (interaction.customId === `select_data_${interaction.user.id}`) {

        // Excluindo dados do usuário
        clear_data(user, escolha)

        return
        interaction.update({ content: "", files: [file], components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
    } else if (interaction.customId === `select_groups_${interaction.user.id}`) {

        // Coletando dados e verificando se a tarefa ainda existe
        let task = await getCacheTask(interaction.user.id, parseInt(interaction.values[0].split("#")[1]))

        if (!task)
            task = await getTask(interaction.user.id, parseInt(interaction.values[0].split("#")[1]))

        // Atualizando os dados da tarefa
        const group_timestamp = interaction.values[0].split(".")[1]
        const group = await getUserGroup(interaction.user.id, parseInt(group_timestamp))

        task.cached = false
        task.group = group.name

        await task.save()

        interaction.update({ content: `${client.defaultEmoji("paper")} | Sua nota foi adicionada a lista \`${task.group}\` com sucesso!`, components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

    } else if (interaction.customId === `select_groups_n_${interaction.user.id}`) {

        // Selecionando uma lista para visualizar as tarefas incluídas nela
        const group_timestamp = interaction.values[0].split(".")[1]
        const group = await getUserGroup(interaction.user.id, parseInt(group_timestamp))

        const tarefas = await listAllUserGroupTasks(interaction.user.id, group.name)

        if (tarefas.length < 1)
            return interaction.reply({ content: ":mag: | Não há nenhuma tarefa anexada à essa lista ainda!", ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

        interaction.update({ content: ":mag: | Escolha uma das tarefas abaixo para mais detalhes", components: [create_menus("tasks_v", client, interaction, user, tarefas)], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

    } else if (interaction.customId === `select_groups_r_${interaction.user.id}`) {

        // Apagando uma lista especificada
        const group_timestamp = interaction.values[0].split(".")[1]
        const group = await getUserGroup(interaction.user.id, parseInt(group_timestamp))

        const tarefas = await listAllUserGroupTasks(interaction.user.id, group.name) || 0

        const row = client.create_buttons([{ name: `Cancelar:delete_list`, value: '0', type: 1 }, { name: 'Apagar:delete_list', value: '0', type: 3, list_r: group_timestamp }], interaction)

        interaction.update({ content: `:vertical_traffic_light: | Você está prestes a apagar esta lista e confirmar a exclusão de outras \`${tarefas.length}\` tarefas\nSelecione os botões abaixo para cancelar ou prosseguir a operação.`, components: [row], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

    } else if (interaction.customId === `select_tasks_${interaction.user.id}` || interaction.customId === `select_tasks_v_${interaction.user.id}`) {

        // Exibindo os dados de alguma tarefa selecionada
        const task = await getTask(interaction.user.id, parseInt(interaction.values[0].split(".")[1]))

        const embed = new EmbedBuilder()
            .setTitle("> Sua tarefa")
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`\`\`\`${client.defaultEmoji("paper")} | ${task.text}\`\`\``)
            .addFields(
                {
                    name: `**${client.defaultEmoji("paper")} Lista**`,
                    value: `\`${task.group}\``,
                    inline: true
                },
                {
                    name: `**${client.defaultEmoji("calendar")} Criação**`,
                    value: `<t:${task.timestamp}:f>`,
                    inline: true
                }
            )
            .setFooter({ text: "Selecione os botões abaixo para gerenciar esta tarefa", iconURL: interaction.user.avatarURL({ dynamic: true }) })

        // Criando os botões para as funções de gestão de tarefas
        const grupos = await getUserGroups(interaction.user.id)
        let row

        if (!task.concluded) // Tarefas em aberto
            if (grupos.length > 1) // Mais de uma lista criada
                row = client.create_buttons([{ name: `Marcar como concluída:task_button`, value: '1', type: 2, task: task.timestamp }, { name: `Alterar de lista:task_button`, value: '0', type: 1, task: task.timestamp }, { name: 'Apagar:task_button', value: '0', type: 3, task: task.timestamp }], interaction)
            else // Apenas uma lista criada
                row = client.create_buttons([{ name: `Marcar como concluída:task_button`, value: '1', type: 2, task: task.timestamp }, { name: 'Apagar:task_button', value: '0', type: 3, task: task.timestamp }], interaction)
        else // Tarefas finalizadas
            if (grupos.length > 1) // Mais de uma lista criada
                row = client.create_buttons([{ name: `Abrir novamente:task_button`, value: '1', type: 2, task: task.timestamp }, { name: `Alterar de lista:task_button`, value: '0', type: 1, task: task.timestamp }, { name: 'Apagar:task_button', value: '0', type: 3, task: task.timestamp }], interaction)
            else // Apenas uma lista criada
                row = client.create_buttons([{ name: `Abrir novamente:task_button`, value: '1', type: 2, task: task.timestamp }, { name: 'Apagar:task_button', value: '0', type: 3, task: task.timestamp }], interaction)

        return interaction.update({ content: "", embeds: [embed], components: [row], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
    }
}