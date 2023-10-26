const operations = {
    1: ["conf", "ghost_mode"],
    2: ["conf", "notify"],
    3: ["conf", "ranking"],
    4: ["conf", "public_badges"],
    5: ["misc", "weather"],
    6: ["conf", "global_tasks"]
}

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    let operador = 0

    // Tratamento dos cliques
    // 1 -> Modo fantasma
    // 2 -> Notificações em DM
    // 3 -> Ranking do usuário

    // 4 -> Badges públicas
    // 5 -> Clima resumido
    // 6 -> Tarefas globais

    // Ativa ou desativa a operação selecionada
    user[operations[escolha][0]][operations[escolha][1]] = !user[operations[escolha][0]][operations[escolha][1]]

    if (escolha > 3)
        operador = 1

    await user.save()

    require('../../chunks/panel_personal')({ client, user, interaction, operador })
}