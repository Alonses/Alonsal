const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

const formata_horas = require('../../adm/funcoes/formata_horas.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('c_resumo_diario')
		.setDescription('⌠✳️⌡ Veja um resumo diário de forma manual'),
	async execute(client, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        const date1 = new Date() // Ficará esperando até meia noite para executar a rotina
        const proxima_att =  formata_horas(((date1.getHours() - 24) *-1), ((date1.getMinutes() - 60) *-1), ((date1.getSeconds() - 60) *-1))

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
                value: `**Hoje:** \`${bot.msgs_lidas.toLocaleString('pt-BR')}\`\n**Válidas:** \`${bot.msgs_validas.toLocaleString('pt-BR')}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: ':globe_with_meridians: **Servidores**',
                value: `**Ativo em:** \`${client.guilds.cache.size.toLocaleString('pt-BR')}\``,
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
        .setFooter({ text: `Próximo update em ${proxima_att}`, iconURL: interaction.user.avatarURL({dynamic: true}) })
        
        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}