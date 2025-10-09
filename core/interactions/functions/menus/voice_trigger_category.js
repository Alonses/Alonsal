const { ChannelType } = require('discord.js')

const { getGuildVoiceTrigger } = require('../../../database/schemas/Voice_triggers')

module.exports = async ({ client, user, interaction, dados }) => {

    const hash_trigger = dados.split(".")[1]
    const trigger = await getGuildVoiceTrigger(client, client.encrypt(interaction.guild.id), hash_trigger)

    // Verificando se o tipo do canal mencionado é válido
    const canal = await client.getGuildChannel(dados.split(".")[0])
    if (canal.type !== ChannelType.GuildCategory)
        return client.reply(interaction, {
            content: client.tls.phrase(user, "mode.voice_channels.canal_errado_categoria", client.defaultEmoji("types")),
            flags: "Ephemeral"
        })

    trigger.config.category = client.encrypt(dados.split(".")[0])
    trigger.config.category_nick = client.encrypt(canal.name)
    await trigger.save()

    // Redirecionando o evento
    dados = `0.0.${hash_trigger}`

    if (!trigger.config.channel) // Trigger sem canal configurado
        return require("../buttons/voice_trigger_configure_button")({ client, user, interaction, dados })

    require('../../chunks/voice_trigger_config')({ client, user, interaction, dados })
}