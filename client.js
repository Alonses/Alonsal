const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js')

const { alea_hex } = require('./adm/funcoes/hex_color')
const { getUser } = require('./adm/database/schemas/User.js')
const { getBadges } = require('./adm/database/schemas/Badge.js')
const { getRankGlobal } = require('./adm/database/schemas/Rank_g')
const { getRankServer, getUserRankServer } = require('./adm/database/schemas/Rank_s')

const idioma = require('./adm/data/idioma')
const auto = require('./adm/data/relatorio')
const translate = require('./adm/formatadores/translate')

/* --------------------------------------------------------------- */
// Alterna entre o modo normal e modo de testes
const update_commands = 0
let modo_develop = 0, status = 1, ranking = 1, force_update = 0, silent = 0

if (update_commands)
    modo_develop = 0, force_update = 1, silent = 1

let token = process.env.token_1, clientId = process.env.client_1

if (silent || modo_develop)
    status = 0, ranking = 0

// Force update é utilizado para forçar a atualização dos comandos slash
// globais e privados do bot
if (modo_develop)
    token = process.env.token_2, clientId = process.env.client_2

/* --------------------------------------------------------------- */

const cli = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        IntentsBitField.Flags.GuildMembers
    ]
})

class CeiraClient {
    constructor() {
        this.discord = cli,
            this.tls = translate,
            this.idioma = idioma,
            this.auto = auto
        this.x = { // Variáveis de configuração inicial do bot
            modo_develop: modo_develop,
            force_update: force_update,
            ranking: ranking,
            status: status,

            clientId: clientId,
            token: token,
        },
            this.stats = {
                commands: 0,
                private: 0,
                inputs: 0
            }
    }

    id() {
        return this.discord.user.id
    }

    user() {
        return this.discord.user
    }

    guilds() {
        return this.discord.guilds.cache
    }

    channels(type) {

        if (typeof type !== "undefined")
            return this.discord.channels.cache.filter((c) => c.type === type)

        return this.discord.channels.cache
    }

    formata_num(valor) {
        return parseFloat(valor).toLocaleString('pt-BR')
    }

    emoji(id_emoji) {
        if (typeof id_emoji === "object") // Escolhendo um emoji do Array com vários emojis
            id_emoji = id_emoji[Math.round((id_emoji.length - 1) * Math.random())]

        return this.discord.emojis.cache.get(id_emoji)?.toString() || "🔍"
    }

    embed_color(entrada) {
        if (entrada === "RANDOM")
            return alea_hex()
        else
            return entrada
    }

    login(token) {
        return this.discord.login(token)
    }

    getUser(id_user) {
        return getUser(id_user)
    }

    getBadges(id_user) {
        return getBadges(id_user)
    }

    getRankServer(id_server) {
        return getRankServer(id_server)
    }

    getUserRankServer(id_user, id_server) {
        return getUserRankServer(id_user, id_server)
    }

    getRankGlobal() {
        return getRankGlobal()
    }

    notify(id_alvo, conteudo) {
        if (typeof conteudo === "object") // embed
            this.discord.channels.cache.get(id_alvo).send({ embeds: [conteudo] })
        else // texto normal
            this.discord.channels.cache.get(id_alvo).send({ content: conteudo })
    }
}

module.exports = {
    CeiraClient
}