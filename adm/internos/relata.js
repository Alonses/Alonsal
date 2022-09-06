const { EmbedBuilder } = require('discord.js')

const formata_horas = require('../funcoes/formata_horas.js')

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

    const bot = {
        comandos_disparados: 0,
        exp_concedido: 0,
        msgs_lidas: 0,
        epic_embed_fails: 0
    }
    
    const { comandos_disparados, exp_concedido, msgs_lidas, epic_embed_fails} = require(`../../arquivos/data/relatorio.json`)
    bot.comandos_disparados = comandos_disparados
    bot.exp_concedido = exp_concedido
    bot.msgs_lidas = msgs_lidas
    bot.epic_embed_fails = epic_embed_fails

    let canais_texto = client.channels.cache.filter((c) => c.type === 0).size
    let members = 0

    client.guilds.cache.forEach(async guild => {
        members += guild.memberCount - 1
    })

    let embed = new EmbedBuilder()
    .setTitle("Resumo diário :mega:")
    .setColor(0x29BB8E)
    .addFields(
        {
            name: ":gear: **Comandos**",
            value: `**Hoje:** \`${bot.comandos_disparados.toLocaleString('pt-BR')}\``,
            inline: true
        },
        {
            name: ":medal: **Experiência**",
            value: `**Hoje:** \`${bot.exp_concedido.toLocaleString('pt-BR')}\``,
            inline: true
        },
        {
            name: ":e_mail: **Mensagens**",
            value: `**Hoje:** \`${bot.msgs_lidas.toLocaleString('pt-BR')}\``,
            inline: true
        }
    )
    .addFields(
        {
            name: ':globe_with_meridians: **Servidores**',
            value: `**Ativo em:** \`${(client.guilds.cache.size).toLocaleString('pt-BR')}\``,
            inline: true
        },
        {
            name: ':card_box: **Canais**',
            value: `**Observando:** \`${canais_texto.toLocaleString('pt-BR')}\``,
            inline: true
        },
        {
            name: ':busts_in_silhouette: **Usuários**',
            value: `**Escutando:** \`${members.toLocaleString('pt-BR')}\``,
            inline: true
        }
    )
    .setFooter({ text: `Próxima atualização em <t:${Math.floor(proxima_att / 1000)}:R>` })
    
    await client.channels.cache.get('934426266726174730').send({ embeds: [embed] })
    require("../funcoes/reseta_relatorio.js")({}) // Reseta o relatório
}