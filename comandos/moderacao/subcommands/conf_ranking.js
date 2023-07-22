
module.exports = async ({ client, user, interaction, guild }) => {

    // Ativa ou desativa a visualização do servidor no ranking global
    if (typeof guild.conf.public !== "undefined")
        guild.conf.public = !guild.conf.public
    else
        guild.conf.public = false

    await guild.save()

    if (guild.conf.public)
        interaction.reply({ content: `${client.defaultEmoji("earth")} | O nome do servidor será mostrado no ranking global para todos os servidores agora!`, ephemeral: true })
    else
        interaction.reply({ content: `${client.defaultEmoji("detective")} | O servidor não será mais mostrado no ranking global.`, ephemeral: true })
}