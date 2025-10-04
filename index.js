const { ShardingManager } = require('discord.js')
const { client_data } = require('./setup')

// Limpa o console ao iniciar
// console.clear()

if (client_data.sharding) {

    // Carregando os dados de tradução
    const ptBr = require('./files/languages/pt-br.json')
    const data = ptBr.data

    // Inicializando o ShardingManager
    const manager = new ShardingManager('./bot.js', { token: client_data.token })

    manager.on('shardCreate', shard => {
        const nickname = data?.voice_channels?.nicknames?.[shard.id] || 'Kovarex'
        console.log(`💠 | Shard ${nickname} ativado`)
    })

    manager.spawn().catch(error => {
        console.error('Erro ao iniciar o shard:', error)
        process.exit(1)
    })
} else {
    // Inicia o bot sem sharding
    try {
        require('./bot')
    } catch (error) {
        console.error('Erro ao iniciar o bot:', error)
        process.exit(1)
    }
}
