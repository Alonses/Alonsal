const { Client, GatewayIntentBits, Partials } = require('discord.js')

const idioma = require('./core/data/language')
const translate = require('./core/formatters/translate')
const { client_data } = require('./setup')

/* --------------------------------------------------------------- */

const cli = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Message,
        Partials.GuildMember
    ],
    disableEveryone: false
})

class CeiraClient {
    constructor() {
        this.discord = cli
        this.tls = translate
        this.idioma = idioma
        this.x = client_data
        this.cached = {
            last_interaction: 0,
            broad_status: false,
            presence: null
        }
    }

    avatar() {
        return this.discord.user.avatarURL({ dynamic: true })
    }

    channels(type) {

        if (typeof type !== "undefined")
            return this.discord.channels.cache.filter((c) => c.type === type)

        return this.discord.channels.cache
    }

    guilds(id_guild) {

        let guilds_cache = this.discord.guilds.cache
        let guilds

        if (id_guild)
            guilds_cache.forEach(guild => {
                if (guild.id === id_guild)
                    guilds = guild
            })
        else
            guilds = guilds_cache

        return guilds
    }

    id() {
        return this.discord.user.id
    }

    login(token) {
        return this.discord.login(token)
    }

    user() {
        return this.discord.user
    }

    username() {
        return this.discord.user.username
    }
}

module.exports.CeiraClient = CeiraClient