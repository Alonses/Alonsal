const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_resumo_diario')
        .setDescription('⌠🤖⌡ Veja um resumo diário de forma manual')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        const date1 = new Date() // Ficará esperando até meia noite para executar a rotina
        const bot = client.auto.getRelatorio()
        const proxima_att = (date1.getTime() / 1000) + (((23 - date1.getHours()) * 3600) + ((60 - date1.getMinutes()) * 60) + ((60 - date1.getSeconds())))

        let canais_texto = client.channels().filter((c) => c.type === 0).size
        let members = 0, processamento = '🎲 Processamento\n'

        client.guilds().forEach(async guild => {
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
                    value: `**Ativo em:** \`${client.guilds().size.toLocaleString('pt-BR')}\`\n**Canais: **\`${canais_texto.toLocaleString('pt-BR')}\``,
                    inline: true
                },
                {
                    name: ':busts_in_silhouette: **Usuários**',
                    value: `**Conhecidos:** \`${members.toLocaleString('pt-BR')}\``,
                    inline: true
                },
                {
                    name: ':bank: Bufunfas',
                    value: `${client.emoji(emojis.mc_esmeralda)} **Distribuídas:** \`${bot.bufunfas.toLocaleString('pt-BR')}\`\n:money_with_wings: **Movimentado:** \`${bot.movimentado.toLocaleString('pt-BR')}\``,
                    inline: true
                }
            )
            .setDescription(`\`\`\`fix\n${processamento}\`\`\``)
            .addFields({ name: `:sparkles: Próximo update`, value: `<t:${Math.floor(proxima_att)}:f>`, inline: false })
            .addFields({ name: `:satellite: Ativo desde`, value: `<t:${Math.floor(client.discord.readyTimestamp / 1000)}:f>\n<t:${Math.floor(client.discord.readyTimestamp / 1000)}:R>`, inline: false })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}