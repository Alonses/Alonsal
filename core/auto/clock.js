const { mkdirSync, existsSync } = require('fs')

const sync_dynamic_badges = require("./triggers/user_dynamic_badges")

const { verifica_warns, atualiza_warns } = require("./triggers/user_warns")
const { verifica_roles, atualiza_roles } = require("./triggers/user_roles")
const { requisita_modulo, atualiza_modulos } = require("./triggers/modules")
const { verifica_user_eraser, atualiza_user_eraser } = require("./triggers/user_eraser")

const { verifica_servers } = require("../data/user_ranking")
const { atualiza_join_guilds } = require('./triggers/guild_join_roles')
const { atualiza_fixed_badges } = require('./triggers/user_fixed_badges')
const { atualiza_user_subscription, verifica_subscribers } = require('./triggers/user_subscription')
const { verifica_eraser, atualiza_eraser } = require("./triggers/guild_eraser")
const { verifica_pre_warns, atualiza_pre_warns } = require('./triggers/guild_pre_warns')
const { verifica_canais_dinamicos, atualiza_voice_channels } = require('./triggers/guild_voice_channels')

module.exports = async ({ client }) => {

    // Sincronizando as configurações de recursos
    const bot = await client.getBot()

    Object.keys(bot.conf).forEach(valor => {
        client.x[valor] = bot.conf[valor]
    })

    if (!existsSync(`./files/data/`)) // Criando a pasta de dados para poder salvar em cache
        mkdirSync(`./files/data/`, { recursive: true })

    const date1 = new Date() // Trava o cronometro em um intervalo de 60 segundos
    const tempo_restante = 10 - date1.getSeconds()

    atualiza_warns()
    atualiza_pre_warns()

    atualiza_roles()
    atualiza_join_guilds(client)
    atualiza_voice_channels(client)

    if (client.x.modules) atualiza_modulos()
    atualiza_fixed_badges(client)

    // Funções relacionadas a assinantes do Alonsal
    await atualiza_user_subscription(client)

    atualiza_eraser()
    atualiza_user_eraser(client)

    // Verifica todos os canais dinâmicos salvos ao ligar o bot
    if (client.x.voice_channels && !client.x.guild_timeout) verifica_canais_dinamicos(client)

    console.log("📣 | Disparando o relógio interno")

    setTimeout(() => internal_clock(client, tempo_restante), 5000)
}

internal_clock = (client, tempo_restante) => {

    setTimeout(() => { // Sincronizando os dados do bot

        const horario_agora = new Date()
        const timestamp_atual = client.execute("timestamp")

        if (horario_agora.getHours() === 0 && horario_agora.getMinutes() === 0) // Meia noite
            require('./await_journal')({ client }) // Enviando o relatório diário

        if (client.x.modules) requisita_modulo(client) // Verificando se há modulos agendados para o horário atual
        verifica_warns(client) // Sincronizando as advertências temporárias
        verifica_pre_warns(client) // Sincronizando as anotações de advertências temporárias
        verifica_roles(client) // Sincronizando os cargos temporários

        if (timestamp_atual % 600 < 60) { // 10 Minutos
            sync_dynamic_badges(client) // Sincronizando as badges que são dinâmicas
            verifica_eraser(client) // Verificando se há dados de servidores que se expiraram
            verifica_user_eraser(client) // Verificando se há dados de usuários que se expiraram
            verifica_subscribers(client) // Verificando os usuários que possuem assinatura ativa
        }

        if (timestamp_atual % 1800 < 60) { // 30 Minutos
            if (client.x.ranking) verifica_servers() // Sincronizando o ranking global dos usuários que ganharam XP
            if (client.x.modules) atualiza_modulos()
        }

        internal_clock(client, 60000)
    }, tempo_restante)
}