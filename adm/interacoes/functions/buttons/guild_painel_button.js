const { getGuild } = require('../../../database/schemas/Guild')

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha = parseInt(dados.split(".")[1])
    const guild = await getGuild(interaction.guild.id)
    let pagina = 0

    // Tratamento dos cliques
    // 1 -> Alonsal Falador
    // 2 -> Permitir Broadcast
    // 3 -> Anúncio de Games
    // 4 -> Denúncias in-server
    // 5 -> Reportes de usuários mau comportados
    // 6 -> Servidor visível globalmente

    if (escolha === 1) {
        // Ativa ou desativa a capacidade do Alonsal falar no servidor livremente ( através do clever )
        if (typeof guild.conf.conversation !== "undefined")
            guild.conf.conversation = !guild.conf.conversation
        else
            guild.conf.conversation = false

    } else if (escolha === 2) {

        // Ativa ou desativa a possibilidade do Alonsal realizar Broadcasting nos chats do servidor
        if (typeof guild.conf.broadcast !== "undefined")
            guild.conf.broadcast = !guild.conf.broadcast
        else
            guild.conf.broadcast = true

    } else if (escolha === 3) {

        if (!guild.games.channel || !guild.games.role)
            return interaction.update({ content: `:octagonal_sign: | É preciso configurar um canal e um cargo o comando </notify:1018632996787589283> antes de poder ativar pelo painel.`, ephemeral: true })
        else {
            // Ativa ou desativa o anúncio de games gratuitos no servidor
            if (typeof guild.conf.games !== "undefined")
                guild.conf.games = !guild.conf.games
            else
                guild.conf.games = false
        }
    } else if (escolha === 4) {

        if (!guild.reports.channel)
            return interaction.update({ content: `:octagonal_sign: | É preciso configurar um canal com o comando </conf ticket:1094346210636214304> antes de poder ativar pelo painel.`, ephemeral: true })
        else {
            // Ativa ou desativa a função de denúncias in-server pelo bot
            if (typeof guild.conf.tickets !== "undefined")
                guild.conf.tickets = !guild.conf.tickets
            else
                guild.conf.tickets = false
        }
    } else if (escolha === 5) {

        if (!guild.tickets.category)
            return interaction.update({ content: `:octagonal_sign: | É preciso configurar uma categoria com o comando </conf report:1094346210636214304> antes de poder ativar pelo painel.`, ephemeral: true })
        else {
            // Ativa ou desativa o relatório de outros usuários mau comportados no servidor
            if (typeof guild.conf.reports !== "undefined")
                guild.conf.reports = !guild.conf.reports
            else
                guild.conf.reports = false
        }
    } else if (escolha === 6) {

        // Ativa ou desativa a exibição pública no ranking global
        if (typeof guild.conf.public !== "undefined")
            guild.conf.public = !guild.conf.public
        else
            guild.conf.public = false
    }

    if (escolha > 3)
        pagina = 1

    await guild.save()

    require('../../../formatadores/chunks/model_guild_painel')(client, user, interaction, pagina)
}