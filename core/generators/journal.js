module.exports = async ({ client }) => {

    const date1 = new Date(), bot = await client.getBot()

    // Ficará esperando até meia noite para executar a rotina
    const proxima_att = ((23 - date1.getHours()) * 3600000) + ((60 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000)

    let canais_texto = client.channels(0).size, members = 0, processamento = ""

    client.guilds().forEach(async guild => { members += guild.memberCount - 1 })
    const used = process.memoryUsage()

    for (let key in used)
        processamento += `${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\n`

    const embed = client.create_embed({
        title: "> Resumo diário :mega:",
        color: "turquesa",
        description: `\`\`\`fix\n🎲 Processamento\n${processamento}\`\`\``,
        fields: [
            {
                name: ":gear: **Comandos**",
                value: `:dart: **Hoje:** \`${client.execute("locale", { valor: bot.cmd.ativacoes })}\`\n:octagonal_sign: **Erros:** \`${client.execute("locale", { valor: bot.cmd.erros })}\``,
                inline: true
            },
            {
                name: ":medal: **Experiência**",
                value: `:dart: **Hoje:** \`${client.execute("locale", { valor: bot.exp.exp_concedido })}\``,
                inline: true
            },
            {
                name: ":e_mail: **Mensagens**",
                value: `:dart: **Hoje:** \`${client.execute("locale", { valor: bot.exp.msgs_lidas })}\`\n:white_check_mark: **Válidas:** \`${client.execute("locale", { valor: bot.exp.msgs_validas })}\``,
                inline: true
            },
            {
                name: `${client.emoji("icon_slash_commands")} **Interações**`,
                value: `:mouse_three_button: **Botões:** \`${(client.execute("locale", { valor: bot.cmd.botoes }))}\`\n:card_box: **Menus: **\`${client.execute("locale", { valor: bot.cmd.menus })}\`\n${client.emoji("icon_voice_channel")} **Faladeros:** \`${client.execute("locale", { valor: bot.cmd.voice_channels })}\``,
                inline: true
            },
            {
                name: ":globe_with_meridians: **Servidores**",
                value: `:diamond_shape_with_a_dot_inside: **Ativo em:** \`${client.execute("locale", { valor: client.guilds().size })}\`\n:busts_in_silhouette: **Usuários: **\`${client.execute("locale", { valor: members })}\`\n${client.defaultEmoji("paper")} **Canais: **\`${client.execute("locale", { valor: canais_texto })}\``,
                inline: true
            },
            {
                name: ":bank: Bufunfas",
                value: `${client.emoji("mc_esmeralda")} **Distribuídas:** \`${client.execute("locale", { valor: bot.bfu.gerado })}\`\n:money_with_wings: **Movimentado:** \`${client.execute("locale", { valor: bot.bfu.movido })}\`\n:dollar: **Recolhido:** \`${client.execute("locale", { valor: bot.bfu.reback })}\``,
                inline: true
            },
            {
                name: `:sparkles: Próximo update <t:${Math.floor((date1.getTime() + proxima_att) / 1000)}:R>`,
                value: `<t:${Math.floor((date1.getTime() + proxima_att) / 1000)}:f>`,
                inline: false
            },
            {
                name: ":satellite: Ativo desde",
                value: `<t:${Math.floor(client.discord.readyTimestamp / 1000)}:f>\n<t:${Math.floor(client.discord.readyTimestamp / 1000)}:R>`,
                inline: false
            }
        ]
    })

    return embed
}