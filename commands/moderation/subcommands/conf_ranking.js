
module.exports = async ({ client, user, interaction, guild }) => {

    // Ativa ou desativa a visualização do servidor no ranking global
    if (guild.conf.public)
        guild.conf.public = !guild.conf.public
    else
        guild.conf.public = false

    await guild.save()

    if (guild.conf.public)
        client.tls.reply(interaction, user, "mode.public.ativado", true, client.defaultEmoji("earth"))
    else
        client.tls.reply(interaction, user, "mode.public.desativado", true, client.defaultEmoji("detective"))
}