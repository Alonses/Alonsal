const { Client, GatewayIntentBits, IntentsBitField, Partials } = require('discord.js')

const idioma = require('./core/data/language')
const translate = require('./core/formatters/translate')

/* --------------------------------------------------------------- */
// Alterna entre o modo normal e modo de testes
const update_commands = 0
let modo_develop = 0, status = 1, ranking = 1, force_update = 0, silent = 0, modules = 1, relatorio = 1, logger = 1
let token = process.env.token_1, clientId = process.env.client_1

// Ative para limpar os comandos slash locais e globais
let delete_slash = 0

if (update_commands) // Force update é utilizado para forçar a atualização dos comandos slash
    modo_develop = 0, force_update = 1, silent = 1, modules = 0, relatorio = 0

if (silent || modo_develop)
    status = 0, ranking = 0, modules = 0, relatorio = 0, logger = 0

// Modo de depuração do alonsal (utiliza bots secundários)
if (modo_develop)
    token = process.env.token_2, clientId = process.env.client_2

/* --------------------------------------------------------------- */

const cli = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        IntentsBitField.Flags.GuildMembers
    ],
    partials: [
        Partials.Message,
        Partials.GuildMember
    ],
    disableEveryone: false
})

class CeiraClient {
    constructor() {
        this.discord = cli,
            this.tls = translate,
            this.idioma = idioma
        this.x = { // Variáveis de configuração inicial do bot
            status: status,
            logger: logger,
            modules: modules,
            ranking: ranking,
            relatorio: relatorio,
            modo_develop: modo_develop,
            force_update: force_update,
            delete_slash: delete_slash,

            token: token,
            clientId: clientId
        },
            this.cached = {
                broad_status: false
            }
    }

    login(token) {
        return this.discord.login(token)
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
}

module.exports.CeiraClient = CeiraClient