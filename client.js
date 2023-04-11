const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js')

const { readdirSync } = require('fs')

const { alea_hex } = require('./adm/funcoes/hex_color')
const { getUser } = require('./adm/database/schemas/User')
const { getGuild, getGameChannels } = require('./adm/database/schemas/Guild')
const { getTicket, dropTicket } = require('./adm/database/schemas/Tickets')
const { getBadges } = require('./adm/database/schemas/Badge')
const { getRankGlobal } = require('./adm/database/schemas/Rank_g')
const { create_buttons } = require('./adm/discord/create_buttons')
const { getRankServer, getUserRankServer } = require('./adm/database/schemas/Rank_s')

const idioma = require('./adm/data/idioma')
const auto = require('./adm/data/relatorio')
const translate = require('./adm/formatadores/translate')

const { default_emoji } = require('./arquivos/json/text/emojis.json')

/* --------------------------------------------------------------- */
// Alterna entre o modo normal e modo de testes
const update_commands = 0
let modo_develop = 0, status = 1, ranking = 1, force_update = 0, silent = 0, modules = 0

if (update_commands)
    modo_develop = 0, force_update = 1, silent = 1, modules = 0

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
            modules: modules,

            clientId: clientId,
            token: token,
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

    emoji(id_emoji) {
        if (typeof id_emoji === "object") // Escolhendo um emoji do Array com vários emojis
            id_emoji = id_emoji[this.random(id_emoji)]

        return this.discord.emojis.cache.get(id_emoji)?.toString() || "🔍"
    }

    embed_color(entrada) {
        if (entrada === "RANDOM")
            return alea_hex()

        return entrada.slice(-6)
    }

    getUser(id_user) {
        return getUser(id_user)
    }

    getGuild(id_guild) {
        return getGuild(id_guild)
    }

    getGameChannels() {
        return getGameChannels()
    }

    getTicket(id_server, id_user) {
        return getTicket(id_server, id_user)
    }

    dropTicket(id_server, id_user) {
        return dropTicket(id_server, id_user)
    }

    async userRanking(id_user) {

        // Valida se o usuário possui ranking ativo
        let user = await this.getUser(id_user)
        let user_ranking = true

        if (typeof user.conf.ranking !== "undefined")
            user_ranking = user.conf.ranking

        return user_ranking
    }

    getBadges(id_user) {
        return getBadges(id_user)
    }

    getRankServer(id_server) {
        return getRankServer(id_server)
    }

    getUserGuild(interaction, id_alvo) {
        return interaction.guild.members.fetch(id_alvo)
    }

    getUserRankServer(id_user, id_server) {
        return getUserRankServer(id_user, id_server)
    }

    getRankGlobal() {
        return getRankGlobal()
    }

    create_buttons(lista_botoes, interaction) {
        return create_buttons(lista_botoes, interaction)
    }

    notify(id_alvo, conteudo) {
        if (typeof conteudo === "object") // embed
            this.discord.channels.cache.get(id_alvo).send({ embeds: [conteudo] })
        else // texto normal
            this.discord.channels.cache.get(id_alvo).send({ content: conteudo })
    }

    // Retorna a quantidade de arquivos com determinada extensão na url especificada
    countFiles(caminho, extensao) {
        return readdirSync(caminho).filter(file => file.endsWith(extensao)).length
    }

    // Aleatoriza o texto de entrada
    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]
        }

        return arr
    }

    random(intervalo, base) {

        if (typeof base === "undefined") // Valor minimo aceitável
            base = 0

        if (typeof intervalo === "object") // Recebendo um array de dados
            intervalo = intervalo.length - 1

        return base + Math.round(intervalo * Math.random())
    }

    locale(valor, locale) {

        if (typeof locale === "undefined")
            locale = "pt-br"

        return valor.toLocaleString(locale)
    }

    sendDM(user, value) {

        let notificar = true

        if (typeof user.conf.notify !== "undefined")
            notificar = user.conf.notify

        if (notificar) // Notificando o usuário alvo caso ele receba notificações em DM do bot
            if (user.uid !== this.id())
                this.discord.users.fetch(user.uid, false).then((user_interno) => {
                    // Enviando a mensagem para o usuário na DM
                    // Verificando se a mensagem é um embed
                    if (typeof value !== "object")
                        user_interno.send(value)
                    else
                        user_interno.send({ embeds: [value] })
                })
    }

    defaultEmoji(caso) {
        return default_emoji[caso][this.random(default_emoji[caso])]
    }

    timestamp() {
        return Math.floor(new Date().getTime() / 1000)
    }
}

module.exports.CeiraClient = CeiraClient