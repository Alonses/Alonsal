const { PermissionsBitField } = require('discord.js')

const { readdirSync } = require('fs')

const { alea_hex } = require('./core/functions/hex_color')
const { getBot } = require('./core/database/schemas/Bot')
const { getUser } = require('./core/database/schemas/User')
const { create_menus } = require('./core/generators/menus')
const { create_profile } = require('./core/generators/profile')
const { create_buttons } = require('./core/generators/buttons')
const { createBadge, getUserBadges } = require('./core/database/schemas/Badge')
const { listAllUserTasks } = require('./core/database/schemas/Task')
const { registryStatement } = require('./core/database/schemas/Statement')
const { listAllUserGroups } = require('./core/database/schemas/Task_group')
const { getGuild, getGameChannels } = require('./core/database/schemas/Guild')

const { emojis, default_emoji, emojis_dancantes, emojis_negativos } = require('./files/json/text/emojis.json')
const { busca_badges, badgeTypes } = require('./core/data/badges')

const translate = require('./core/formatters/translate')
let libera_user_att = 0

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

    // Retorna o membro do servidor
    client.getMemberGuild = (interaction, id_alvo) => {
        let membro = interaction.guild.members.fetch(id_alvo)
            .catch(() => { return null })

        return membro
    }

    // Busca pelo usuário em cache
    client.getCachedUser = (id_alvo) => {
        return client.discord.users.fetch(id_alvo)
    }

    // Converte o valor numério para um formato específico
    client.locale = (valor, locale) => {

        if (typeof locale === "undefined")
            locale = "pt-br"

        return valor.toLocaleString(locale)
    }

    // Registra os eventos no diário do bot
    client.journal = async (caso, quantia) => {
        require('./core/auto/edit_journal')({ client, caso, quantia })
    }

    // Cria uma lista com vírgulas e & no último elemento
    client.list = (valores, tamanho_maximo) => {

        let lista = ""

        for (let i = 0; i < valores.length; i++) {
            if (typeof valores[i + 1] === "undefined")
                lista += " & "

            lista += `\`${valores[i]}\``

            if (typeof valores[i + 2] !== "undefined")
                lista += ", "
        }

        if (tamanho_maximo)
            if (lista.length > tamanho_maximo)
                lista = `${lista.slice(0, tamanho_maximo)}...`

        return lista
    }

    // Envia uma notificação em um canal
    client.notify = async (id_alvo, conteudo) => {

        if (!id_alvo) return
        const canal = await client.discord.channels.cache.get(id_alvo)

        // Verificando se o bot possui permissões para enviar mensagens ou ver o canal
        if (!canal.permissionsFor(client.id()).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]))
            return

        if (typeof conteudo === "object") { // embed
            if (!conteudo.components && !conteudo.content && !conteudo.file)
                canal.send({
                    embeds: [conteudo]
                })
            else if (conteudo.components)
                canal.send({
                    embeds: [conteudo.embed],
                    components: [conteudo.components]
                })
            else if (conteudo.content)
                canal.send({
                    content: conteudo.content,
                    embeds: [conteudo.embed]
                })
            else if (conteudo.file) // Usado pelo canvas com embed
                canal.send({
                    embeds: [conteudo.embed],
                    files: [conteudo.file]
                })
        } else // texto normal
            canal.send({
                content: conteudo
            })
    }

    // Retorna um valor aleatório
    client.random = (intervalo, base) => {
        if (typeof base === "undefined") // Valor minimo aceitável
            base = 0

        if (typeof intervalo === "object") // Recebendo um array de dados
            intervalo = intervalo.length - 1

        return base + Math.round(intervalo * Math.random())
    }

    client.registryBadge = async (user, id_badge) => {

        const all_badges = [], badges_user = await getUserBadges(user.uid)

        // Listando todas as badges que o usuário possui
        if (badges_user.length > 0)
            badges_user.forEach(valor => {
                all_badges.push(parseInt(valor.badge))
            })

        if (!all_badges.includes(id_badge)) {

            // Atribuindo a badge reporter ao usuário
            await createBadge(user.uid, id_badge, client.timestamp())
            const badge = busca_badges(client, badgeTypes.SINGLE, id_badge)

            client.sendDM(user, { data: client.replace(client.tls.phrase(user, "dive.badges.new_badge", client.emoji("emojis_dancantes")), [badge.name, badge.emoji]) })
        }
    }

    // Registra uma movimentação bancária do usuário
    client.registryStatement = (user, traducao, caso, valor) => {
        return registryStatement(user, traducao, caso, valor, client.timestamp())
    }

    // Substitui partes do texto por outros valores
    client.replace = (string, valores, especifico) => {

        if (!especifico) {
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
        } else
            string = string.replaceAll(especifico[0], especifico[1])

        return string
    }

    // Envia uma notificação em DM para o usuário
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

    // Atualiza o formato de salvamento das tarefas
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

    // Verifica se o logger possui acesso ao registro de auditoria do servidor
    client.verifyLogger = async (interaction) => {
        const bot = await client.getMemberGuild(interaction, client.id())
        let aprovacao = 1

        // Permissão para ver o registro de auditoria, desabilitando o logger
        if (!bot.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {

            aprovacao = 0
            guild.conf.logger = 0
            await guild.save()
        }

        return aprovacao
    }

    // Atualiza o idioma padrão do usuário caso não possua
    client.verifyUserLanguage = async (user, id_guild) => {

        return

        // Valida se o usuário não possui um idioma padrão definido
        if (!user.lang && !libera_user_att) {

            libera_user_att = 1
            const guild = await client.getGuild(id_guild)

            user.lang = guild.lang || "pt-br"
            await user.save()

            libera_user_att = 0
        }
    }

    // Valida se o usuário possui ranking ativo
    client.verifyUserRanking = async (id_user) => {

        let user = await client.getUser(id_user)
        let user_ranking = true

        if (typeof user.conf.ranking !== "undefined")
            user_ranking = user.conf.ranking

        return user_ranking
    }

    console.log(`🟢 | Funções internas vinculadas com sucesso.`)
}

module.exports.internal_functions = internal_functions