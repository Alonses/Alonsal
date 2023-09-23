module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    let pagina = 0

    // Tratamento dos cliques
    // 1 -> Modo fantasma
    // 2 -> Notificações em DM
    // 3 -> Ranking do usuário

    // 4 -> Badges públicas
    // 5 -> Clima resumido
    // 6 -> Tarefas globais

    if (escolha === 1) {
        // Ativa ou desativa o modo fantasma
        if (typeof user.conf.ghost_mode !== "undefined")
            user.conf.ghost_mode = !user.conf.ghost_mode
        else
            user.conf.ghost_mode = true

    } else if (escolha === 2) {

        // Ativa ou desativa as notificações em DM
        if (typeof user.conf.notify !== "undefined")
            user.conf.notify = !user.conf.notify
        else
            user.conf.notify = false
    } else if (escolha === 3) {

        // Ativa ou desativa o ranking do usuário
        if (typeof user.conf.ranking !== "undefined")
            user.conf.ranking = !user.conf.ranking
        else
            user.conf.ranking = false
    } else if (escolha === 4) {

        // Ativa ou desativa a exibição de badges publicamente
        if (typeof user.conf.public_badges !== "undefined")
            user.conf.public_badges = !user.conf.public_badges
        else
            user.conf.public_badges = false
    } else if (escolha === 5) {

        // Ativa ou desativa a versão resumida dos retornos de clima
        if (typeof user.misc.weather !== "undefined")
            user.misc.weather = !user.misc.weather
        else
            user.misc.weather = true
    } else if (escolha === 6) {

        // Ativa ou desativa as tarefas globais
        if (typeof user.conf.global_tasks !== "undefined")
            user.conf.global_tasks = !user.conf.global_tasks
        else
            user.conf.global_tasks = true
    }

    if (escolha > 3)
        pagina = 1

    await user.save()

    require('../../../formatters/chunks/model_user_panel')(client, user, interaction, pagina)
}