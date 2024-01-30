const operations = {
    0: ["conf", "ghost_mode"],
    1: ["conf", "notify"],
    2: ["conf", "ranking"],
    3: ["conf", "public_badges"],
    4: ["misc", "weather"],
    5: ["conf", "global_tasks"],
    6: ["conf", "resumed"],
    7: ["conf", "cached_guilds"]
}

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    let pagina_guia = 0

    // Tratamento dos cliques
    // 0 -> Modo fantasma
    // 1 -> Notificações em DM
    // 2 -> Ranking do usuário

    // 3 -> Badges públicas
    // 4 -> Clima resumido
    // 5 -> Tarefas globais

    // 6 -> Modo compacto
    // 7 -> Servidores conhecidos

    // Ativa ou desativa a operação selecionada
    user[operations[escolha][0]][operations[escolha][1]] = !user[operations[escolha][0]][operations[escolha][1]]
    await user.save()

    if (escolha > 2)
        pagina_guia = 1

    if (escolha > 5)
        pagina_guia = 2

    require('../../chunks/panel_personal')({ client, user, interaction, pagina_guia })
}