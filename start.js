const server = require("./server/server.js")
const bot = require("./bot.js")

require( 'dotenv').config()
server.listen(process.env.PORT || 5000)
bot.login(process.env.TOKEN);