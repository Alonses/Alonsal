const { EmbedBuilder } = require('discord.js')

module.exports = async ({client}) => {

    if (client.user.id !== "833349943539531806") return

    const date1 = new Date() // Ficará esperando até meia noite para executar a rotina
    const tempo_restante =  ((24 - date1.getHours()) *3600000) + ((60 - date1.getMinutes()) *60000) + ((60 - date1.getSeconds()) *1000)
    
    setTimeout(() => {
        gera_relatorio(client, 86400000)
        requisita_relatorio(client, 86400000) // Altera o valor para sempre executar à meia-noite
    }, tempo_restante) // Executa de 1 em 1 dia
}

function requisita_relatorio(client, aguardar_tempo) {
    setTimeout(() => {
        gera_relatorio(client, aguardar_tempo)
        requisita_relatorio(client, aguardar_tempo)
    }, aguardar_tempo)
}

async function gera_relatorio(client, proxima_att) {

    const date1 = new Date()

    const bot = {
        comandos_disparados: 0,
        exp_concedido: 0,
        msgs_lidas: 0,
        msgs_validas: 0,
        epic_embed_fails: 0
    }
    
    const { comandos_disparados, exp_concedido, msgs_lidas, msgs_validas, epic_embed_fails} = require(`../../arquivos/data/relatorio.json`)
    bot.comandos_disparados = comandos_disparados
    bot.exp_concedido = exp_concedido
    bot.msgs_lidas = msgs_lidas
    bot.msgs_validas = msgs_validas
    bot.epic_embed_fails = epic_embed_fails

    let canais_texto = client.channels.cache.filter((c) => c.type === 0).size
    let members = 0, processamento = '🎲 Processamento\n'

    client.guilds.cache.forEach(async guild => {
        members += guild.memberCount - 1
    })

    const used = process.memoryUsage()

    for (let key in used) 
        processamento += `${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\n`

    let embed = new EmbedBuilder()
    .setTitle("> Resumo diário :mega:")
    .setColor(0x29BB8E)
    .addFields(
        {
            name: ":gear: **Comandos**",
            value: `:dart: **Hoje:** \`${bot.comandos_disparados.toLocaleString('pt-BR')}\`\n:octagonal_sign: **Erros:** \`${bot.epic_embed_fails}\``,
            inline: true
        },
        {
            name: ":medal: **Experiência**",
            value: `:dart: **Hoje:** \`${bot.exp_concedido.toLocaleString('pt-BR')}\``,
            inline: true
        },
        {
            name: ":e_mail: **Mensagens**",
            value: `:dart: **Hoje:** \`${bot.msgs_lidas.toLocaleString('pt-BR')}\`\n:white_check_mark: **Válidas:** \`${bot.msgs_validas.toLocaleString('pt-BR')}\``,
            inline: true
        }
    )
    .addFields(
        {
            name: ':globe_with_meridians: **Servidores**',
            value: `**Ativo em:** \`${(client.guilds.cache.size).toLocaleString('pt-BR')}\`\n**Canais: ** \`${canais_texto.toLocaleString('pt-BR')}\``,
            inline: true
        },
        {
            name: ':busts_in_silhouette: **Usuários**',
            value: `**Conhecidos:** \`${members.toLocaleString('pt-BR')}\``,
            inline: true
        },
        {
            name: '⠀',
            value: '⠀',
            inline: true
        }
    )
    .setDescription(`\`\`\`fix\n${processamento}\`\`\``)
    .addFields({ name: `:sparkles: Próximo update <t:${Math.floor((date1.getTime() + proxima_att) / 1000)}:R>`, value: `[ <t:${Math.floor((date1.getTime() + proxima_att) / 1000)}:f> ]`, inline: false })
    .addFields({ name: `:satellite: Ativo desde`, value: `<t:${Math.floor(client.readyTimestamp / 1000)}:f>\n<t:${Math.floor(client.readyTimestamp / 1000)}:R>`, inline: false })

    await client.channels.cache.get('934426266726174730').send({ embeds: [embed] })
    require("../funcoes/reseta_relatorio.js")({}) // Reseta o relatório
}