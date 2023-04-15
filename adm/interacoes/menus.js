const { AttachmentBuilder, EmbedBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')
const { getCacheTask, deleteUserCachedTasks, getTask } = require('../database/schemas/Task')
const { getUserGroup, getUserGroups } = require('../database/schemas/Task_group')

module.exports = async ({ client, user, interaction }) => {

    if (interaction.customId === `select_badges_${interaction.user.id}`) {

        // Fixando a badge escolhida pelo usuário
        user.misc.fixed_badge = interaction.values[0]

        user.save()
        let new_badge = busca_badges(client, badgeTypes.SINGLE, parseInt(interaction.values[0]))

        interaction.update({ content: `${new_badge.emoji} | Badge \`${new_badge.name}\` ${client.tls.phrase(user, "dive.badges.badge_fixada")}`, components: [], ephemeral: true })

    } else if (interaction.customId === `select_fausto_${interaction.user.id}`) {

        // Enviando uma das frases do faustão selecionada pelo menu
        const file = new AttachmentBuilder(`./arquivos/songs/faustop/faustop_${interaction.values[0]}.ogg`, { name: "faustop.ogg" })

        interaction.update({ content: "", files: [file], components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
    } else if (interaction.customId === `select_norbit_${interaction.user.id}`) {

        // Enviando uma das frases do filme Norbit selecionada pelo menu
        const file = new AttachmentBuilder(`./arquivos/songs/norbit/norbit_${interaction.values[0]}.ogg`, { name: "norbit.ogg" })

        interaction.update({ content: "", files: [file], components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
    } else if (interaction.customId === `select_groups_${interaction.user.id}`) {

        // Coletando dados e verificando se a tarefa ainda existe
        const task = await getCacheTask(interaction.user.id, parseInt(interaction.values[0].split("#")[1]))

        if (task.length < 1)
            return interaction.update({ content: `:mag: | Não há mais notas em cache, por favor, adicione outra nota manualmente`, components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })

        // Atualizando os dados da tarefa
        const group_timestamp = interaction.values[0].split(".")[1]
        const group = await getUserGroup(interaction.user.id, parseInt(group_timestamp))

        task.cached = false
        task.group = group.name

        await task.save()

        // Apagando todas as tarefas que estão em cache e não foram confirmadas anteriormente
        deleteUserCachedTasks(interaction.user.id)

        interaction.update({ content: `${client.defaultEmoji("paper")} | Sua nota foi adicionada a lista \`${task.group}\` com sucesso!`, components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
    } else if (interaction.customId === `select_tasks_${interaction.user.id}`) {

        // Exibindo os dados de alguma tarefa selecionada
        const task = await getTask(interaction.user.id, parseInt(interaction.values[0].split(".")[1]))

        const embed = new EmbedBuilder()
            .setTitle("> Sua anotação")
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
            .setFooter({ text: "Selecione os botões abaixo para gerenciar esta anotação", iconURL: interaction.user.avatarURL({ dynamic: true }) })

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

        return interaction.update({ content: "", embeds: [embed], components: [row], ephemeral: true })
    }
}