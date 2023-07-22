
module.exports = async ({ client, user, interaction, guild, canal_alvo }) => {

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {
        canal_alvo = interaction.options.getChannel("channel").type

        // Mencionado um tipo de canal errado
        if (canal_alvo !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, 0)
    }

    // Ativa ou desativa os tickets no servidor
    guild.conf.spam = !guild.conf.spam

    // Se usado sem mencionar categoria, desliga função
    if (canal_alvo === null)
        guild.conf.spam = false
    else
        guild.logger.channel = interaction.options.getChannel("channel").id

    await guild.save()

    if (guild.conf.spam)
        interaction.reply({ content: `${client.defaultEmoji("guard")} | O módulo anti-spam foi ativo! <#${guild.logger.channel}>\nO Canal mencionado será usado para o logger ( </conf log:1094346210636214304> ) também caso ele seja ativado.\n\nSe você usar o comando do logger mencionando um outro canal, o anti-spam enviará todos os relatórios no mesmo canal do logger, e vice-versa\n(ambos os módulos utilizam o mesmo canal ${client.emoji("epic_embed_fail2")} )`, ephemeral: true })
    else
        interaction.reply({ content: `${client.defaultEmoji("guard")} | O módulo anti-spam foi desativado.`, ephemeral: true })
}