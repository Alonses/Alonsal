module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    if (!operacao)
        return client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)

    // Formatando o ID do botão para o propósito esperado
    const data_cor = `${dados.split(".")[2]}.${dados.split(".")[3]}`

    const colors = ['7289DA', 'D62D20', 'FFD319', '36802D', 'FFFFFF', 'F27D0C', '44008B', '000000', '29BB8E', '2F3136', 'RANDOM'], precos = [200, 300, 400, 500, 50]

    const preco = precos[parseInt(data_cor.split(".")[0])]

    // Validando se o usuário tem dinheiro suficiente
    if (user.misc.money < preco)
        return interaction.update({
            content: client.replace(client.tls.phrase(user, "misc.color.sem_money", client.emoji("emojis_negativos")), client.locale(preco)),
            ephemeral: true
        })

    user.misc.money -= preco

    await client.journal("movido", preco)

    // Diferente da cor cor aleatória e da cor customizada
    if (data_cor.split(".")[0] !== '10' && data_cor.split(".")[0] !== '4')
        user.misc.color = colors[data_cor.split(".")[1].split("-")[0]]
    else if (data_cor.split(".")[1].split("0")[0] === '10') // Salvando a cor randomica
        user.misc.color = 'RANDOM'
    else
        user.misc.color = data_cor.split("-")[1]

    // Salvando os dados
    await user.save()

    // Registrando as movimentações de bufunfas para o usuário
    await client.registryStatement(user.uid, "misc.b_historico.cor_perfil", false, preco)
    await client.journal("reback", preco)

    interaction.update({
        content: client.tls.phrase(user, "misc.color.cor_att", client.emoji("emojis_dancantes")),
        embeds: [],
        components: [],
        ephemeral: true
    })
}