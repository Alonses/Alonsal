require('dotenv').config()

const { ShardingManager } = require('discord.js')
const shard_names = require('./files/json/text/shard_names.json')

const manager = new ShardingManager('./bot.js', { token: process.env.token })

// Limpando o console e inicializando o bot
console.clear()

manager.on('shardCreate', shard => console.log(`💠 | Shard ${shard_names[shard.id]} ativado`))

manager.spawn()