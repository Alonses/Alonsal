const { EmbedBuilder } = require('discord.js')

const { getTask } = require('../../../database/schemas/User_tasks')
const { getUserGroup } = require('../../../database/schemas/User_tasks_group')

module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    // Exibindo os dados de alguma tarefa selecionada
    let nome_lista = client.tls.phrase(user, "util.tarefas.sem_lista_v")

    if (!autor_original) // Redirecionando o usuário secundário
        return require("../../chunks/tarefas_remover")({ client, user, interaction })

    const task = await getTask(user.uid, parseInt(dados.split(".")[1]))
    const lista = await getUserGroup(user.uid, task.g_timestamp)

    // Botão para retornar até as listas do usuário
    let row_2 = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "listas_navegar" }
    ], interaction)

    if (lista)
        nome_lista = lista.name
    else
        return interaction.update({
            content: client.tls.phrase(user, "util.tarefas.lista_inexistente", 1),
            embeds: [],
            components: [row_2],
            flags: "Ephemeral"
        })

    // Atualiza os dados das tarefas e listas
    client.atualiza_dados(task, interaction)

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(user, "util.tarefas.sua_tarefa"))
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`\`\`\`${client.defaultEmoji("paper")} | ${client.decifer(task.text)}\`\`\``)
        .addFields(
            {
                name: `${client.defaultEmoji("paper")} **${client.tls.phrase(user, "util.tarefas.lista")}**`,
                value: `\`${nome_lista}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("calendar")} **${client.tls.phrase(user, "util.server.criacao")}**`,
                value: `<t:${task.timestamp}:f>`,
                inline: true
            }
        )
        .setFooter({
            text: client.tls.phrase(user, "util.tarefas.selecionar_botoes"),
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Criando os botões para as funções de gestão de tarefas
    let row = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "tarefas_remover" },
        { id: "tasks_delete_task", name: { tls: "menu.botoes.apagar", alvo: user }, type: 3, emoji: client.emoji(13), data: `1|${task.timestamp}` },
        { id: "tasks_delete_task", name: { tls: "menu.botoes.cancelar", alvo: user }, emoji: client.emoji(0), type: 1, data: 0 }
    ], interaction)

    interaction.update({
        content: "",
        embeds: [embed],
        components: [row],
        flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
    })
}