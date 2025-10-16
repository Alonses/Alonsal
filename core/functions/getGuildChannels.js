const { ChannelType } = require('discord.js')

module.exports = async ({ client, data }) => {

    // Lista todos os canais de um tipo especifico no servidor
    let interaction = data.interaction
    let user = data.user
    let tipo = data.tipo
    let id_configurado = data?.id_configurado || null

    const canais = interaction.guild.channels.cache.filter(c => c.type === tipo)
    const canais_alvo = []

    if (!id_configurado) id_configurado = ""

    canais.map(channel => {
        if (channel.id !== id_configurado && channel.id !== interaction.channel.id && channel.id !== interaction.channel.parentId)
            canais_alvo.push({ id: channel.id, name: channel.name })
    })

    // Ordenando alfabeticamente os canais
    const ordenado = canais_alvo.sort((a, b) => (client.normalizeString(a.name) > client.normalizeString(b.name)) ? 1 : ((client.normalizeString(b.name) > client.normalizeString(a.name)) ? -1 : 0))

    if (id_configurado !== interaction.channel.id && id_configurado !== interaction.channel.parentId) { // Adicionando o local atual do comando no inicio do array

        if (tipo === ChannelType.GuildText) // Usado por canais
            ordenado.unshift({ id: interaction.channel.id, name: { tls: "menu.botoes.local_atual", alvo: user }, emoji: "🎯" })
        else if (interaction.channel.parentId) // Usado por categorias
            ordenado.unshift({ id: interaction.channel.parentId, name: { tls: "menu.botoes.local_atual", alvo: user }, emoji: "🎯" })
    }

    return ordenado
}