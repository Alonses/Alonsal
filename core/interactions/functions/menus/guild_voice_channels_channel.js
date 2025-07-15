const { ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Verificando se o tipo do canal mencionado é válido
    const canal = await client.getGuildChannel(dados)
    if (canal.type !== ChannelType.GuildVoice)
        return interaction.reply({
            content: `${client.defaultEmoji("types")} | O canal definido precisa ser do tipo voz, tente novamente`,
            flags: "Ephemeral"
        })

    guild.voice_channels.channel = client.encrypt(dados)
    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_voice_channels')({ client, user, interaction })
}