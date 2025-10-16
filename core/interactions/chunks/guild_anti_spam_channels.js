const { ChannelType, PermissionsBitField } = require('discord.js')

module.exports = async ({ client, user, interaction, dados, pagina_guia }) => {

    let operacao = parseInt(dados?.split(".")[1]) || 1
    let id_categoria = dados?.split(".")[2]
    let canais = {}, categorias = {}
    const pagina = pagina_guia || parseInt(dados?.split(".")[3]) || 0

    if (!id_categoria || id_categoria === "null")
        id_categoria = null

    // Listando todos os canais e categorias do servidor
    interaction.guild.channels.cache.forEach(async channel => {

        if (channel.type === ChannelType.GuildCategory) categorias[channel.id] = { name: channel.name }
        else if (channel.type !== ChannelType.GuildForum) {

            canais[channel.id] = {
                parentId: channel.parentId,
                channelId: channel.id,
                name: channel.name,
                viewChannel: channel.permissionsFor(client.id()).has(PermissionsBitField.Flags.ViewChannel),
                readMessageHistory: channel.permissionsFor(client.id()).has(PermissionsBitField.Flags.ReadMessageHistory),
                sendMessages: channel.permissionsFor(client.id()).has(PermissionsBitField.Flags.SendMessages)
            }
        }
    })

    let canais_ordenado = []
    let categoria_ordenada = {}

    // Verificando as permissões de visualização, leitura e escrita nos canais que possuem texto para o bot
    Object.keys(canais).forEach(canal => {

        if (!canais[canal].viewChannel || !canais[canal].readMessageHistory || !canais[canal].sendMessages)
            canais_ordenado.push(canais[canal])
    })

    // Ordenando os canais sem permissão conforme as categorias
    canais_ordenado.forEach(canal => {

        if (canal.parentId) {

            if (!categoria_ordenada[canal.parentId])
                categoria_ordenada[canal.parentId] = []

            categoria_ordenada[canal.parentId].push(canal)
        } else {

            if (!categoria_ordenada["none"])
                categoria_ordenada["none"] = []

            categoria_ordenada["none"].push(canal)
        }
    })

    // Formatando a visualização para o embed
    let descricao_canais = "", campo_canais = []
    Object.keys(categoria_ordenada).forEach(categoria => {

        // Verificando se o canal pertence a categoria selecionada
        if (id_categoria === categoria || (!id_categoria && categoria === "none")) {

            descricao_canais += `\`\`\`${client.tls.phrase(user, "mode.spam.descricao_canais_desconfigurados")}\`\`\`\n**📦 ${client.tls.phrase(user, "util.server.categoria")}: ${categorias[categoria]?.name || client.tls.phrase(user, "mode.spam.sem_categoria")}**\n`

            const canais = categoria_ordenada[categoria]
            canais.forEach(canal => {

                campo_canais.push({
                    name: `**${client.tls.phrase(user, "mode.canal.canal")}: ${canal.name}**`,
                    value: `**${client.tls.phrase(user, "menu.botoes.permissoes")}:**\n${canal.viewChannel ? "✅" : "❌"} \`${client.tls.phrase(user, "mode.spam.ver_canal")}\`\n${canal.sendMessages ? "✅" : "❌"} \`${client.tls.phrase(user, "mode.spam.enviar_mensagens")}\`\n${canal.readMessageHistory ? "✅" : "❌"} \`${client.tls.phrase(user, "mode.spam.ver_historico")}\``,
                    inline: true
                })
            })
        }
    })

    if (canais_ordenado.length < 1)
        descricao_canais = client.tls.phrase(user, "mode.spam.sem_canais_desconfigurados")

    const embed = client.create_embed({
        title: { tls: "mode.spam.verificando_servidor" },
        description: descricao_canais,
        fields: campo_canais
    }, user)

    const botao_categorias = []

    if (pagina !== 0) // Botão de voltar
        botao_categorias.unshift({ id: "navigation_button_panel", name: '◀', type: 2, data: `${pagina}.0.guild_anti_spam_channels` })
    else if (id_categoria)
        botao_categorias.unshift({ id: "guild_anti_spam_channels", name: { tls: "menu.botoes.sem_categoria" }, type: 0, emoji: client.emoji(72), data: '1.null' })

    if (pagina > 0) {

        let i = 0 // Removendo categorias caso a página seja diferente
        Object.keys(categoria_ordenada).forEach(categoria => {
            if (i < pagina * 3)
                delete categoria_ordenada[categoria]

            i++
        })
    }

    // Organizando os botões de categorias para navegação
    Object.keys(categoria_ordenada).forEach(categoria => {
        if (botao_categorias.length < 4 && categorias[categoria]?.name && id_categoria !== categoria)
            botao_categorias.push({ id: "guild_anti_spam_channels", name: categorias[categoria].name, type: 0, emoji: client.emoji(72), data: `4.${categoria}.${pagina}` })
    })

    if (Object.keys(categoria_ordenada).length > 3)
        botao_categorias.push({ id: "navigation_button_panel", name: '▶', type: 2, data: `${pagina}.1.guild_anti_spam_channels` })

    const row = [
        { id: "guild_anti_spam_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: '0' },
        { id: "guild_anti_spam_channels", name: { tls: "menu.botoes.atualizar" }, type: 0, emoji: client.emoji(42), data: `1.${id_categoria}.${pagina}` }
    ]

    const obj = {
        embeds: [embed],
        components: [client.create_buttons(row, interaction, user)],
        flags: "Ephemeral"
    }

    if (botao_categorias.length > 0)
        obj.components.unshift(client.create_buttons(botao_categorias, interaction, user))

    // Atualizando a interação para o usuário
    if (!operacao) interaction.reply(obj)
    else interaction.update(obj)
}