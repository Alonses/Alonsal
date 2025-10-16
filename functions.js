const { readdirSync } = require('fs')

const { alea_hex } = require('./core/functions/hex_color')

const { getBot } = require('./core/database/schemas/Bot')

const { create_buttons } = require('./core/generators/buttons')
const { create_embed } = require('./core/generators/embed')
const { create_menus } = require('./core/generators/menus')
const { create_profile } = require('./core/generators/profile')

const { registryStatement } = require('./core/database/schemas/User_statements')
const { getUserBadges } = require('./core/database/schemas/User_badges')
const { getGuild } = require('./core/database/schemas/Guild')

const { data_encrypt, data_decipher } = require('./core/data/crypto')

const network = require('./core/events/network')
const translate = require('./core/formatters/translate')

const { palette } = require('./core/formatters/patterns/color')
const { aliases, default_emoji, emojis_dancantes, emojis_negativos } = require('./files/json/text/emojis.json')

function internal_functions(client) {

    console.log("🟠 | Inicializando o bot...")
    console.log("🟠 | Vinculando as funções internas")

    client.error = async (err, local) => { require("./core/events/error")(client, err, local) }

    client.atualiza_dados = async (alvo, interaction) => {
        if (!alvo.sid) {
            alvo.sid = interaction.guild.id
            await alvo.save()
        }
    }

    // Retorna a quantidade de arquivos com determinada extensão na url especificada
    client.countFiles = (caminho, extensao) => { return readdirSync(caminho).filter(file => file.endsWith(extensao)).length }

    client.create_buttons = (data, interaction, alvo_traducao) => { return create_buttons(client, data, interaction, alvo_traducao) }

    client.create_embed = (data, alvo) => { return create_embed({ client, alvo, data }) }

    client.create_menus = ({ interaction, user, data, pagina, multi_select, guild }) => { return create_menus({ client, interaction, user, data, pagina, multi_select, guild }) }

    client.create_profile = ({ interaction, user, id_user, operador }) => { return create_profile({ client, interaction, user, id_user, operador }) }

    // Verifica se um valor foi passado, caso contrário retorna o valor padrão esperado
    client.decider = (entrada, padrao) => { return !entrada ? padrao : entrada }

    client.decifer = (entrada) => {

        if (!entrada) return null
        return data_decipher(entrada)
    }

    client.defaultEmoji = (caso) => { return default_emoji[caso][client.execute("random", { intervalo: default_emoji[caso] })] }

    client.deferedReply = async (interaction, data) => {

        // Estende o tempo de resposta da interação
        let response = {}
        if (data) response.flags = data

        await interaction.deferReply(response)
    }

    client.deferedResponse = async ({ interaction, ephemeral }) => {

        let response = {}
        if (ephemeral) response.flags = ephemeral

        if (!interaction.customId) await interaction.deferReply(response)
        else await interaction.deferUpdate(response)
    }

    client.embed_color = (entrada) => {

        if (entrada.toLowerCase() === "random") return alea_hex()

        // Verificando se o nome da cor solicitada existe
        if (palette[entrada]) return palette[entrada]

        return entrada.slice(-6)
    }

    client.emoji = (dados) => {

        let id_emoji = dados

        if (typeof dados === "object") // Escolhendo um emoji do Array com vários emojis
            if (dados[0].length > 15) dados = id_emoji[client.execute("random", { intervalo: dados })]

        // Emojis customizados
        if (isNaN(parseInt(dados))) { // Emoji por nome próprio do JSON de emojis

            if (dados == "emojis_dancantes") dados = emojis_dancantes[client.execute("random", { intervalo: emojis_dancantes })]
            else if (dados == "emojis_negativos") dados = emojis_negativos[client.execute("random", { intervalo: emojis_negativos })]
            else dados = aliases[dados]

            return client.formatEmoji(dados, client.discord.emojis.cache.get(dados))
        } else {
            if (dados.length > 15) return client.formatEmoji(dados, client.discord.emojis.cache.get(dados)) // Emoji por ID
            else return translate.get_emoji(dados) // Emoji padrão por código interno
        }
    }

    client.encrypt = (valor) => {
        if (!valor) return null

        return data_encrypt(valor)
    }

    client.formatEmoji = (id, emoji) => {

        if (!id || !emoji) return "🔎"

        const formatado = `<:${emoji.name}:${id}>`

        return emoji.animated ? formatado.replace("<:", "<a:") : formatado
    }

    client.execute = (funcao, data) => {

        if (client.x.debug_mode) {
            console.log("---------------------------\n🟡 | client.execute ->", funcao)
            console.trace()
        }

        // Executa funções importadas previamente com os dados informados
        try {
            if (client[funcao]) return client[funcao]({ client, data })
            else console.error(`🛑 | A função "${funcao}" não existe.`)
        } catch (err) {
            console.error(`🛑 | Erro ao executar a função "${funcao}":`, err)
        }
    }

    client.getBot = () => { return getBot(client.x.id) }

    client.getGuild = (id_guild) => { return getGuild(id_guild) }

    client.getGuildChannel = async (id_alvo) => { return await client.discord.channels.cache.get(id_alvo) }

    // Retorna o cargo solicitado
    client.getGuildRole = (interaction, id_cargo) => { return interaction.guild.roles.cache.find((r) => r.id === id_cargo) }

    client.getUserBadges = (id_user) => { return getUserBadges(id_user) }

    // Busca pelo usuário em cache
    client.getCachedUser = (id_alvo) => { return client.discord.users.fetch(id_alvo) }

    // Registra os eventos no diário do bot
    client.journal = async (caso, quantia) => { require('./core/auto/edit_journal')({ client, caso, quantia }) }

    // Sincroniza as ações moderativas em servidores com o network habilitado
    client.network = async (guild, caso, id_alvo) => { return network({ client, guild, caso, id_alvo }) }

    // Remove emojis e caracteres especiais da string
    client.normalizeString = (string) => { return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}\p{P}\p{Z}{^$=+±\\'|`\\~<>}]/gu, "") }

    // Registra a experiência recebida pelo membro
    client.registryExperience = (message, caso) => {

        if (!client.x.ranking) return

        require('./core/data/user_ranking')({ client, message, caso })
    }

    // Registra uma movimentação bancária do usuário
    client.registryStatement = (user, traducao, caso, valor) => { return registryStatement(client, user, traducao, caso, valor) }

    client.reply = (interaction, obj, defered) => {

        // Interação não efemera
        if (!obj.flags) delete obj.flags

        // Interação deferida
        if (defered) return interaction.editReply(obj)

        // Respondendo as interações
        if (interaction.customId) return interaction.update(obj)
        else return interaction.reply(obj)
    }

    client.hasRole = async (interaction, role_id, id_user) => {

        const user_member = await client.execute("getMemberGuild", { interaction, id_user })
        if (user_member.roles.cache.has(role_id)) return true
        return false
    }

    client.sendModule = async (alvo, dados, internal_module) => {

        // Decide para qual destino será enviado o módulo
        if (internal_module.misc.scope === "user") client.execute("sendDM", { user: alvo, dados, force: true, internal_module })
        else client.execute("notify", { id_canal: client.decifer(internal_module.misc.cid), conteudo: dados, objeto: internal_module })
    }

    // Aleatoriza o texto de entrada
    client.shuffleArray = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]
        }

        return arr
    }

    client.switcher = ({ dado, operations, operacao }) => {

        // Inverte o valor de botões liga/desliga
        const local = (operations[operacao].action).split(".")

        // Vasculha o objeto do servidor a procura do valor para alterar
        local.reduce((acc, key, index) => {
            if (index === local.length - 1)
                acc[key] = !acc[key]

            return acc[key]
        }, dado)

        const pagina_guia = operations[operacao].page

        return { dado, pagina_guia }
    }

    client.user_title = (user, escopo, chave_traducao, emoji_padrao) => {

        // Retorna o texto formatado para membros e bots (usado em cards do log de eventos)
        return `${user.bot ? client.emoji("icon_integration") : emoji_padrao ? emoji_padrao : client.defaultEmoji("person")} **${client.tls.phrase(escopo, chave_traducao)}${user.bot ? ` ( ${user.id !== client.id() ? client.tls.phrase(escopo, "util.user.bot") : client.tls.phrase(escopo, "util.user.alonsal")} )` : ""}**`
    }

    client.importFunctions = async () => {

        // Importa todas as funções internas do bot
        for (const file of readdirSync(`${__dirname}/core/functions`).filter(file => file.endsWith('.js'))) {

            const funcao = require(`${__dirname}/core/functions/${file}`)
            client[file.replace(".js", "")] = funcao
        }
    }

    // Importando as funções internas do bot para o cache
    try {
        client.importFunctions()
    } catch (err) {
        console.error("🛑 | Erro ao importar as funções internas do bot:", err)
    }

    console.log(`🟢 | Funções internas vinculadas com sucesso.`)
}

module.exports.internal_functions = internal_functions