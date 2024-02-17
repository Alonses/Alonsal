const { ShardingManager } = require('discord.js')
const { client_data } = require('./setup')

console.clear() // Limpando o console e inicializando o bot

const shard_names = require('./files/json/text/shard_names.json')

if (client_data.sharding) {
    const manager = new ShardingManager('./bot.js', { token: client_data.token })
    manager.on('shardCreate', shard => console.log(`💠 | Shard ${shard_names[shard.id]} ativado`))

    manager.spawn()
} else // Iniciando sem passar pelo sharding
    require('./bot')