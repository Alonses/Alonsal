module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])
    const guild = await client.getGuild(interaction.guild.id)

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 1 -> Ativar ou desativar o módulo anti-spam
    // 2 -> Punições por níveis
    // 3 -> Configurar punições

    if (operacao === 1) {
        if (!guild.logger.channel)
            return interaction.update({
                content: client.tls.phrase(user, "mode.logger.falta_vinculo", 0),
                ephemeral: true
            })
        else {
            // Ativa ou desativa o módulo anti-spam do servidor
            if (typeof guild.conf.spam !== "undefined")
                guild.conf.spam = !guild.conf.spam
            else
                guild.conf.spam = false
        }
    } else if (operacao === 2) {
        if (!guild.logger.channel)
            return interaction.update({
                content: client.tls.phrase(user, "mode.logger.falta_vinculo", 0),
                ephemeral: true
            })
        else {
            // Ativa ou desativa o sistema de strikes do anti-spam
            if (typeof guild.spam.strikes !== "undefined")
                guild.spam.strikes = !guild.spam.strikes
            else
                guild.spam.strikes = false
        }
    } else if (operacao === 3) {
        if (!guild.logger.channel)
            return interaction.update({
                content: client.tls.phrase(user, "mode.logger.falta_vinculo", 0),
                ephemeral: true
            })
        else {

            // Definindo o tempo mínimo que um usuário deverá ficar mutado no servidor
            const data = {
                title: client.tls.phrase(user, "misc.modulo.modulo_escolher", 1),
                alvo: "spam_timeout",
                values: ["1 hora", "2 horas", "6 horas", "12 horas", "1 dia", "2 dias", "3 dias", "7 dias"]
            }

            let row = client.create_buttons([{ id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: "panel_anti_spam" }], interaction)

            return interaction.update({
                components: [client.create_menus(client, interaction, user, data), row],
                ephemeral: true
            })
        }
    }

    await guild.save()

    // Redirecionando a função para o painel de anti-spam
    require('../../chunks/panel_anti_spam')({ client, user, interaction, operacao })
}