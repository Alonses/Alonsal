const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('c_resumo_diario')
		.setDescription('⌠✳️⌡ Veja um resumo diário de forma manual'),
	async execute(client, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        const date1 = new Date() // Ficará esperando até meia noite para executar a rotina
        const proxima_att = (date1.getTime() / 1000) + (((24 - date1.getHours()) *3600) + ((60 - date1.getMinutes()) *60) + ((60 - date1.getSeconds())))

        const bot = {
            comandos_disparados: 0,
            exp_concedido: 0,
            msgs_lidas: 0,
            msgs_validas: 0,
            epic_embed_fails: 0
        }

        const { comandos_disparados, exp_concedido, msgs_lidas, msgs_validas, epic_embed_fails} = require(`../../arquivos/data/relatorio.json`)
        bot.comandos_disparados = comandos_disparados || 0
        bot.exp_concedido = exp_concedido || 0
        bot.msgs_lidas = msgs_lidas || 0
        bot.msgs_validas = msgs_validas || 0
        bot.epic_embed_fails = epic_embed_fails || 0

        let canais_texto = client.channels.cache.filter((c) => c.type === 0).size
        let members = 0, processamento = '🎲 Processamento\n'

        client.guilds.cache.forEach(async guild => {
            members += guild.memberCount - 1
        })

        const used = process.memoryUsage()

        for (let key in used) 
            processamento += `${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\n`
        
        let embed = new EmbedBuilder()
        .setTitle("Resumo diário :mega:")
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
                value: `**Ativo em:** \`${client.guilds.cache.size.toLocaleString('pt-BR')}\`\n**Canais: **\`${canais_texto.toLocaleString('pt-BR')}\``,
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
        .addFields({ name: `:sparkles: Próximo update`, value: `<t:${Math.floor(proxima_att)}:f>`, inline: false })
        .addFields({ name: `:satellite: Ativo desde`, value: `<t:${Math.floor(client.readyTimestamp / 1000)}:f>\n<t:${Math.floor(client.readyTimestamp / 1000)}:R>`, inline: false })
        
        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}