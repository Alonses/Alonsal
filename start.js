const bot = require("./bot.js")

require( 'dotenv').config()
bot.login(process.env.TOKEN);