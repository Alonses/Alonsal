const { ShardingManager } = require('discord.js')
const { client_data } = require('./setup')

const shard_names = require('./files/json/text/shard_names.json')

const manager = new ShardingManager('./bot.js', { token: client_data.token })

console.clear() // Limpando o console e inicializando o bot

manager.on('shardCreate', shard => console.log(`💠 | Shard ${shard_names[shard.id]} ativado`))

manager.spawn()