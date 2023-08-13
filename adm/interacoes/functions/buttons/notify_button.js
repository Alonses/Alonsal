const { free_games } = require('../../../funcoes/free_games.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar
    // 2 -> Confirmar e disparar anúncio

    let guild = await client.getGuild(interaction.guild.id)
    // let mensagem = `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) não recebe mais atts de jogos grátis`

    if (operacao === 0)
        return interaction.update({
            content: client.tls.phrase(user, "menu.botoes.operacao_cancelada"),
            embeds: [],
            components: [],
            ephemeral: true
        })

    // Ativando o anúncio de games do servidor
    guild.conf.games = true
    await guild.save()

    client.notify(process.env.channel_feeds, `:video_game: | O Servidor ( \`${interaction.guild.name}\` | \`${interaction.guild.id}\` ) agora recebe atts de jogos grátis`)

    interaction.update({
        content: client.replace(client.tls.phrase(user, "mode.anuncio.anuncio_games", client.emoji(29)), `<#${guild.games.channel}>`),
        embeds: [],
        components: [],
        ephemeral: true
    })

    if (operacao === 2) {
        const guild_channel = guild.games.channel
        free_games({ client, guild_channel })
    }
}