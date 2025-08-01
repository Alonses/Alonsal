const { EmbedBuilder } = require('discord.js')

module.exports = async ({ client, oldState, newState }) => {

    // Verificando se o autor da mensagem editada é o bot
    if (oldState.member.user.bot || newState.member.user.bot) return

    const guild = await client.getGuild(oldState.guild.id)

    // Canais de voz dinâmicos ativos no servidor e ligados no bot
    if (guild.conf.voice_channels && client.x.voice_channels) require("../member/member_voice_channel")({ client, guild, oldState, newState })

    // Verificando se a guild habilitou o logger
    if (!guild.logger.member_voice_status || !guild.conf.logger) return

    let frase

    if (newState.channelId === null) frase = client.tls.phrase(guild, "mode.logger.canal_saida", [48, 30], [oldState.id, oldState.channelId])
    else if (oldState.channelId === null) frase = client.tls.phrase(guild, "mode.logger.canal_entrada", [48, 50], [oldState.id, newState.channelId])
    else frase = client.tls.phrase(guild, "mode.logger.canal_troca", [48, 49], [oldState.id, oldState.channelId, newState.channelId])

    const embed = new EmbedBuilder()
        .setTitle(client.tls.phrase(guild, "mode.logger.canal_voz"))
        .setColor(client.embed_color("pastel"))
        .setDescription(frase)
        .setTimestamp()
        .setFooter({
            text: `${client.tls.phrase(guild, "mode.logger.id_membro")} ${oldState.id}`
        })

    client.notify(guild.logger.channel, { embeds: [embed] })
}