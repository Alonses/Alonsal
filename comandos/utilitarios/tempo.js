const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis_negativos, emojis } = require('../../arquivos/json/text/emojis.json')
const direcao_cardial = require("../../adm/funcoes/direcao_cardial")

const getCountryISO3 = require("country-iso-2-to-3")
const formata_horas = require('../../adm/formatadores/formata_horas')

const base_url = "http://api.openweathermap.org/data/2.5/weather?"
const time_url = "http://api.timezonedb.com/v2.1/get-time-zone?"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setNameLocalizations({
            "pt-BR": 'tempo',
            "es-ES": 'tiempo',
            "fr": 'climat',
            "it": 'clima',
            "ru": 'погода'
        })
        .setDescription("⌠💡⌡ Show current weather somewhere")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💡⌡ Mostra o clima atual em algum local',
            "es-ES": '⌠💡⌡ Muestra el clima actual en algún lugar',
            "fr": '⌠💡⌡ Afficher la météo actuelle quelque part',
            "it": '⌠💡⌡ Mostra il tempo attuale da qualche parte',
            "ru": '⌠💡⌡ Посмотреть текущую погоду где-нибудь'
        })
        .addStringOption(option =>
            option.setName("place")
                .setNameLocalizations({
                    "pt-BR": 'local',
                    "es-ES": 'lugar',
                    "fr": 'place',
                    "it": 'posto',
                    "ru": 'место'
                })
                .setDescription("Enter a location")
                .setDescriptionLocalizations({
                    "pt-BR": 'Insira um local',
                    "es-ES": 'Ingrese una ubicación',
                    "fr": 'Informer un endroit',
                    "it": 'Inserisci una posizione',
                    "ru": 'введите местоположение'
                })),
    async execute(client, user, interaction) {

        let idioma_definido = client.idioma.getLang(interaction), pesquisa = ''

        if (idioma_definido === "al-br") idioma_definido = "pt-br"
        const translations = require(`i18n-country-code/locales/${idioma_definido.slice(0, 2)}.json`)

        // Verifica se não há entrada customizada e se o usuário não possui um local padrão
        if (interaction.options.data.length < 1 && !user.misc.locale)
            return client.tls.reply(interaction, user, "util.tempo.error_locale", true, 2)

        // Usa o local padrão caso não tenha entrada definida
        if (interaction.options.data.length < 1)
            pesquisa = user.misc.locale
        else // Usa a entrada customizada
            pesquisa = interaction.options.data[0].value

        const pesquisa_bruta = `\"${pesquisa.replaceAll("\"", "")}"`

        let url_completa = `${base_url}appid=${process.env.weather_key}&q=${pesquisa}&units=metric&lang=pt`

        if (idioma_definido === "en-us")
            url_completa = url_completa.replace("&lang=pt", "")

        if (idioma_definido === "fr-fr")
            url_completa = url_completa.replace("&lang=pt", "&lang=fr")

        fetch(url_completa)
            .then(response => response.json())
            .then(async res => {

                if (res.cod === '404' || res.cod === '400')
                    return interaction.reply({ content: `${client.emoji(emojis_negativos)} | ${client.tls.phrase(user, "util.tempo.aviso_2")} \`${pesquisa}\`, ${client.tls.phrase(user, "util.minecraft.tente_novamente")}\n${client.tls.phrase(user, "util.tempo.sugestao")} \`/${interaction.commandName} ${pesquisa_bruta}\``, ephemeral: true })
                else if (res.cod === '429') // Erro da API
                    return interaction.reply({ content: `${client.emoji(emojis_negativos)} | ${client.tls.phrase(user, "util.tempo.aviso_3")}`, ephemeral: true })
                else if (res.id === 1873107)
                    return interaction.reply({ content: `${client.emoji(emojis_negativos)} | ${client.tls.phrase(user, "util.tempo.error_2")}`, ephemeral: true })
                else {
                    const url_hora = `${time_url}key=${process.env.time_key}&format=json&by=position&lat=${res.coord.lat}&lng=${res.coord.lon}`

                    fetch(url_hora) // Buscando o horário local
                        .then(response => response.json())
                        .then(async res_hora => {

                            let dados_att = new Date((res.dt + res.timezone) * 1000)
                            dados_att = `${("0" + dados_att.getHours()).substr(-2)}:${("0" + dados_att.getMinutes()).substr(-2)} (*)`

                            let bandeira_pais = "", nome_pais = "", horario_local
                            let nota_rodape = `${client.tls.phrase(user, "util.tempo.dados_atts")} ${dados_att}`

                            const indicaTemp = require('../../adm/funcoes/indica_temperatura.js')
                            const estacao_atual = require('../../adm/funcoes/estacao_atual.js')

                            if (typeof res.sys.country !== "undefined") {
                                bandeira_pais = `:flag_${(res.sys.country).toLowerCase()}:`

                                const cod_pais = getCountryISO3(res.sys.country)
                                nome_pais = ` - ${translations[cod_pais]}`

                                if (res.sys.country === "AQ")
                                    nome_pais = ` - ${client.tls.phrase(user, "util.tempo.antartida")}`

                                if (nome_pais.includes(res.name)) {
                                    nome_pais = ""
                                    nota_rodape += ` | ${client.tls.phrase(user, "util.tempo.aviso_pais")}`
                                }

                                horario_local = res_hora.formatted
                                horario_local = new Date(horario_local)
                            } else {
                                horario_local = new Date(res.dt * 1000)

                                if (res.name !== "Globe" && (res.coord.lon !== 0 && res.coord.lat !== 0))
                                    nota_rodape += ` | ${client.tls.phrase(user, "util.tempo.aviso_continente")}`
                                else if (res.coord.lon === 0 && res.coord.lat === 0)
                                    nota_rodape += ` | ${client.tls.phrase(user, "util.tempo.aviso_planeta")}`
                            }

                            // 10800 (timezone brasilia)
                            let nascer_sol = new Date((res.sys.sunrise + res.timezone + 10800) * 1000)
                            let por_sol = new Date((res.sys.sunset + res.timezone + 10800) * 1000)

                            nascer_sol = formata_horas(nascer_sol.getHours(), nascer_sol.getMinutes())
                            por_sol = formata_horas(por_sol.getHours(), por_sol.getMinutes())

                            let tempo_atual = res.weather[0].description // Clima atual
                            tempo_atual = tempo_atual.charAt(0).toUpperCase() + tempo_atual.slice(1)

                            const minutos = formata_horas(horario_local.getMinutes()) // Preservar o digito 0
                            const hora = formata_horas(horario_local.getHours()) // Preservar o digito 0
                            const dia = horario_local.getDate()

                            let mes = horario_local.toLocaleString(idioma_definido.slice(0, 2), { month: 'long' })
                            let hours = horario_local.getHours()

                            hours %= 12
                            hours = hours ? hours : 12

                            if (minutos >= 30)
                                hours += "30"

                            let emoji_ceu_atual = ":park:"

                            // Umidade
                            let emoji_umidade = ":sweat_drops:", emoji_indica_humidade = "", emoji_indica_visibilidade = ""

                            if (res.main.humidity < 60)
                                emoji_umidade = ":droplet:"

                            if (res.main.humidity < 30)
                                emoji_umidade = ":cactus:"

                            // Nuvens
                            let emoji_nuvens = ":cloud:"

                            if (res.clouds.all < 60)
                                emoji_nuvens = ":white_sun_cloud:"

                            if (res.clouds.all < 41)
                                emoji_nuvens = ":white_sun_small_cloud:"

                            if (res.clouds.all < 31) {
                                emoji_nuvens = ":sunny:"

                                if (hora > 17 || hora < 7) // Noite
                                    emoji_nuvens = ":full_moon_with_face:"
                            }

                            if (hora > 17 || hora < 7)
                                emoji_ceu_atual = ":milky_way:"

                            // Sensação térmica dinâmica
                            let emoji_sensacao_termica = ":hot_face:"

                            if (res.main.feels_like >= 13 && res.main.feels_like <= 30)
                                emoji_sensacao_termica = ":ok_hand:"

                            if (res.main.feels_like < 13)
                                emoji_sensacao_termica = ":cold_face:"

                            if (res.main.feels_like < 0)
                                emoji_sensacao_termica = ":snowman2:"

                            if (res.main.feels_like >= 35)
                                emoji_sensacao_termica = ":fire:"

                            horario_local = `:clock${hours}: **${client.tls.phrase(user, "util.tempo.hora_local")}:** \`${hora}:${minutos} | ${dia} ${client.tls.phrase(user, "util.tempo.de")} ${mes}\``

                            let nome_local = `${client.tls.phrase(user, "util.tempo.na")} ${res.name}`, rodape_cabecalho = ""
                            let cabecalho_fix = estacao_atual(res.coord.lat, client, user)

                            if (typeof res.sys.country != "undefined")
                                if (idioma_definido === "pt-br")
                                    nome_local = nome_local.replace("na", "em")

                            if (res.name === "Globe")
                                nome_local = `${client.tls.phrase(user, "util.tempo.terra")} :earth_americas:`

                            if (typeof res.rain !== "undefined") {
                                cabecalho_fix += "\n------------------------------"

                                cabecalho_fix += `\n${client.tls.phrase(user, "util.tempo.chovendo")}\n${client.tls.phrase(user, "util.tempo.chuva")} 1H: ${res.rain["1h"]}mm`

                                if (typeof res.rain["3h"] != "undefined")
                                    cabecalho_fix += `\n${client.tls.phrase(user, "util.tempo.chuva")} 3H: ${res.rain["3h"]}mm`

                                emoji_indica_humidade = " 🔼", emoji_indica_visibilidade = " 🔽"
                                rodape_cabecalho = `${client.emoji(emojis.trollface)} _${client.tls.phrase(user, "util.tempo.chuva_troll")}_`
                            }

                            if (typeof res.snow !== "undefined") {
                                cabecalho_fix = `${client.tls.phrase(user, "util.tempo.nevando")}\n${client.tls.phrase(user, "util.tempo.neve")} 1H: ${res.rain["1h"]}mm`

                                if (typeof res.rain["3h"] != "undefined")
                                    cabecalho_fix += `\n${client.tls.phrase(user, "util.tempo.neve")} 3H: ${res.rain["3h"]}mm`

                                emoji_indica_visibilidade = " 🔽"

                                rodape_cabecalho = `${client.emoji(emojis.trollface)} _${client.tls.phrase(user, "util.tempo.neve_troll")}_`
                            }

                            if (typeof res.wind.gust !== "undefined") {
                                if (cabecalho_fix !== "")
                                    cabecalho_fix += "\n------------------------------"

                                cabecalho_fix += `\n${client.tls.phrase(user, "util.tempo.rajadas_vento")}\n${client.tls.phrase(user, "util.tempo.velocidade")}: ${res.wind.gust} km/h`
                            }

                            if (cabecalho_fix !== "")
                                cabecalho_fix = `\`\`\`fix\n${cabecalho_fix}\`\`\``

                            let pressao_local = `**${client.tls.phrase(user, "util.server.atual")}: **\`${res.main.pressure} kPA\``

                            if (typeof res.main.grnd_level !== "undefined")
                                pressao_local = `:camping: **${client.tls.phrase(user, "util.tempo.nivel_chao")}: ** \`${res.main.grnd_level} kPA\`\n:island: **${client.tls.phrase(user, "util.tempo.nivel_mar")}: ** \`${res.main.sea_level} kPA\``

                            let emoji_indica_temp = indicaTemp(res.sys.sunrise + res.timezone, res.sys.sunset + res.timezone, res.dt + res.timezone, res.main.temp_max, res.main.temp_min, res.main.temp, rodape_cabecalho)

                            if (res.coord.lat > -20 && res.coord.lat < 20)
                                rodape_cabecalho = `:ringed_planet: ${client.tls.phrase(user, "util.tempo.equador")}\n${rodape_cabecalho}`

                            const clima_atual = new EmbedBuilder()
                                .setTitle(`:boom: ${client.tls.phrase(user, "util.tempo.tempo_agora")} ${nome_local}${nome_pais} ${bandeira_pais}`)
                                .setColor(client.embed_color(user.misc.color))
                                .setDescription(`${horario_local} | **${tempo_atual}**${cabecalho_fix}${rodape_cabecalho}`)
                                .setThumbnail(`http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`)
                                .addFields(
                                    {
                                        name: `:thermometer: **${client.tls.phrase(user, "util.tempo.temperatura")}**`,
                                        value: `${emoji_indica_temp} **${client.tls.phrase(user, "util.server.atual")}**: \`${res.main.temp}°C\`\n:small_red_triangle: **Max:** \`${res.main.temp_max}°C\`\n:small_red_triangle_down: **Min:** \`${res.main.temp_min}°C\``,
                                        inline: true
                                    },
                                    {
                                        name: `${emoji_ceu_atual} **${client.tls.phrase(user, "util.tempo.ceu_momento")}**`,
                                        value: `${emoji_nuvens} **${client.tls.phrase(user, "util.tempo.nuvens")}: **\`${res.clouds.all}%\`\n:sunrise: **${client.tls.phrase(user, "util.tempo.nas_sol")}: **\`${nascer_sol}\`\n:city_sunset: **${client.tls.phrase(user, "util.tempo.por_sol")}: **\`${por_sol}\``,
                                        inline: true
                                    },
                                    {
                                        name: `:wind_chime: **${client.tls.phrase(user, "util.tempo.vento")}**`,
                                        value: `:airplane: **Vel.: **\`${res.wind.speed} km/h\`\n:compass: **${client.tls.phrase(user, "util.tempo.direcao")}: ** \`${direcao_cardial(res.wind.deg, idioma_definido)}\`\n:eye: **${client.tls.phrase(user, "util.tempo.visibilidade")}: ** \`${res.visibility / 100}%${emoji_indica_visibilidade}\``,
                                        inline: true
                                    }
                                )
                                .addFields(
                                    {
                                        name: `${emoji_sensacao_termica} **${client.tls.phrase(user, "util.tempo.sensacao_termica")}.**`,
                                        value: `**${client.tls.phrase(user, "util.server.atual")}: **\`${res.main.feels_like}°C\``,
                                        inline: true
                                    },
                                    {
                                        name: `${emoji_umidade} **${client.tls.phrase(user, "util.tempo.umidade_ar")}**`,
                                        value: `**${client.tls.phrase(user, "util.server.atual")}: **\`${res.main.humidity}%${emoji_indica_humidade}\``,
                                        inline: true
                                    },
                                    {
                                        name: `:compression: **${client.tls.phrase(user, "util.tempo.pressao_ar")}**`,
                                        value: `${pressao_local}`,
                                        inline: true
                                    }
                                )
                                .setFooter({ text: nota_rodape })

                            return interaction.reply({ embeds: [clima_atual], ephemeral: user?.conf.ghost_mode || false })
                        })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}