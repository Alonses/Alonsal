const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js')

const { readdirSync } = require('fs')

const { alea_hex } = require('./adm/funcoes/hex_color')
const { getUser } = require('./adm/database/schemas/User')
const { getGuild, getGameChannels } = require('./adm/database/schemas/Guild')
const { getTicket, dropTicket } = require('./adm/database/schemas/Tickets')
const { getUserBadges } = require('./adm/database/schemas/Badge')
const { getRankGlobal } = require('./adm/database/schemas/Rank_g')
const { create_buttons } = require('./adm/interacoes/generators/create_buttons')
const { create_menus } = require('./adm/interacoes/generators/create_menus')
const { getRankServer, getUserRankServer } = require('./adm/database/schemas/Rank_s')
const { getBot } = require('./adm/database/schemas/Bot')
const { listAllUserTasks } = require('./adm/database/schemas/Task')
const { listAllUserGroups } = require('./adm/database/schemas/Task_group')

const idioma = require('./adm/data/idioma')
const translate = require('./adm/formatadores/translate')

const { default_emoji } = require('./arquivos/json/text/emojis.json')

/* --------------------------------------------------------------- */
// Alterna entre o modo normal e modo de testes
const update_commands = 0
let modo_develop = 0, status = 1, ranking = 1, force_update = 0, silent = 0, modules = 1, relatorio = 1
let token = process.env.token_1, clientId = process.env.client_1

// Ative para limpar os comandos slash locais e globais
let delete_slash = 0

if (update_commands) // Force update é utilizado para forçar a atualização dos comandos slash
    modo_develop = 0, force_update = 1, silent = 1, modules = 0, relatorio = 0

if (silent || modo_develop)
    status = 0, ranking = 0, modules = 0, relatorio = 0

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
            this.idioma = idioma
        this.x = { // Variáveis de configuração inicial do bot
            modo_develop: modo_develop,
            force_update: force_update,
            ranking: ranking,
            status: status,
            modules: modules,
            relatorio: relatorio,
            delete_slash: delete_slash,

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

    emoji(dados) {

        let id_emoji = dados

        if (typeof dados === "object") // Escolhendo um emoji do Array com vários emojis
            if (dados[0].length > 8)
                dados = id_emoji[this.random(id_emoji)]

        let emoji = "🔍"

        // Emojis customizados
        if (typeof dados === "string")
            emoji = this.discord.emojis.cache.get(dados)?.toString() || "🔍"
        else // Emojis por códigos de status
            emoji = translate.get_emoji(dados)

        return emoji
    }

    embed_color(entrada) {
        if (entrada === "RANDOM")
            return alea_hex()

        return entrada.slice(-6)
    }

    getBot() {
        return getBot(clientId)
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

    getUserBadges(id_user) {
        return getUserBadges(id_user)
    }

    getRankServer(id_server) {
        return getRankServer(id_server)
    }

    getUserGuild(interaction, id_alvo) {
        return interaction.guild.members.cache.get(id_alvo)
    }

    getUserRankServer(id_user, id_server) {
        return getUserRankServer(id_user, id_server)
    }

    getRankGlobal() {
        return getRankGlobal()
    }

    create_buttons(data, interaction) {
        return create_buttons(data, interaction)
    }

    create_menus(client, interaction, user, data) {
        return create_menus(client, interaction, user, data)
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

    sendDM(user, dados, modulo) {

        // Previne que o bot envie DM's para si mesmo
        if (user.uid === this.id()) return

        if (modulo)
            user.conf.notify = 1

        // Notificando o usuário alvo caso ele receba notificações em DM do bot
        if (this.decider(user?.conf.notify, 1))
            this.discord.users.fetch(user.uid, false).then((user_interno) => {

                // Verificando qual é o tipo de conteúdo que será enviado
                if (dados.embed)
                    user_interno.send({ embeds: [dados.embed] })
                else if (dados.file)
                    user_interno.send({ content: dados.data, files: [dados.file] })
                else
                    user_interno.send(dados.data)
            })
    }

    defaultEmoji(caso) {
        return default_emoji[caso][this.random(default_emoji[caso])]
    }

    timestamp() {
        return Math.floor(new Date().getTime() / 1000)
    }

    decider(entrada, padrao) {
        // Verifica se um valor foi passado, caso contrário retorna o valor padrão esperado
        return !entrada ? padrao : entrada
    }

    async atualiza_dados(alvo, interaction) {
        if (!alvo.sid) {
            alvo.sid = interaction.guild.id
            await alvo.save()
        }
    }

    async update_tasks(interaction) {

        const tasks = await listAllUserTasks(interaction.user.id)
        const listas = await listAllUserGroups(interaction.user.id)

        // Vincula a task com a lista usando o timestamp da lista
        for (let i = 0; i < tasks.length; i++) {
            for (let x = 0; x < listas.length; x++) {
                if (!tasks[i].g_timestamp) {
                    if (tasks[i].group === listas[x].name) {

                        tasks[i].g_timestamp = listas[x].timestamp
                        tasks[i].group = null
                        await tasks[i].save()
                    }
                }
            }
        }
    }

    replace(string, valores) {

        // Substitui partes do texto por outros valores
        if (typeof valores === "object") { // Array com vários dados para alterar
            while (valores.length > 0) {
                string = string.replace("auto_repl", valores[0])
                valores.shift()
            }
        } else // Apenas um valor para substituição
            string = string.replaceAll("auto_repl", valores)

        return string
    }
}

module.exports.CeiraClient = CeiraClient