const dispara_anuncio = require('../../../adm/automaticos/dispara_anuncio.js')

module.exports = async ({ client, user, interaction }) => {

    let guild = await client.getGuild(interaction.guild.id)

    if (!guild.games.channel || !guild.games.role)
        return interaction.reply({ content: ":o: | Você precisa configurar um canal e um cargo para receber notificações de games gratuitos\nUtilize o comando </notify config:1018632996787589283> para configurar e ativar o módulo de games gratuitos.", ephemeral: true })

    if (guild.conf.games)
        interaction.reply({ content: `:video_game: | Um novo anúncio foi enviado no <#${guild.games.channel}>, o anúncio de games está ativo nesse servidor.\nVerifique o canal para confirmar se houve duplicatas de anúncios`, ephemeral: true })
    else
        interaction.reply({ content: `:video_game: | Um novo anúncio foi enviado no <#${guild.games.channel}>, o anúncio de games não está ativo neste servidor no momento.\nUtilize o painel do servidor para ativar o recurso, ou o comando </notify config:1018632996787589283> novamente.`, ephemeral: true })

    fetch(`${process.env.url_apisal}/games`)
        .then(response => response.json())
        .then(async objetos_anunciados => {

            const guild_channel = guild.games.channel
            dispara_anuncio({ client, objetos_anunciados, guild_channel })
        })
        .catch(err => {
            const local = "games"
            require('../../../adm/eventos/error.js')({ client, err, local })
        })
}