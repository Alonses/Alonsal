const { free_games } = require('../../../adm/funcoes/free_games.js')

module.exports = async ({ client, user, interaction }) => {

    let guild = await client.getGuild(interaction.guild.id)

    if (!guild.games.channel || !guild.games.role)
        return client.tls.reply(interaction, user, "mode.anuncio.configuracao", true, 11)

    if (guild.conf.games)
        client.tls.reply(interaction, user, "mode.anuncio.anuncio_enviado_duplicatas", true, 29, `<#${guild.games.channel}>`)
    else
        client.tls.reply(interaction, user, "mode.anuncio.anuncio_enviado", true, 29, `<#${guild.games.channel}>`)

    // Enviando os games para anunciar no servidor
    const guild_channel = guild.games.channel
    free_games({ client, guild_channel })
}