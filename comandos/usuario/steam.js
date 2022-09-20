const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { existsSync } = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steam')
        .setDescription('⌠👤⌡ Someone\'s Steam Profile')
        .setDescriptionLocalizations({
            "pt-BR": '⌠👤⌡ Perfil de alguém na Steam',
            "es-ES": '⌠👤⌡ Perfil de alguien en Steam',
            "fr": '⌠👤⌡ Profil Steam de quelqu\'un'
        })
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The username')
                .setDescriptionLocalizations({
                    "pt-BR": 'O nome do usuário',
                    "es-ES": 'El nombre de usuario',
                    "fr": 'Nom de profil'
                }))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('A discord user')
                .setDescriptionLocalizations({
                    "pt-BR": 'Um usuário do discord',
                    "es-ES": 'Un usuario de discord',
                    "fr": 'Un utilisateur de discord'
                })),
    async execute(client, interaction) {

        const idioma_definido = client.idioma.getLang(interaction)
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)

        let texto_entrada = ''

        const params = {
            url: null,
            user: null
        }

        let entradas = interaction.options.data

        entradas.forEach(valor => {
            if (valor.name == "url")
                params.url = valor.value

            if (valor.name == "user")
                params.user = valor.value
        })

        if (params.url)
            texto_entrada = params.url

        alvo_id = interaction.options.getUser('user') || interaction.user.id
        const user = client.usuarios.getUser(alvo_id)

        if (!texto_entrada) { // Verificando se o usuário possui link com a steam
            if (!user.steam)
                return interaction.reply({ content: `:mag: | ${utilitarios[16]["sem_link"]}`, ephemeral: true })
            else
                texto_entrada = steam
        }

        try {
            const usuario_alvo = `https://steamcommunity.com/id/${texto_entrada}`

            fetch(usuario_alvo)
                .then(response => response.text())
                .then(async res => {

                    let status = res.split("<title>")[1]
                    status = status.split("</title>")[0]
                    status = status.replace("Steam Community :: ", "")

                    if (status === "Error") return interaction.reply(utilitarios[16]["error_1"])

                    let bandeira_user, nivel_user, status_atual, jogos_user, insignias_user, conquistas_user, conquistas_favoritas, total_conquistas_favoritas, porcentagem_conquistas, capturas_user, videos_user, artes_user, tempo_semanas
                    let jogo_favorito = "", tempo_jogado = "", nota_rodape = interaction.user.username, anos_servico = "", background_user = "", criacoes_user = ""

                    if (res.includes("<video playsinline autoplay muted loop poster=\"")) {
                        background_user = res.split("<video playsinline autoplay muted loop poster=\"")[1]
                        background_user = background_user.split("\">")[0]
                    } else if (res.includes("<div class=\"no_header profile_page has_profile_background")) {
                        background_user = res.split("<div class=\"no_header profile_page has_profile_background")[1]
                        background_user = background_user.split("' );\">")[0]
                        background_user = background_user.split("url( '")[1]
                    }

                    try {
                        bandeira_user = res.split("<img class=\"profile_flag\"")[1]
                        bandeira_user = bandeira_user.split("\">")[0]
                        bandeira_user = bandeira_user.replace(".gif", "")
                        bandeira_user = bandeira_user.slice(bandeira_user.length - 2)

                        bandeira_user = ` | :flag_${bandeira_user}:`
                    } catch (err) {
                        bandeira_user = ""
                    }

                    const nome_user = status
                    let avatar_user = res.split("<div class=\"playerAvatarAutoSizeInner\">")[1]

                    if (avatar_user.includes("<div class=\"profile_avatar_frame\">")) // Verifica se o usuário possui decoração sob o avatar
                        avatar_user = avatar_user.split("</div>")[1]

                    avatar_user = avatar_user.split("</div>")[0]
                    avatar_user = avatar_user.replace("<img src=\"", "")
                    avatar_user = avatar_user.replace("\">", "")

                    try {
                        status_atual = res.split("<div class=\"profile_in_game_header\">")[1]
                        status_atual = status_atual.split("</div>")[0]
                        status_atual = status_atual.replace("Currently ", "")

                        if (status_atual === "undefined")
                            status_atual = utilitarios[16][status_atual]
                    } catch (err) {
                        status = utilitarios[16]["undefined"]
                    }

                    try {
                        nivel_user = res.split("<span class=\"friendPlayerLevelNum\">")[1]
                        nivel_user = nivel_user.split("</span>")[0]
                    } catch (err) {
                        nivel_user = "-"
                    }

                    try {
                        jogos_user = res.split("<span class=\"count_link_label\">Games</span>&nbsp;")[1]
                        jogos_user = jogos_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0]
                        jogos_user = jogos_user.replace(",", ".").replace(/\s+/g, '')
                    } catch (err) {
                        jogos_user = "-"

                        if (res.includes("<div class=\"label\">Games Owned</div>")) {
                            jogos_user = res.split("<div class=\"label\">Games Owned</div>")[0]
                            jogos_user = jogos_user.slice(jogos_user.length - 120).split("<div class=\"value\">")[1]
                            jogos_user = jogos_user.split("</div>")[0]
                            jogos_user = jogos_user.replace(",", ".").replace(/\s+/g, '')
                        }
                    }

                    try {
                        insignias_user = res.split("<span class=\"count_link_label\">Badges</span>&nbsp;")[1]
                        insignias_user = insignias_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0]
                        insignias_user = insignias_user.replace(",", ".").replace(/\s+/g, '')
                    } catch (err) {
                        insignias_user = "-"
                    }

                    try {
                        if (res.includes("<div class=\"label\">Achievements</div>")) {
                            const blocos_conquistas = res.split("<div class=\"label\">Achievements</div>")

                            conquistas_user = blocos_conquistas[0]

                            if (blocos_conquistas.length > 2) {
                                conquistas_favoritas = conquistas_user.slice(conquistas_user.length - 120)
                                conquistas_favoritas = conquistas_favoritas.split("<div class=\"value\">")[1]
                                conquistas_favoritas = conquistas_favoritas.split("</div>")[0]

                                total_conquistas_favoritas = res.split(`&nbsp; <span class=\"ellipsis\">${conquistas_favoritas}`)[1]
                                total_conquistas_favoritas = total_conquistas_favoritas.split("</span>")[0]
                                total_conquistas_favoritas = total_conquistas_favoritas.replace("of ", "")
                            }

                            if (blocos_conquistas.length > 2)
                                conquistas_user = blocos_conquistas[1]

                            conquistas_user = conquistas_user.slice(conquistas_user.length - 120)
                            conquistas_user = conquistas_user.split("<div class=\"value\">")[1]
                            conquistas_user = conquistas_user.split("</div>")[0]
                        } else
                            conquistas_user = "-"
                    } catch (err) {
                        conquistas_user = "-"
                    }

                    try {
                        tempo_semanas = res.split("<div class=\"recentgame_quicklinks recentgame_recentplaytime\">")[1]
                        tempo_semanas = tempo_semanas.split("</h2>")[0]
                        tempo_semanas = tempo_semanas.replace("<h2>", "")

                        const descriminador_tempo_2 = tempo_semanas.split(" ")[1]
                        tempo_semanas = parseFloat(tempo_semanas.split(" ")[0])

                        if (idioma_definido === "pt-br")
                            tempo_semanas = `${tempo_semanas} ${utilitarios[16][descriminador_tempo_2]}`
                        else
                            tempo_semanas = `${tempo_semanas} ${descriminador_tempo_2}`
                    } catch (err) {
                        tempo_semanas = "-"
                    }

                    try {
                        porcentagem_conquistas = res.split("<div class=\"label\">Avg. Game Completion Rate</div>")[0]
                        porcentagem_conquistas = porcentagem_conquistas.slice(porcentagem_conquistas.length - 40)
                        porcentagem_conquistas = porcentagem_conquistas.split("<div class=\"value\">")[1]
                        porcentagem_conquistas = porcentagem_conquistas.split("</div>")[0]
                    } catch (err) {
                        porcentagem_conquistas = "-"
                    }

                    let jogos_perfeitos
                    try {
                        jogos_perfeitos = res.split("<div class=\"label\">Perfect Games</div>")[0]
                        jogos_perfeitos = jogos_perfeitos.slice(jogos_perfeitos.length - 40)
                        jogos_perfeitos = jogos_perfeitos.split("<div class=\"value\">")[1]
                        jogos_perfeitos = jogos_perfeitos.split("</div>")[0]
                        jogos_perfeitos = jogos_perfeitos.replace(",", ".").replace(/\s+/g, '')
                    } catch (err) {
                        jogos_perfeitos = "-"
                    }

                    let reviews_user
                    try {
                        reviews_user = res.split("<span class=\"count_link_label\">Reviews</span>&nbsp;")[1]
                        reviews_user = reviews_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0]
                        reviews_user = reviews_user.replace(",", ".").replace(/\s+/g, '')
                    } catch (err) {
                        reviews_user = "-"
                    }

                    try {
                        capturas_user = res.split("<span class=\"count_link_label\">Screenshots</span>&nbsp;")[1]
                        capturas_user = capturas_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0]
                        capturas_user = capturas_user.replace(",", ".").replace(/\s+/g, '')
                    } catch (err) {
                        capturas_user = "-"
                    }

                    try {
                        videos_user = res.split("<span class=\"count_link_label\">Videos</span>&nbsp;")[1]
                        videos_user = videos_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0]
                        videos_user = videos_user.replace(",", ".").replace(/\s+/g, '')
                    } catch (err) {
                        videos_user = "-"
                    }

                    try {
                        artes_user = res.split("<span class=\"count_link_label\">Artwork</span>&nbsp;")[1]
                        artes_user = artes_user.replace("<span class=\"profile_count_link_total\">", "").split("</span>")[0]
                        artes_user = artes_user.replace(",", ".").replace(/\s+/g, '')
                    } catch (err) {
                        artes_user = "-"
                    }

                    let descriminador_tempo
                    if (res.includes("<div class=\"showcase_item_detail_title\">")) {
                        const dados_jogo_fav = res.split("<div class=\"showcase_item_detail_title\">")[1]

                        jogo_favorito = dados_jogo_fav
                        jogo_favorito = jogo_favorito.split("</a>")[0]
                        jogo_favorito = jogo_favorito.split("\">")[1]
                        jogo_favorito = jogo_favorito.replaceAll(/\t/g, "")

                        jogo_favorito = jogo_favorito.replaceAll(/[\n\r]/g, "")

                        try {
                            tempo_jogado = dados_jogo_fav.split("<div class=\"showcase_stat\">")[1]
                            tempo_jogado = tempo_jogado.split("</div>")[0]
                            tempo_jogado = tempo_jogado.replace("<div class=\"value\">", "")
                        } catch (err) {
                            tempo_jogado = "-"
                        }

                        try {
                            descriminador_tempo = dados_jogo_fav.split("<div class=\"label\">")[1]
                            descriminador_tempo = descriminador_tempo.split("</div>")[0]
                            descriminador_tempo = descriminador_tempo.split(" ")[0].toLocaleLowerCase()
                        } catch (err) {
                            descriminador_tempo = "-"
                        }

                        if (conquistas_favoritas)
                            if (idioma_definido === "pt-br")
                                descriminador_tempo = utilitarios[16][descriminador_tempo]

                        tempo_jogado = tempo_jogado.replace(",", ".").replace(/\s+/g, '')
                        tempo_jogado = `${tempo_jogado} ${descriminador_tempo}`
                    }

                    if (res.includes(" data-tooltip-html=\"Years of Service&lt;br&gt;")) {

                        anos_servico = res.split(" data-tooltip-html=\"Years of Service&lt;br&gt;")[1]
                        anos_servico = anos_servico.split(".\" >")[0]
                        anos_servico = anos_servico.split("Member since ")[1]
                    }

                    if (reviews_user === "-" || jogos_perfeitos === "-" || porcentagem_conquistas === "-" || conquistas_user === "-" || insignias_user === "-" || jogos_user === "-" || status === "-" || insignias_user === "-" || tempo_semanas === "-")
                        nota_rodape = utilitarios[16]["rodape"]

                    if (parseInt(jogos_user.replace(".", "")) < jogos_perfeitos)
                        nota_rodape = utilitarios[16]["suspeito"]

                    if (typeof conquistas_favoritas == "undefined" && typeof total_conquistas_favoritas == "undefined")
                        jogo_favorito = ""

                    conquistas_user = conquistas_user.replace(",", ".").replace(/\s+/g, '')

                    if (capturas_user !== "-")
                        criacoes_user += `:frame_photo: **${utilitarios[16]["capturas"]}: **\`${capturas_user}\``
                    if (videos_user !== "-")
                        criacoes_user += `\n:film_frames: **Videos: **\`${videos_user}\``
                    if (artes_user !== "-")
                        criacoes_user += `\n:paintbrush: **${utilitarios[16]["artes"]}: **\`${artes_user}\``

                    let jogos_user_embed = `**Total: **\`${jogos_user}\``
                    if (reviews_user !== "-")
                        jogos_user_embed += `\n**${utilitarios[16]["analises"]}: **\`${reviews_user}\``

                    const usuario_steam = new EmbedBuilder()
                        .setTitle(`${nome_user.replace(/ /g, "")}${bandeira_user}`)
                        .setURL(usuario_alvo)
                        .setAuthor({ name: "Steam", iconURL: "https://th.bing.com/th/id/R.dc9023a21d267f5a69f80d73f6e89dc2?rik=3XtZuRHyuD3yhQ&riu=http%3a%2f%2ficons.iconarchive.com%2ficons%2ffroyoshark%2fenkel%2f512%2fSteam-icon.png&ehk=Q%2bLzz3YeY7Z8gPsTI2r1YF4KgfPnV%2bHMJkEoSx%2bKPy0%3d&risl=&pid=ImgRaw&r=0" })
                        .setThumbnail(avatar_user)
                        .setColor(user.color)
                        .addFields(
                            {
                                name: `:ninja: ${utilitarios[16]["nivel"]}`,
                                value: `**${utilitarios[12]["atual"]}: **\`${nivel_user}\``,
                                inline: true
                            },
                            {
                                name: `:video_game: ${utilitarios[16]["jogos"]}`,
                                value: `${jogos_user_embed}`,
                                inline: true
                            },
                            {
                                name: `:red_envelope: ${utilitarios[16]["insignias"]}`,
                                value: `**Total: **\`${insignias_user}\``,
                                inline: true
                            },
                        )
                        .addFields(
                            {
                                name: `:trophy: ${utilitarios[16]["conquistas"]}`,
                                value: `**Total: **\`${conquistas_user}\`\n**${utilitarios[16]["porcentagem"]}:** \`${porcentagem_conquistas}\`\n**${utilitarios[16]["jogos_perfeitos"]}: **\`${jogos_perfeitos}\``,
                                inline: true
                            },
                            {
                                name: ":mobile_phone_off: Status",
                                value: `\`${status_atual}\`\n:clock: **${utilitarios[16]["semanas"]}: **\n\`${tempo_semanas}\``,
                                inline: true
                            }
                        )
                        .setFooter({ text: nota_rodape, iconURL: interaction.user.avatarURL({ dynamic: true }) })


                    if (background_user.length > 0)
                        usuario_steam.setImage(background_user)

                    if (criacoes_user !== "")
                        usuario_steam.addFields(
                            {
                                name: `:piñata: ${utilitarios[16]["criacoes"]}`,
                                value: `${criacoes_user}`,
                                inline: true
                            }
                        )
                    else
                        usuario_steam.addFields(
                            { name: "⠀", value: "⠀", inline: true }
                        )

                    if (jogo_favorito !== "")
                        usuario_steam.addFields(
                            {
                                name: `:star: ${utilitarios[16]["jogo_favorito"]}`,
                                value: `**${utilitarios[16]["nome"]}: **\`${jogo_favorito}\`\n:trophy: **${utilitarios[16]["conquistas"]}: **\`${conquistas_favoritas} /${total_conquistas_favoritas}\`\n:alarm_clock: **${utilitarios[16]["tempo_jogado"]}: **\`${tempo_jogado}\``,
                                inline: false
                            }
                        )

                    if (anos_servico !== "")
                        usuario_steam.addFields(
                            {
                                name: `:birthday: ${utilitarios[13]["entrada"]}`,
                                value: `\`${anos_servico}\``,
                                inline: true
                            }
                        )

                    interaction.reply({ embeds: [usuario_steam] })
                })
        } catch (err) {
            client.channels.cache.get('862015290433994752').send(err)
            interaction.reply(`${utilitarios[16]["error_2"]}\n<${usuario_alvo}>`)
        }
    }
}