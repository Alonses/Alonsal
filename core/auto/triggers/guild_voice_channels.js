const { listAllVoiceChannels, dropVoiceChannel } = require("../../database/schemas/User_voice_channel")

async function atualiza_voice_channels(client) {

    const dados = await listAllVoiceChannels()

    // Salvando os canais de voz dinâmicos no cache do bot
    dados.forEach(voice_channel => { client.cached.voice_channels.set(`${voice_channel.cid}.${voice_channel.sid}`, true) })
}

async function verifica_canais_dinamicos(client) {

    // Verifica todos os canais de voz dinâmicos registrados se estão vazios ao ligar o bot
    const dados = await listAllVoiceChannels()
    dados.forEach(async canal => {

        const guild_channel = await client.getGuildChannel(client.decifer(canal.cid))

        // Excluindo o canal se estiver vazio
        if (guild_channel && guild_channel?.members?.size < 1) {

            // Alterando o nome do canal para informar a exclusão
            await guild_channel.edit({
                name: `${client.emoji(13)} ${guild_channel.name.split(" ")[1]}`
            })

            setTimeout(() => {
                dropVoiceChannel(canal.uid, canal.sid)
                guild_channel.delete()
            }, 5000)
        }
    })
}

module.exports.atualiza_voice_channels = atualiza_voice_channels
module.exports.verifica_canais_dinamicos = verifica_canais_dinamicos