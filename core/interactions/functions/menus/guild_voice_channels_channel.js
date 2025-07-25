const { ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Verificando se o tipo do canal mencionado é válido
    const canal = await client.getGuildChannel(dados)
    if (canal.type !== ChannelType.GuildVoice)
        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.voice_channels.canal_errado_voz", client.defaultEmoji("types")),
            flags: "Ephemeral"
        })

    guild.voice_channels.channel = client.encrypt(dados)
    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_voice_channels')({ client, user, interaction })
}