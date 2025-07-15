const { listAllVoiceChannels } = require("../../database/schemas/User_voice_channel")

async function verifica_canais_dinamicos(client) {

    // Verifica todos os canais de voz dinâmicos registrados se estão vazios ao ligar o bot
    const dados = await listAllVoiceChannels()
    dados.forEach(async canal => {

        const guild_channel = await client.getGuildChannel(client.decifer(canal.cid))

        // Excluindo o canal se estiver vazio
        if (guild_channel && guild_channel?.members?.size < 1) {

            canal.delete()

            setTimeout(() => {
                guild_channel.delete()
            }, 1000)
        }
    })
}

module.exports.verifica_canais_dinamicos = verifica_canais_dinamicos