const { listAllVoiceChannels, dropVoiceChannelById } = require("../../database/schemas/User_voice_channel")

const UNKNOWN_CHANNEL = 10003
const MAX_TENTATIVAS = 3

// Canais com exclusão em andamento, evita agendar a mesma exclusão mais de uma vez
const em_exclusao = new Set()

async function atualiza_voice_channels(client) {

    const dados = await listAllVoiceChannels()

    // Salvando os canais de voz dinâmicos no cache do bot
    dados.forEach(voice_channel => { client.cached.voice_channels.set(`${voice_channel.cid}.${voice_channel.sid}`, true) })
}

// Retorna o canal, null se ele não existe mais no Discord ou undefined se não foi possível confirmar
async function buscaCanal(client, id_canal) {

    const em_cache = await client.getGuildChannel(id_canal)
    if (em_cache) return em_cache

    try {
        return await client.discord.channels.fetch(id_canal)
    } catch (err) {
        return err?.code === UNKNOWN_CHANNEL ? null : undefined
    }
}

async function removeRegistro(client, voice_channel) {
    client.cached.voice_channels.delete(`${voice_channel.cid}.${voice_channel.sid}`)
    await dropVoiceChannelById(voice_channel._id)
}

// Exclui o canal dinâmico no Discord e só então remove o registro do banco.
// Se algo falhar o registro é mantido e a exclusão é tentada novamente
async function removeCanalDinamico(client, voice_channel, { delay = 0, onSchedule, tentativa = 1 } = {}) {

    const chave = String(voice_channel._id)
    if (em_exclusao.has(chave)) return
    em_exclusao.add(chave)

    try {
        const id_canal = voice_channel.cid ? client.decifer(voice_channel.cid) : null
        let canal = id_canal ? await buscaCanal(client, id_canal) : null

        if (canal === undefined) throw new Error("Canal indisponível")

        // Canal inexistente ou registro incompleto, apenas limpa o banco
        if (!canal) return await removeRegistro(client, voice_channel)

        if (canal.members?.size > 0) return

        if (delay > 0) {
            const nome_original = canal.name

            // Renomear é opcional e pode demorar por limites do Discord, não deve travar a exclusão
            canal.edit({ name: `${client.emoji(13)} ${canal.name.split(" ")[1] || canal.name}` }).catch(() => { })
            if (onSchedule) onSchedule()

            await new Promise(resolve => setTimeout(resolve, delay))

            canal = await buscaCanal(client, id_canal)
            if (canal === undefined) throw new Error("Canal indisponível")
            if (!canal) return await removeRegistro(client, voice_channel)

            if (canal.members?.size > 0) { // Alguém entrou durante a contagem, cancelando a exclusão
                canal.edit({ name: nome_original }).catch(() => { })
                return
            }
        }

        await canal.delete().catch(err => { if (err?.code !== UNKNOWN_CHANNEL) throw err })
        await removeRegistro(client, voice_channel)

    } catch (err) {
        console.error(`🛑 | Falha ao excluir o canal dinâmico (tentativa ${tentativa}):`, err?.message || err)

        if (tentativa < MAX_TENTATIVAS)
            setTimeout(() => removeCanalDinamico(client, voice_channel, { tentativa: tentativa + 1 }), 60000)

    } finally {
        em_exclusao.delete(chave)
    }
}

async function verifica_canais_dinamicos(client) {

    // Verifica todos os canais de voz dinâmicos registrados se estão vazios ao ligar o bot
    const dados = await listAllVoiceChannels()

    await Promise.allSettled(dados.map(canal => removeCanalDinamico(client, canal)))
}

module.exports.atualiza_voice_channels = atualiza_voice_channels
module.exports.verifica_canais_dinamicos = verifica_canais_dinamicos
module.exports.removeCanalDinamico = removeCanalDinamico