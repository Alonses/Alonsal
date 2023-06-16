const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const dispara_anuncio = require('../../../automaticos/dispara_anuncio.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar
    // 2 -> Confirmar e disparar anúncio

    let guild = await client.getGuild(interaction.guild.id)
    // let mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) não recebe mais atts de jogos grátis`

    if (operacao === 0)
        return interaction.update({ content: `:o: | Operação cancelada`, components: [], embeds: [], ephemeral: true })

    // Ativando o anúncio de games do servidor
    guild.conf.games = true
    await guild.save()

    client.notify(process.env.channel_feeds, `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) agora recebe atts de jogos grátis`)

    interaction.update({ content: client.replace(client.tls.phrase(user, "mode.anuncio.anuncio_games", client.emoji(29)), `<#${guild.games.channel}>`), components: [], embeds: [], ephemeral: true })

    if (operacao === 2) {
        fetch(`${process.env.url_apisal}/games`)
            .then(response => response.json())
            .then(async objetos_anunciados => {

                const guild_channel = guild.games.channel
                dispara_anuncio({ client, objetos_anunciados, guild_channel })
            })
            .catch(err => {
                const local = "games"
                require('../../../eventos/error.js')({ client, err, local })
            })
    }
}