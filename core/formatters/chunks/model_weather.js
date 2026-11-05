const getCountryISO3 = require("country-iso-2-to-3")

const indicaTemp = require('../../functions/temperature')
const estacao_atual = require('../../functions/current_season')
const cardinal_direction = require('../../functions/cardinal_direction')

const CACHE_TTL = 10 * 60 * 1000 // Clima muda devagar, locais repetidos reaproveitam a resposta
const CACHE_LIMIT = 200
const REQUEST_TIMEOUT = 8000

const weather_cache = new Map()

const pad = numero => String(numero).padStart(2, "0")
const formatTime = data => `${pad(data.getUTCHours())}:${pad(data.getUTCMinutes())}`
const toKmh = metros_segundo => Math.round(metros_segundo * 3.6 * 10) / 10 // A API retorna m/s

/**
 * Busca o clima de um local, reaproveitando respostas recentes
 * @returns {Promise<object>} Resposta da API ( `cod` indica o status )
 */
async function fetchWeather(query, lang) {

    const key = `${lang}|${query.toLowerCase()}`
    const cached = weather_cache.get(key)

    if (cached && cached.expires > Date.now()) return cached.data

    const params = new URLSearchParams({
        appid: process.env.key_weather,
        q: query,
        units: "metric",
        lang: lang
    })

    const response = await fetch(`${process.env.url_weather}${params}`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT) })
    const data = await response.json()

    if (Number(data.cod) === 200) {
        if (weather_cache.size >= CACHE_LIMIT) weather_cache.delete(weather_cache.keys().next().value)
        weather_cache.set(key, { data, expires: Date.now() + CACHE_TTL })
    }

    return data
}

const loadTranslations = lang => {
    try {
        return require(`i18n-country-code/locales/${lang}.json`)
    } catch {
        return require("i18n-country-code/locales/en.json")
    }
}

module.exports = async ({ client, alvo, interaction, user_command, internal_module }) => {

    const lang_min = alvo.lang.slice(0, 2) === "ru" ? "en" : alvo.lang.slice(0, 2)

    // Responde na interação ou envia pelo módulo, conforme a origem da chamada
    const responde = content => interaction
        ? interaction.editReply({ content, flags: "Ephemeral" })
        : client.execute("sendModule", { alvo, dados: { content }, internal_module })

    let pesquisa, pesquisa_bruta

    if (interaction) {
        // Verifica se não há entrada customizada e se o usuário não possui um local padrão
        if (interaction.options.data.length < 1 && !alvo?.misc.locale)
            return client.tls.editReply(interaction, alvo, "util.tempo.error_locale", true, 2)

        // Usa o local padrão caso não tenha entrada definida
        pesquisa = interaction.options.getString("place") || client.decifer(alvo.misc.locale)
    } else
        pesquisa = client.decifer(internal_module.misc.locale)

    if (!pesquisa) return responde(client.tls.phrase(alvo, "util.tempo.aviso_3", client.emoji("emojis_negativos")))

    pesquisa_bruta = `"${pesquisa.replaceAll("\"", "")}"`

    let res

    try {
        res = await fetchWeather(pesquisa, lang_min)
    } catch {
        return responde(client.tls.phrase(alvo, "util.tempo.aviso_3", client.emoji("emojis_negativos")))
    }

    const cod = Number(res.cod)

    if (cod === 404 || cod === 400) {
        let content = client.tls.phrase(alvo, "util.tempo.aviso_2", client.emoji("emojis_negativos"), pesquisa)

        if (interaction)
            content += `\n${client.tls.phrase(alvo, "util.tempo.sugestao")} \`/${interaction.commandName} ${pesquisa_bruta}\``

        return responde(content)
    }

    if (Number(res.id) === 1873107)
        return responde(client.tls.phrase(alvo, "util.tempo.error_2", client.emoji("emojis_negativos")))

    // Limite de requisições, chave inválida ou qualquer outra falha da API
    if (cod !== 200 || !res.main || !res.coord)
        return responde(client.tls.phrase(alvo, "util.tempo.aviso_3", client.emoji("emojis_negativos")))

    const translations = loadTranslations(lang_min)

    // Verifica se o usuário quer o modo resumido ou detalhado
    const modo_resumido = internal_module ? internal_module.misc.resumed : !alvo.misc.weather

    // Horário local do lugar, calculado pelo fuso retornado pela API
    const horario_local = new Date((Math.floor(Date.now() / 1000) + (res.timezone || 0)) * 1000)
    const hora = horario_local.getUTCHours()
    const minutos = horario_local.getUTCMinutes()
    const noite = hora > 17 || hora < 7

    const dados_att = new Date(res.dt * 1000).toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" })
    let nota_rodape = `${client.tls.phrase(alvo, "util.tempo.dados_atts")} ${dados_att} (*)`

    let bandeira_pais = "", nome_pais = ""
    let nome_local = `${client.tls.phrase(alvo, "util.tempo.na")} ${res.name}`

    if (res.sys?.country) {
        bandeira_pais = `:flag_${res.sys.country.toLowerCase()}:`

        const traducao = translations[getCountryISO3(res.sys.country)]
        nome_pais = traducao ? ` - ${traducao}` : ""

        if (res.sys.country === "AQ")
            nome_pais = ` - ${client.tls.phrase(alvo, "util.tempo.antartida")}`

        if (nome_pais.includes(res.name)) {
            nome_pais = ""
            nota_rodape += ` | ${client.tls.phrase(alvo, "util.tempo.aviso_pais")}`
        }

        if (lang_min === "pt")
            nome_local = nome_local.replace(/^na /, "em ")
    } else {
        if (res.name !== "Globe" && (res.coord.lon !== 0 && res.coord.lat !== 0))
            nota_rodape += ` | ${client.tls.phrase(alvo, "util.tempo.aviso_continente")}`
        else if (res.coord.lon === 0 && res.coord.lat === 0)
            nota_rodape += ` | ${client.tls.phrase(alvo, "util.tempo.aviso_planeta")}`
    }

    if (res.name === "Globe")
        nome_local = `${client.tls.phrase(alvo, "util.tempo.terra")} ${client.defaultEmoji("earth")}`

    const mes = horario_local.toLocaleString(lang_min, { month: "long", timeZone: "UTC" })
    const relogio = `${(hora % 12) || 12}${minutos >= 30 ? "30" : ""}`

    const horario_texto = `:clock${relogio}: **${client.tls.phrase(alvo, "util.tempo.hora_local")}:** \`${pad(hora)}:${pad(minutos)} | ${horario_local.getUTCDate()} ${client.tls.phrase(alvo, "util.tempo.de")} ${mes}\``

    const nascer_sol = res.sys?.sunrise ? formatTime(new Date((res.sys.sunrise + res.timezone) * 1000)) : "--:--"
    const por_sol = res.sys?.sunset ? formatTime(new Date((res.sys.sunset + res.timezone) * 1000)) : "--:--"

    const clima = res.weather?.[0]
    const tempo_atual = clima?.description ? clima.description.charAt(0).toUpperCase() + clima.description.slice(1) : ""

    // Emojis dinâmicos de acordo com as condições
    const umidade = res.main.humidity
    const nuvens = res.clouds?.all ?? 0
    const sensacao = res.main.feels_like

    const emoji_umidade = umidade < 30 ? ":cactus:" : umidade < 60 ? ":droplet:" : ":sweat_drops:"
    const emoji_ceu_atual = noite ? ":milky_way:" : ":park:"

    let emoji_nuvens = ":cloud:"
    if (nuvens < 31) emoji_nuvens = noite ? ":full_moon_with_face:" : ":sunny:"
    else if (nuvens < 41) emoji_nuvens = ":white_sun_small_cloud:"
    else if (nuvens < 60) emoji_nuvens = ":white_sun_cloud:"

    let emoji_sensacao_termica = ":hot_face:"
    if (sensacao >= 35) emoji_sensacao_termica = ":fire:"
    else if (sensacao < 0) emoji_sensacao_termica = ":snowman2:"
    else if (sensacao < 15) emoji_sensacao_termica = ":cold_face:"
    else if (sensacao <= 28) emoji_sensacao_termica = ":ok_hand:"

    let emoji_indica_humidade = "", emoji_indica_visibilidade = ""
    let cabecalho_fix = estacao_atual(res.coord.lat, client, alvo)
    let rodape_cabecalho = ""

    // Dados para chuva
    if (res.rain) {
        cabecalho_fix += `\n------------------------------\n${client.tls.phrase(alvo, "util.tempo.chovendo")}`

        if (res.rain["1h"] !== undefined)
            cabecalho_fix += `\n${client.tls.phrase(alvo, "util.tempo.chuva")} 1H: ${res.rain["1h"]}mm`

        if (res.rain["3h"]) // Dados de chuva para 3 horas
            cabecalho_fix += `\n${client.tls.phrase(alvo, "util.tempo.chuva")} 3H: ${res.rain["3h"]}mm`

        emoji_indica_humidade = " 🔼"
        emoji_indica_visibilidade = " 🔽"
        rodape_cabecalho = `${client.emoji("trollface")} _${client.tls.phrase(alvo, "util.tempo.chuva_troll")}_`
    }

    // Dados para neve
    if (res.snow) {
        cabecalho_fix = client.tls.phrase(alvo, "util.tempo.nevando")

        if (res.snow["1h"] !== undefined)
            cabecalho_fix += `\n${client.tls.phrase(alvo, "util.tempo.neve")} 1H: ${res.snow["1h"]}mm`

        if (res.snow["3h"]) // Dados de nevasca para 3 horas
            cabecalho_fix += `\n${client.tls.phrase(alvo, "util.tempo.neve")} 3H: ${res.snow["3h"]}mm`

        emoji_indica_visibilidade = " 🔽"
        rodape_cabecalho = `${client.emoji("trollface")} _${client.tls.phrase(alvo, "util.tempo.neve_troll")}_`
    }

    // Dados para rajadas de vento
    if (res.wind?.gust && !modo_resumido) {
        if (cabecalho_fix !== "")
            cabecalho_fix += "\n------------------------------"

        cabecalho_fix += `\n${client.tls.phrase(alvo, "util.tempo.rajadas_vento")}\n${client.tls.phrase(alvo, "util.tempo.velocidade")}: ${toKmh(res.wind.gust)} km/h`
    }

    if (cabecalho_fix !== "")
        cabecalho_fix = `\`\`\`fix\n${cabecalho_fix}\`\`\``

    const emoji_indica_temp = indicaTemp((res.sys?.sunrise || 0) + res.timezone, (res.sys?.sunset || 0) + res.timezone, res.dt + res.timezone, res.main.temp_max, res.main.temp_min, res.main.temp, rodape_cabecalho)

    if (res.coord.lat > -20 && res.coord.lat < 20)
        rodape_cabecalho = `:ringed_planet: ${client.tls.phrase(alvo, "util.tempo.equador")}\n${rodape_cabecalho}`

    const atual = client.tls.phrase(alvo, "util.server.atual")
    const vento = res.wind?.speed ?? 0

    const embed_clima = client.create_embed({
        title: `:boom: ${client.tls.phrase(alvo, "util.tempo.tempo_agora")} ${nome_local}${nome_pais} ${bandeira_pais}`,
        footer: { text: nota_rodape }
    }, alvo)

    if (clima?.icon)
        embed_clima.setThumbnail(`https://openweathermap.org/img/wn/${clima.icon}@2x.png`)

    embed_clima.setDescription(`${horario_texto} | **${tempo_atual}**${cabecalho_fix}${rodape_cabecalho}`)

    const campo_sensacao = {
        name: `${emoji_sensacao_termica} **${client.tls.phrase(alvo, "util.tempo.sensacao_termica")}.**`,
        value: `**${atual}: **\`${sensacao}°C\``,
        inline: true
    }

    const campo_umidade = {
        name: `${emoji_umidade} **${client.tls.phrase(alvo, "util.tempo.umidade_ar")}**`,
        value: `**${atual}: **\`${umidade}%${emoji_indica_humidade}\``,
        inline: true
    }

    if (!modo_resumido) { // Máximo de informações para o clima

        const visibilidade = res.visibility !== undefined ? `${res.visibility / 100}%${emoji_indica_visibilidade}` : "?"

        let pressao_local = `**${atual}: **\`${res.main.pressure} hPa\``

        // Dados de pressão atmosférica
        if (res.main.grnd_level && res.main.sea_level)
            pressao_local = `:camping: **${client.tls.phrase(alvo, "util.tempo.nivel_chao")}: ** \`${res.main.grnd_level} hPa\`\n:island: **${client.tls.phrase(alvo, "util.tempo.nivel_mar")}: ** \`${res.main.sea_level} hPa\``

        embed_clima.addFields(
            {
                name: `:thermometer: **${client.tls.phrase(alvo, "util.tempo.temperatura")}**`,
                value: `${emoji_indica_temp} **${atual}**: \`${res.main.temp}°C\`\n:small_red_triangle: **Max:** \`${res.main.temp_max}°C\`\n:small_red_triangle_down: **Min:** \`${res.main.temp_min}°C\``,
                inline: true
            },
            {
                name: `${emoji_ceu_atual} **${client.tls.phrase(alvo, "util.tempo.ceu_momento")}**`,
                value: `${emoji_nuvens} **${client.tls.phrase(alvo, "util.tempo.nuvens")}: **\`${nuvens}%\`\n:sunrise: **${client.tls.phrase(alvo, "util.tempo.nas_sol")}: **\`${nascer_sol}\`\n:city_sunset: **${client.tls.phrase(alvo, "util.tempo.por_sol")}: **\`${por_sol}\``,
                inline: true
            },
            {
                name: `:wind_chime: **${client.tls.phrase(alvo, "util.tempo.vento")}**`,
                value: `:airplane: **Vel.: **\`${toKmh(vento)} km/h\`\n:compass: **${client.tls.phrase(alvo, "util.tempo.direcao")}: ** \`${cardinal_direction(res.wind?.deg)}\`\n:eye: **${client.tls.phrase(alvo, "util.tempo.visibilidade")}: ** \`${visibilidade}\``,
                inline: true
            },
            campo_sensacao,
            campo_umidade,
            {
                name: `:compression: **${client.tls.phrase(alvo, "util.tempo.pressao_ar")}**`,
                value: pressao_local,
                inline: true
            }
        )
    } else { // Mínimo de informações para o clima
        embed_clima.addFields(
            {
                name: `:thermometer: **${client.tls.phrase(alvo, "util.tempo.temperatura")}**`,
                value: `${emoji_indica_temp} **${atual}**: \`${res.main.temp}°C\``,
                inline: true
            },
            {
                name: `:small_red_triangle: **Max: ${res.main.temp_max}°C**`,
                value: `:small_red_triangle_down: **Min: ${res.main.temp_min}°C**`,
                inline: true
            },
            {
                name: `:wind_chime: **${client.tls.phrase(alvo, "util.tempo.vento")}: ${toKmh(vento)} km/h**`,
                value: "⠀",
                inline: true
            },
            campo_sensacao,
            campo_umidade,
            {
                name: `${emoji_ceu_atual} **${client.tls.phrase(alvo, "util.tempo.ceu_momento")}**`,
                value: `${emoji_nuvens} **${client.tls.phrase(alvo, "util.tempo.nuvens")}: **\`${nuvens}%\``,
                inline: true
            }
        )
    }

    if (interaction)
        return client.reply(interaction, {
            embeds: [embed_clima],
            flags: client.decider(alvo?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null
        }, true)

    return client.execute("sendModule", { alvo, dados: { embeds: [embed_clima] }, internal_module })
}
