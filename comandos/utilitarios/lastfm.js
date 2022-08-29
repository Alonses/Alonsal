const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const formata_texto = require('../../adm/funcoes/formata_texto')

let horas_tocadas, horas_passadas

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lastfm')
		.setDescription('⌠💡⌡ Perfil de alguém no LastFM')
        .addStringOption(option =>
            option.setName('usuario')
                .setDescription('O nome do usuário')
                .setRequired(true)),
	async execute(client, interaction) {
        
        const { utilitarios } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        
        const texto_entrada = interaction.options.data[0].value

        interaction.deferReply()

        try{
            const usuario_alvo = `https://last.fm/pt/user/${texto_entrada}`
            const usuario_semanal = `https://www.last.fm/pt/user/${texto_entrada}/listening-report/week`

            fetch(usuario_alvo)
            .then(response => response.text())
            .then(async res => {
                
                let descricao = "", criacao_conta, avatar, nome, obsessao = "", musica_obsessao, artista_obsessao, media_scrobbles = 0, musicas_ouvidas, artistas_ouvidos, faixas_preferidas = 0, scrobble_atual = ""
                
                if (res.includes("Página não encontrada"))
                    return interaction.editReply(utilitarios[20]["error_1"])

                if (!res.includes("ainda não ouviu nenhuma música.")){
                    if (res.includes("<div class=\"about-me-header\">")){
                        descricao = `_- "${(res.split("<div class=\"about-me-header\">")[1].split("</p>")[0].replace("<p>", "").replace(/\n/g, "")).trim()}"_`
                    }

                    if (res.includes("<span class=\"header-scrobble-since\">"))
                        criacao_conta = res.split("<span class=\"header-scrobble-since\">")[1].split("</span>")[0].replace("• em scrobble desde ", "")
                    
                    avatar = `https://lastfm.freetls.fastly.net/i/u/avatar170s/${res.split("alt=\"Avatar de ")[0].split("https://lastfm.freetls.fastly.net/i/u/avatar170s/")[1].replace("\"", "")}`
                    nome = res.split("Perfil musical de ")[1].split(" | Last.fm</title>")[0]

                    if (res.includes("data-analytics-action=\"ObsessionTrackName\"")){
                        obsessao = res.split("data-analytics-action=\"ObsessionTrackName\"")[1]

                        musica_obsessao = formata_texto(obsessao.split("</a>")[0].split(">")[1])
                        artista_obsessao = formata_texto(obsessao.split("data-analytics-action=\"ObsessionArtistName\"")[1].split("</a>")[0].split(">")[1])
                        
                        obsessao = `💿 ${utilitarios[20]["obsessao"]}\n${musica_obsessao} - ${artista_obsessao}\n-----------------------\n`
                    }

                    if (res.includes("modal?action=scrobbling-now-theirs\"")){
                        scrobble_atual = `${formata_texto(res.split("modal?action=scrobbling-now-theirs\"")[0].split("data-toggle-button-current-state=")[2].split("title=\"")[1].split("\"")[0])} - ${formata_texto(res.split("modal?action=scrobbling-now-theirs\"")[0].split("data-toggle-button-current-state=")[2].split("title=\"")[2].split("\"")[0])}`
                        
                        musica_curtida = res.split("modal?action=scrobbling-now-theirs\"")[0].split("data-toggle-button-current-state=\"")[1].split("\"")[0] == "unloved" ? "🖤 " : "💙 "

                        obsessao += `🎶 ${utilitarios[20]["em_scrobble"]}: \n${musica_curtida}${scrobble_atual}`
                    }

                    if (obsessao !== "")
                        obsessao = `\`\`\`fix\n${obsessao}\`\`\``
                    
                    if (res.includes("Média de "))
                        media_scrobbles = res.split("Média de ")[1].split(" scrobble")[0]
                    
                    musicas_ouvidas = res.split("<h4 class=\"header-metadata-title\">Scrobbles</h4>")[1].split("</a></p>")[0].split("/library\"")[1].split(">")[1].replace(/ /g, "")
                    artistas_ouvidos = res.split("/library/artists\"")[1].split("</a>")[0].replace(">", "").replace(/ /g, "").replace(/\n/g, "")

                    if (res.includes("<h4 class=\"header-metadata-title\">Faixas preferidas</h4>"))
                        faixas_preferidas = res.split("<h4 class=\"header-metadata-title\">Faixas preferidas</h4>")[1].split("</a></p>")[0].split("/loved\"")[1].replace(">", "").replace(/ /g, "").replace(/\n/g, "")
                    
                    // Buscando histórico semanal do usuário
                    fetch(usuario_semanal)
                    .then(response => response.text())
                    .then(async semanal => {

                        let scrobbles_semanal = 0, media_semanal = 0, tempo_reproducao = 0, artistas_semanal = 0, albuns_semanal = 0

                        let scrobbles_semana_passada = 0, media_semana_passada = 0, tempo_reproducao_passada = 0, artistas_semana_passada = 0, albuns_semana_passada = 0

                        let indicador_scrobbles = "⏺️", indicador_media = "⏺️", indicador_tempo = "⏺️", indicador_artista = "⏺️", indicador_album = "⏺️"
                        
                        if (!semanal.includes("não ouviu nenhuma música :(")){
                            // Scrobbles p/ dia
                            if (semanal.includes("<h4 class=\"header-metadata-title\">TOTAL DE SCROBBLES</h4>")){

                                scrobbles_semanal = semanal.split("<h4 class=\"header-metadata-title\">TOTAL DE SCROBBLES</h4>")[1].split(" scrobbles")[0].split(">")[2].trim()

                                scrobbles_semana_passada = semanal.split("class=\"listening-report-highlight-comparison\">")[1].split(" (semana passada)")[0].split("vs. ")[1].trim()

                                indicador_scrobbles = regula_porcentagem(scrobbles_semanal, scrobbles_semana_passada, 0, utilitarios)
                            }

                            // Média de Scrobbles p/ dia
                            if (semanal.includes("<h4 class=\"header-metadata-title\">MÉDIA DIÁRIA DE SCROBBLES</h4>")){

                                media_semanal = semanal.split("<h4 class=\"header-metadata-title\">MÉDIA DIÁRIA DE SCROBBLES</h4>")[1].split(" scrobbles")[0].split(">")[1].trim()

                                media_semana_passada = semanal.split("class=\"listening-report-highlight-comparison\">")[2].split(" (semana passada)")[0].split("vs. ")[1]

                                indicador_media = regula_porcentagem(media_semanal, media_semana_passada, 0, utilitarios)
                            }

                            // Tempo de reprodução
                            if (semanal.includes("<h4 class=\"header-metadata-title\">TEMPO DE REPRODUÇÃO</h4>")){

                                tempo_reproducao = semanal.split("<h4 class=\"header-metadata-title\">TEMPO DE REPRODUÇÃO</h4>")[1].split("</div>")[0].split(">")[1].trim()

                                tempo_reproducao_passada = semanal.split("class=\"listening-report-highlight-comparison\">")[3].split(" (semana passada)")[0].split("vs. ")[1].trim()
                                
                                indicador_tempo = regula_porcentagem(tempo_reproducao, tempo_reproducao_passada, 1, utilitarios)
                            }

                            // Álbuns
                            if (semanal.includes("<div class=\"graph-description\">")){

                                albuns_semanal = semanal.split("<div class=\"graph-description\">")[1].split(" álbuns")[0].split("<h3>")[1].trim()

                                albuns_semana_passada = semanal.split("<p class=\"listening-report-highlight-comparison-meta\">")[1].split(" (semana passada)")[0].split("vs. ")[1].trim()

                                indicador_album = regula_porcentagem(albuns_semanal, albuns_semana_passada, 0, utilitarios)
                            }

                            // Artistas
                            if (semanal.includes("<div class=\"graph-description\">")){

                                artistas_semanal = semanal.split("<div class=\"graph-description\">")[2].split(" artistas")[0].split("<h3>")[1].trim()

                                artistas_semana_passada = semanal.split("<p class=\"listening-report-highlight-comparison-meta\">")[2].split(" (semana passada)")[0].split("vs. ")[1].trim()

                                indicador_artista = regula_porcentagem(artistas_semanal, artistas_semana_passada, 0, utilitarios)
                            }
                        }

                        const embed = new EmbedBuilder()
                        .setTitle(utilitarios[20]["perfil_musical"].replace("nome_repl", nome))
                        .setThumbnail(avatar)
                        .setURL(usuario_alvo)
                        .setColor(0x29BB8E)
                        .addFields(
                            {
                                name: `:saxophone: ${utilitarios[20]["geral"]}`,
                                value: `:notes: **Scrobbles: **\`${musicas_ouvidas}\`\n:radio: **${utilitarios[20]["media_dia"]}: **\`${media_scrobbles}\``,
                                inline: true
                            },
                            {
                                name: `⠀`,
                                value: `:man_singer: **${utilitarios[20]["artistas"]}: **\`${artistas_ouvidos}\`\n:blue_heart: **${utilitarios[20]["faixas_favoritas"]}: **\`${faixas_preferidas}\``,
                                inline: true
                            },
                            {
                                name: `:birthday: ${utilitarios[13]["conta_criada"]}`,
                                value: `**${criacao_conta}**`,
                                inline: true
                            }
                        )
                        
                        if (descricao.length > 0 || obsessao.length > 0)
                            embed.setDescription(`${descricao}${obsessao}`)
                        
                        if (!semanal.includes("não ouviu nenhuma música :("))
                            embed.addFields(
                                {
                                    name: `:calendar: ${utilitarios[20]["semanal"]}`,
                                    value: `:blue_book: **${utilitarios[20]["albuns"]}: **\`${albuns_semanal} vs ${albuns_semana_passada}\` \`${indicador_album}%\`\n:man_singer: **${utilitarios[20]["artistas"]}: **\`${artistas_semanal} vs ${artistas_semana_passada}\` \`${indicador_artista}%\`\n:notes: **Scrobbles: **\`${scrobbles_semanal} vs ${scrobbles_semana_passada}\` \`${indicador_scrobbles}%\`\n:radio: **${utilitarios[20]["media_dia"]}: **\`${media_semanal} vs ${media_semana_passada}\` \`${indicador_media}%\`\n:alarm_clock: **${utilitarios[20]["tempo_tocado"]}: **\`${horas_tocadas} vs ${horas_passadas}\` \`${indicador_tempo}%\``,
                                    inline: false
                                }
                            )

                        interaction.editReply({embeds: [embed]})
                    })
                } else
                    interaction.editReply(utilitarios[20]["sem_scrobbles"])
            })
        }catch(err){
            console.log(err)
        }
    }
}

function regula_porcentagem(stats_semana, stats_passado, hora, utilitarios){

    if (hora){ // Formatando a hora para números inteiros
        stats_semana = parseInt(stats_semana.split(" dia")[0]) * 24 + parseInt(stats_semana.split(", ")[1].split(" ")[0])
        stats_passado = parseInt(stats_passado.split(" dia")[0] * 24) + parseInt(stats_passado.split(", ")[1].split(" ")[0])

        horas_tocadas = `${stats_semana}${utilitarios[14]["horas"]}`
        horas_passadas = `${stats_passado}${utilitarios[14]["horas"]}`
    }

    porcentagem = (100 * stats_semana) / stats_passado

    if (stats_semana < stats_passado)
        porcentagem = `🔽 ${(100 - porcentagem).toFixed(2)}`
    else
        porcentagem = `🔼 ${(porcentagem - 100).toFixed(2)}`

    return porcentagem
}