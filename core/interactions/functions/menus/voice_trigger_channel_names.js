const { getGuildVoiceTrigger } = require('../../../database/schemas/Voice_triggers')

module.exports = async ({ client, user, interaction, dados }) => {

    const hash_trigger = dados.split(".")[1]
    const trigger = await getGuildVoiceTrigger(client, client.encrypt(interaction.guild.id), hash_trigger)

    // Atualizando as preferências de nomes dos canais dinâmicos do trigger
    trigger.config.preferences.voice_names = dados.split(".")[3]
    await trigger.save()

    // Redirecionando o evento
    dados = `0.0.${hash_trigger}`
    require('../../chunks/voice_trigger_config')({ client, user, interaction, dados })
}