module.exports = async ({ client, user, interaction, guild, canal_alvo }) => {

    // Categoria alvo para o bot criar os canais
    if (interaction.options.getChannel("channel")) {
        canal_alvo = interaction.options.getChannel("channel").type

        // Mencionado um tipo de canal errado
        if (canal_alvo !== 0)
            return client.tls.reply(interaction, user, "mode.report.tipo_canal", true, 0)
    }

    // Ativa ou desativa o logger no servidor
    if (typeof guild.conf.logger === "undefined")
        guild.conf.logger = true
    else
        guild.conf.logger = !user.conf.logger

    // Se usado sem mencionar um canal, desliga função
    if (canal_alvo === null)
        guild.conf.logger = false
    else
        guild.logger.channel = interaction.options.getChannel("channel").id

    await guild.save()

    if (guild.conf.logger)
        interaction.reply({ content: `${client.defaultEmoji("guard")} | O log de eventos do servidor agora está ativo, todos os eventos serão enviados no canal <#${guild.logger.channel}>.`, ephemeral: true })
    else
        interaction.reply({ content: ":o: | O log de eventos do servidor agora está desativado\nUse o </panel guild:1107163338930126869>, ou o comando </conf log:1094346210636214304> mencionando um canal para ativar novamente!", ephemeral: true })
}