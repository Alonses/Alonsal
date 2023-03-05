const { EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = async ({ client }) => {

    if (client.id() !== process.env.client_1) return

    const date1 = new Date() // Ficará esperando até meia noite para executar a rotina
    const tempo_restante = ((23 - date1.getHours()) * 3600000) + ((60 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000)

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
    const bot = client.auto.getRelatorio()

    let canais_texto = client.channels(0).size
    let members = 0, processamento = '🎲 Processamento\n'

    client.guilds().forEach(async guild => {
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
                value: `:dart: **Hoje:** \`${client.locale(bot.comandos_disparados)}\`\n:octagonal_sign: **Erros:** \`${bot.epic_embed_fails}\``,
                inline: true
            },
            {
                name: ":medal: **Experiência**",
                value: `:dart: **Hoje:** \`${client.locale(bot.exp_concedido)}\``,
                inline: true
            },
            {
                name: ":e_mail: **Mensagens**",
                value: `:dart: **Hoje:** \`${client.locale(bot.msgs_lidas)}\`\n:white_check_mark: **Válidas:** \`${client.locale(bot.msgs_validas)}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: ":globe_with_meridians: **Servidores**",
                value: `**Ativo em:** \`${(client.locale(client.guilds().size))}\`\n**Canais: ** \`${client.locale(canais_texto)}\``,
                inline: true
            },
            {
                name: ":busts_in_silhouette: **Usuários**",
                value: `**Conhecidos:** \`${client.locale(members)}\``,
                inline: true
            },
            {
                name: ":bank: Bufunfas",
                value: `${client.emoji(emojis.mc_esmeralda)} **Distribuídas:** \`${client.locale(bot.bufunfas)}\`\n:money_with_wings: **Movimentado:** \`${client.locale(bot.movimentado)}\``,
                inline: true
            }
        )
        .setDescription(`\`\`\`fix\n${processamento}\`\`\``)
        .addFields({ name: `:sparkles: Próximo update <t:${Math.floor((date1.getTime() + proxima_att) / 1000)}:R>`, value: `<t:${Math.floor((date1.getTime() + proxima_att) / 1000)}:f>`, inline: false })
        .addFields({ name: `:satellite: Ativo desde`, value: `<t:${Math.floor(client.discord.readyTimestamp / 1000)}:f>\n<t:${Math.floor(client.discord.readyTimestamp / 1000)}:R>`, inline: false })

    await client.notify(process.env.stats_channel, embed)
    client.auto.resRelatorio() // Reseta o relatório
}