const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_resumo_diario")
        .setDescription("⌠🤖⌡ Veja o resumo diário de forma manual")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        // Ficará esperando até meia noite para executar a rotina
        const date1 = new Date(), bot = await client.getBot()
        const proxima_att = client.timestamp() + (((23 - date1.getHours()) * 3600) + ((60 - date1.getMinutes()) * 60) + ((60 - date1.getSeconds())))

        let canais_texto = client.channels(0).size
        let members = 0, processamento = "🎲 Processamento\n"

        client.guilds().forEach(async guild => {
            members += guild.memberCount - 1
        })

        const used = process.memoryUsage()

        for (let key in used)
            processamento += `${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\n`

        let embed = new EmbedBuilder()
            .setTitle("> Resumo diário até o momento :mega:")
            .setColor(0x29BB8E)
            .addFields(
                {
                    name: ":gear: **Comandos**",
                    value: `:dart: **Hoje:** \`${client.locale(bot.cmd.ativacoes)}\`\n:octagonal_sign: **Erros:** \`${client.locale(bot.cmd.erros)}\``,
                    inline: true
                },
                {
                    name: ":medal: **Experiência**",
                    value: `:dart: **Hoje:** \`${client.locale(bot.exp.exp_concedido)}\``,
                    inline: true
                },
                {
                    name: ":e_mail: **Mensagens**",
                    value: `:dart: **Hoje:** \`${client.locale(bot.exp.msgs_lidas)}\`\n:white_check_mark: **Válidas:** \`${client.locale(bot.exp.msgs_validas)}\``,
                    inline: true
                }
            )
            .addFields(
                {
                    name: ":globe_with_meridians: **Servidores**",
                    value: `**Ativo em:** \`${client.locale(client.guilds().size)}\`\n**Canais: **\`${client.locale(canais_texto)}\``,
                    inline: true
                },
                {
                    name: ":busts_in_silhouette: **Usuários**",
                    value: `**Conhecidos:** \`${client.locale(members)}\``,
                    inline: true
                },
                {
                    name: ":bank: Bufunfas",
                    value: `${client.emoji("mc_esmeralda")} **Distribuídas:** \`${client.locale(bot.bfu.gerado)}\`\n:money_with_wings: **Movimentado:** \`${client.locale(bot.bfu.movido)}\`\n:dollar: **Recolhido:** \`${client.locale(bot.bfu.reback)}\``,
                    inline: true
                }
            )
            .setDescription(`\`\`\`fix\n${processamento}\`\`\``)
            .addFields({ name: `:sparkles: Próximo update`, value: `<t:${Math.floor(proxima_att)}:f>`, inline: false })
            .addFields({ name: `:satellite: Ativo desde`, value: `<t:${Math.floor(client.discord.readyTimestamp / 1000)}:f>\n<t:${Math.floor(client.discord.readyTimestamp / 1000)}:R>`, inline: false })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}