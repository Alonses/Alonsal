const { readdirSync } = require('fs')

const { alea_hex } = require('./core/functions/hex_color')
const { getBot } = require('./core/database/schemas/Bot')
const { getUser } = require('./core/database/schemas/User')
const { create_menus } = require('./core/generators/menus')
const { create_profile } = require('./core/generators/profile')
const { create_buttons } = require('./core/generators/buttons')
const { getUserBadges } = require('./core/database/schemas/Badge')
const { listAllUserTasks } = require('./core/database/schemas/Task')
const { registryStatement } = require('./core/database/schemas/Statement')
const { listAllUserGroups } = require('./core/database/schemas/Task_group')
const { getGuild, getGameChannels } = require('./core/database/schemas/Guild')

const { emojis, default_emoji, emojis_dancantes, emojis_negativos } = require('./files/json/text/emojis.json')

const translate = require('./core/formatters/translate')

function internal_functions(client) {

    // Limpando o console e inicializando o bot
    console.clear()

    console.log("🟠 | Inicializando o bot...")
    console.log("🟠 | Vinculando as funções internas")

    client.error = async ({ err, local }) => {
        require("./core/events/error")({ client, err, local })
    }

    client.atualiza_dados = async (alvo, interaction) => {
        if (!alvo.sid) {
            alvo.sid = interaction.guild.id
            await alvo.save()
        }
    }

    // Retorna a quantidade de arquivos com determinada extensão na url especificada
    client.countFiles = (caminho, extensao) => {
        return readdirSync(caminho).filter(file => file.endsWith(extensao)).length
    }

    client.create_buttons = (data, interaction) => {
        return create_buttons(data, interaction)
    }

    client.create_menus = (client, interaction, user, data) => {
        return create_menus(client, interaction, user, data)
    }

    client.create_profile = (client, interaction, user, id_alvo) => {
        return create_profile(client, interaction, user, id_alvo)
    }

    client.decider = (entrada, padrao) => {
        // Verifica se um valor foi passado, caso contrário retorna o valor padrão esperado
        return typeof entrada === "undefined" ? padrao : entrada
    }

    client.defaultEmoji = (caso) => {
        return default_emoji[caso][client.random(default_emoji[caso])]
    }

    client.embed_color = (entrada) => {
        if (entrada === "RANDOM")
            return alea_hex()

        return entrada.slice(-6)
    }

    client.emoji = (dados) => {

        let id_emoji = dados

        if (typeof dados === "object") // Escolhendo um emoji do Array com vários emojis
            if (dados[0].length > 8)
                dados = id_emoji[client.random(id_emoji)]

        let emoji = "🔍"

        // Emojis customizados
        if (typeof dados === "string") {

            if (isNaN(parseInt(dados))) { // Emoji por nome próprio do JSON de emojis

                if (dados == "emojis_dancantes")
                    dados = emojis_dancantes[client.random(emojis_dancantes)]
                else if (dados == "emojis_negativos")
                    dados = emojis_negativos[client.random(emojis_negativos)]
                else
                    dados = emojis[dados]
            }

            emoji = client.discord.emojis.cache.get(dados)?.toString() || "🔍"
        } else // Emojis por códigos de status
            emoji = translate.get_emoji(dados)

        return emoji
    }

    client.getBot = () => {
        return getBot(client.x.clientId)
    }

    client.getGameChannels = () => {
        return getGameChannels()
    }

    client.getGuild = (id_guild) => {
        return getGuild(id_guild)
    }

    client.getUser = (id_user) => {
        return getUser(id_user)
    }

    client.getUserBadges = (id_user) => {
        return getUserBadges(id_user)
    }

    client.getMemberGuild = (interaction, id_alvo) => {
        return interaction.guild.members.fetch(id_alvo)
    }

    client.getCachedUser = (id_alvo) => {
        return client.discord.users.fetch(id_alvo)
    }

    client.locale = (valor, locale) => {

        if (typeof locale === "undefined")
            locale = "pt-br"

        return valor.toLocaleString(locale)
    }

    client.journal = async (caso, quantia) => {
        require('./core/auto/edit_journal')({ client, caso, quantia })
    }

    client.notify = (id_alvo, conteudo) => {
        if (!id_alvo) return

        if (typeof conteudo === "object") { // embed
            if (!conteudo.components && !conteudo.content)
                client.discord.channels.cache.get(id_alvo).send({
                    embeds: [conteudo]
                })
            else if (conteudo.components)
                client.discord.channels.cache.get(id_alvo).send({
                    embeds: [conteudo.embed],
                    components: [conteudo.components]
                })
            else if (conteudo.content)
                client.discord.channels.cache.get(id_alvo).send({
                    content: conteudo.content,
                    embeds: [conteudo.embed]
                })
        } else // texto normal
            client.discord.channels.cache.get(id_alvo).send({
                content: conteudo
            })
    }

    client.random = (intervalo, base) => {
        if (typeof base === "undefined") // Valor minimo aceitável
            base = 0

        if (typeof intervalo === "object") // Recebendo um array de dados
            intervalo = intervalo.length - 1

        return base + Math.round(intervalo * Math.random())
    }

    client.registryStatement = (user, traducao, caso, valor) => {
        return registryStatement(user, traducao, caso, valor, client.timestamp())
    }

    client.replace = (string, valores) => {

        // Substitui partes do texto por outros valores
        if (typeof valores === "object") { // Array com vários dados para alterar

            if (valores.length > 0)
                while (valores.length > 0) {
                    string = string.replace("auto_repl", valores[0])
                    valores.shift()
                }
            else // Recebendo um objeto diferente de array
                string = string.replace("auto_repl", valores)

        } else // Apenas um valor para substituição
            string = string.replaceAll("auto_repl", valores)

        return string
    }

    client.sendDM = (user, dados, force) => {

        let notifications

        // Previne que o bot envie DM's para si mesmo
        if (user.uid === client.id()) return

        if (force)
            user.conf.notify = 1

        // Notificando o usuário alvo caso ele receba notificações em DM do bot
        if (client.decider(user?.conf.notify, 1))
            client.discord.users.fetch(user.uid).then((user_interno) => {

                // Verificando qual é o tipo de conteúdo que será enviado
                if (dados.embed) {
                    if (!dados.components)
                        user_interno.send({
                            embeds: [dados.embed]
                        })
                            .catch(() => notifications = 1)
                    else
                        user_interno.send({
                            embeds: [dados.embed],
                            components: [dados.components]
                        })
                            .catch(() => notifications = 1)
                } else if (dados.files)
                    user_interno.send({
                        content: dados.data,
                        files: [dados.files]
                    })
                        .catch(() => notifications = 1)
                else
                    user_interno.send(dados.data)
                        .catch(() => notifications = 1)
            })

        // Usuário com DM bloqueada
        if (notifications) {
            user.conf.notify = false
            user.save()
        }
    }

    // Aleatoriza o texto de entrada
    client.shuffleArray = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]
        }

        return arr
    }

    client.timestamp = () => {
        return Math.floor(new Date().getTime() / 1000)
    }

    client.update_tasks = async (interaction) => {

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

    client.verifyUserRanking = async (id_user) => {

        // Valida se o usuário possui ranking ativo
        let user = await client.getUser(id_user)
        let user_ranking = true

        if (typeof user.conf.ranking !== "undefined")
            user_ranking = user.conf.ranking

        return user_ranking
    }

    console.log(`🟢 | Funções internas vinculadas com sucesso.`)
}

module.exports.internal_functions = internal_functions