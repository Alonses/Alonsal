const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { verifyUserModules, createModule } = require('../../../core/database/schemas/Module')
const { getModulesPrice } = require('../../../core/database/schemas/Module')

const { modulePrices } = require('../../../core/formatters/patterns/user')

const { PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction }) => {

    const type = parseInt(interaction.options.getString("choice"))
    let locale_cache = false, defered = false

    if (interaction.options.getString("type")) // Falta de permissão para gerenciar mensagens
        if (interaction.options.getString("type") === "guild" && !await client.execute("permissions", { interaction, id_user: interaction.user.id, permissions: [PermissionsBitField.Flags.ManageMessages] }))
            return interaction.reply({
                content: "🛂 | Você não pode criar um módulo de servidor sem possuir a permissão para `Gerenciar mensagens`, por gentileza, crie um módulo para uso pessoal.",
                flags: "Ephemeral"
            })

    // Impedindo que o módulo de games seja configurado em escopo de servidor por fora da configuração através do panel guild
    if (type === 6 && interaction.options.getString("type") === "guild")
        return interaction.reply({
            content: "❌ | Esse tipo de módulo não pode ser ativo em servidores, para isso, utilize o comando </panel guild:1107163338930126869> e vá até a guia `🎮 Anúncio de Games`.",
            flags: "Ephemeral"
        })

    // Usuário não possui Bufunfas suficientes para poder configurar um módulo
    if (user.misc.money < 20) return client.tls.reply(interaction, user, "misc.modulo.sem_bufunfa", true, client.emoji(0))

    if (type === 0 && interaction.options.getString("place")) { // Verificando se o local informado existe

        await client.deferedReply(interaction, "Ephemeral")
        defered = true

        fetch(`${process.env.url_weather}appid=${process.env.key_weather}&q=${interaction.options.getString("place")}&units=metric&lang=pt`)
            .then(response => response.json())
            .then(async res => {

                if (res.cod === '404' || res.cod === '400')
                    return interaction.editReply({
                        content: client.tls.phrase(user, "util.tempo.aviso_2", 1, interaction.options.getString("place")),
                        flags: "Ephemeral"
                    })
                else if (res.cod === '429')// Erro da API
                    return interaction.editReply({
                        content: client.tls.phrase(alvo, "util.tempo.aviso_3", client.emoji("emojis_negativos")),
                        flags: "Ephemeral"
                    })
                else if (res.id === '1873107')
                    return interaction.editReply({
                        content: client.tls.phrase(alvo, "util.tempo.error_2", client.emoji("emojis_negativos")),
                        flags: "Ephemeral"
                    })

                // Verificando se o usuário atingiu o limite de módulos para o tipo informado
                if (await verifica_modulos_iguais(client, interaction, user, type, defered)) return

                // Gerando o card para o usuário confirmar o novo módulo
                const local_data = interaction.options.getString("place") || user.misc.locale
                gera_card_modulo(client, interaction, user, type, defered, locale_cache, local_data)
            })
    } else {

        // Prevenção de erros por falta de local padrão para o módulo de clima
        if (!user.misc.locale && !interaction.options.getString("place"))
            return client.reply(interaction, {
                content: client.tls.phrase(user, "misc.modulo.sem_locale", null, 4),
                flags: "Ephemeral"
            }, defered)

        // Verificando se o usuário atingiu o limite de módulos para o tipo informado
        if (await verifica_modulos_iguais(client, interaction, user, type, defered)) return

        // Gerando o card para o usuário confirmar o novo módulo
        gera_card_modulo(client, interaction, user, type, defered, locale_cache)
    }
}

async function verifica_modulos_iguais(client, interaction, user, type, defered) {

    // Verificando quantos módulos de um tipo existem para o usuário
    const modulos_semelhantes = await verifyUserModules(user.uid, type)
    let limite_atingido = false

    if (client.cached.subscribers.has(user.uid) && modulos_semelhantes.length > 10) { // Limite para assinantes
        client.reply(interaction, {
            content: client.tls.phrase(user, "misc.modulo.limite_modulos_subscriber", null, 4),
            flags: "Ephemeral"
        }, defered)

        limite_atingido = true
    } else if (!client.cached.subscribers.has(user.uid) && modulos_semelhantes.length > 3) { // Limite normal de módulos
        client.reply(interaction, {
            content: client.tls.phrase(user, "misc.modulo.limite_modulos", null, 4),
            flags: "Ephemeral"
        }, defered)

        limite_atingido = true
    }

    return limite_atingido
}

async function gera_card_modulo(client, interaction, user, type, defered, locale_cache, local_data) {

    // Gera o card de confirmação para ativar o módulo
    const corpo_modulo = await createModule(client, user.uid, type)

    if (modulePrices[type]) // Módulos com preços diferentes
        corpo_modulo.stats.price = modulePrices[type]

    if (type === 0 && user.misc.locale && !interaction.options.getString("place"))
        locale_cache = true

    corpo_modulo.stats.days = interaction.options.getString("when")
    corpo_modulo.stats.hour = client.execute("formata_horas", { horas: interaction.options.getInteger("hour") || '0', minutos: interaction.options.getInteger("minute") || '0' })
    corpo_modulo.stats.timestamp = client.execute("timestamp")
    corpo_modulo.misc.scope = interaction.options.getString("type") || "user"

    if (corpo_modulo.misc.scope === "guild") // Salvando o ID do servidor que o módulo pertencerá
        corpo_modulo.misc.sid = client.encrypt(interaction.guild.id)

    // Salvando local padrão do módulo 
    if (local_data) corpo_modulo.misc.locale = client.encrypt(local_data)
    else if (locale_cache) corpo_modulo.misc.locale = user.misc.locale

    await corpo_modulo.save()

    const ativacao_modulo = `${client.tls.phrase(user, `misc.modulo.ativacao_${corpo_modulo.stats.days}`)} ${corpo_modulo.stats.hour}`
    const montante = await getModulesPrice(client, user.uid)

    const embed = client.create_embed({
        title: { tls: "misc.modulo.cabecalho_menu" },
        description: { tls: "misc.modulo.descricao", replace: [client.cached.subscribers.has(user.uid) ? client.execute("locale", { valor: corpo_modulo.stats.price * client.cached.subscriber_discount }) : corpo_modulo.stats.price, montante] },
        fields: [
            {
                name: `${client.defaultEmoji("types")} **${client.tls.phrase(user, "misc.modulo.tipo")}**`,
                value: `\`${client.tls.phrase(user, `misc.modulo.modulo_${corpo_modulo.type}`)}\`${type === 0 ? `${locale_cache ? `\n🔀 Local: \`${client.decifer(user.misc.locale)}\`` : `\n🏙 Local: \`${local_data}\``}` : ""}`,
                inline: true
            },
            {
                name: `${client.defaultEmoji("time")} **${client.tls.phrase(user, "misc.modulo.ativacao")}**`,
                value: `\`${ativacao_modulo}\``,
                inline: true
            },
            {
                name: `${client.defaultEmoji("money")} **${client.tls.phrase(user, "misc.modulo.valor")}**`,
                value: `\`B$ ${client.cached.subscribers.has(user.uid) ? `${client.execute("locale", { valor: corpo_modulo.stats.price * client.cached.subscriber_discount })} (${client.execute("getSubscriberDiscount")}% OFF 🌟)` : corpo_modulo.stats.price}\``,
                inline: true
            }
        ],
        footer: {
            text: { tls: "menu.botoes.selecionar_operacao" },
            iconURL: interaction.user.avatarURL({ dynamic: true })
        }
    }, user)

    // Confirmando a criação do módulo
    const row = client.create_buttons([
        { id: "module_config", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: `1|${corpo_modulo.hash}` },
        { id: "module_config", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `0|${corpo_modulo.hash}` }
    ], interaction, user)

    client.reply(interaction, {
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    }, defered)
}