const { EmbedBuilder } = require('discord.js')

const { getTask } = require('../../../database/schemas/Task')
const { listAllUserGroups, getUserGroup } = require('../../../database/schemas/Task_group')

module.exports = async ({ client, user, interaction, dados }) => {

    // Exibindo os dados de alguma tarefa selecionada
    const task = await getTask(interaction.user.id, parseInt(dados.split(".")[1]))
    const lista = await getUserGroup(interaction.user.id, task.g_timestamp)
    let nome_lista = "Sem lista"
    let operador = dados.split(".")[2]

    if (dados.includes("x"))
        operador = `x|${dados.split(".")[3]}`

    if (lista)
        nome_lista = lista.name

    // Atualiza os dados das tarefas e listas
    client.atualiza_dados(task, interaction)

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "util.tarefas.sua_tarefa"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`\`\`\`${client.defaultEmoji("paper")} | ${task.text}\`\`\``)
        .addFields(
            {
                name: `**${client.defaultEmoji("paper")} ${client.tls.phrase(user, "util.tarefas.lista")}**`,
                value: `\`${nome_lista}\``,
                inline: true
            },
            {
                name: `**${client.defaultEmoji("calendar")} ${client.tls.phrase(user, "util.server.criacao")}**`,
                value: `<t:${task.timestamp}:f>`,
                inline: true
            }
        )
        .setFooter({ text: client.tls.phrase(user, "util.tarefas.selecionar_botoes"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

    // Criando os botões para as funções de gestão de tarefas
    let row, listas

    // Verificando se o usuário desabilitou as tasks globais
    if (client.decider(user?.conf.global_tasks, 1))
        listas = await listAllUserGroups(interaction.user.id)
    else
        listas = await listAllUserGroups(interaction.user.id, interaction.guild.id)

    if (!task.concluded) // Tarefas em aberto
        if (listas.length > 1) // Mais de uma lista criada
            row = client.create_buttons([{ id: "task_button", name: client.tls.phrase(user, "menu.botoes.marcar_concluida"), value: '1', type: 2, data: `1|${task.timestamp}` }, { id: "task_button", name: client.tls.phrase(user, "menu.botoes.alterar_de_lista"), value: '0', type: 1, data: `2|${task.timestamp}` }, { id: "task_button", name: client.tls.phrase(user, "menu.botoes.apagar"), value: '0', type: 3, data: `0|${task.timestamp}` }, { id: "return_button", name: 'Retornar', value: '1', type: 0, data: `${operador}|tarefas` }], interaction)
        else // Apenas uma lista criada
            row = client.create_buttons([{ id: "task_button", name: client.tls.phrase(user, "menu.botoes.marcar_concluida"), value: '1', type: 2, data: `1|${task.timestamp}` }, { id: "task_button", name: client.tls.phrase(user, "menu.botoes.apagar"), value: '0', type: 3, data: `0|${task.timestamp}` }, { id: "return_button", name: 'Retornar', value: '1', type: 0, data: `${operador}|tarefas` }], interaction)
    else // Tarefas finalizadas
        if (listas.length > 1) // Mais de uma lista criada
            row = client.create_buttons([{ id: "task_button", name: client.tls.phrase(user, "menu.botoes.abrir_novamente"), value: '1', type: 2, data: `3|${task.timestamp}` }, { id: "task_button", name: client.tls.phrase(user, "menu.botoes.alterar_de_lista"), value: '0', type: 1, data: `2|${task.timestamp}` }, { id: "task_button", name: client.tls.phrase(user, "menu.botoes.apagar"), value: '0', type: 3, data: `0|${task.timestamp}` }, { id: "return_button", name: 'Retornar', value: '1', type: 0, data: `${operador}|tarefas` }], interaction)
        else // Apenas uma lista criada
            row = client.create_buttons([{ id: "task_button", name: client.tls.phrase(user, "menu.botoes.abrir_novamente"), value: '1', type: 2, data: `3|${task.timestamp}` }, { id: "task_button", name: client.tls.phrase(user, "menu.botoes.apagar"), value: '0', type: 3, data: `0|${task.timestamp}` }, { id: "return_button", name: 'Retornar', value: '1', type: 0, data: `${operador}|tarefas` }], interaction)

    return interaction.update({ content: "", embeds: [embed], components: [row], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
}