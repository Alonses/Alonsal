const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js')

const { alea_hex } = require('./adm/funcoes/hex_color')
const { getUser } = require('./adm/database/schemas/User.js')

const idioma = require('./adm/data/idioma')
const auto = require('./adm/data/relatorio')
const translate = require('./adm/formatadores/translate')

/* --------------------------------------------------------------- */
// Alterna entre o modo normal e modo de testes
const modo_develop = 0, force_update = 0, silent = 0
let status = 1, ranking = 1

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

    channels() {
        return this.discord.channels.cache
    }

    formata_num(valor) {
        return parseFloat(valor).toLocaleString('pt-BR')
    }

    emoji(id_emoji) {
        if (typeof id_emoji == "object") // Escolhendo um emoji do Array com vários emojis
            id_emoji = id_emoji[Math.round((id_emoji.length - 1) * Math.random())]

        return this.discord.emojis.cache.get(id_emoji).toString()
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

    notify(id_alvo, tipo, conteudo) {

        if (!this.client) return

        try {
            if (tipo === 1) // embed
                this.discord.channels.cache.get(id_alvo).send({ embeds: [conteudo] })
            else // texto normal
                this.discord.channels.cache.get(id_alvo).send({ content: conteudo })
        } catch (err) {
            const client = this.discord
            require('./adm/eventos/error.js')({ client, err })
        }
    }
}

module.exports = {
    CeiraClient
}