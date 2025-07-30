const { listAllVoiceChannels } = require("../../database/schemas/User_voice_channel")

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
                canal.delete()
                guild_channel.delete()
            }, 5000)
        }
    })
}

module.exports.verifica_canais_dinamicos = verifica_canais_dinamicos