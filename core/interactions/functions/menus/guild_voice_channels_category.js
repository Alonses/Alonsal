const { ChannelType } = require('discord.js')

module.exports = async ({ client, user, interaction, dados }) => {

    const guild = await client.getGuild(interaction.guild.id)

    // Verificando se o tipo do canal mencionado é válido
    const canal = await client.getGuildChannel(dados)
    if (canal.type !== ChannelType.GuildCategory)
        return interaction.reply({
            content: `${client.defaultEmoji("types")} | O canal definido precisa ser do tipo categoria, tente novamente`,
            flags: "Ephemeral"
        })

    guild.voice_channels.category = client.encrypt(dados)
    await guild.save()

    // Redirecionando o evento
    require('../../chunks/panel_guild_voice_channels')({ client, user, interaction })
}