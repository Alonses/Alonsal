const { ShardingManager } = require('discord.js')
const { client_data } = require('./setup')

// console.clear() // Limpando o console e inicializando o bot

if (client_data.sharding) {

    const phonetic_alphabet = require('./files/json/text/phonetic_alphabet.json')

    const manager = new ShardingManager('./bot.js', { token: client_data.token })
    manager.on('shardCreate', shard => console.log(`💠 | Shard ${phonetic_alphabet[shard.id]} ativado`))

    manager.spawn()
} else // Iniciando sem ativar o sharding
    require('./bot')
