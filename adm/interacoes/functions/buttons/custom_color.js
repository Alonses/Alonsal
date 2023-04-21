const { emojis_dancantes } = require('../../../../arquivos/json/text/emojis.json')

module.exports = async ({ client, user, interaction, dados }) => {

    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirmar

    if (!operacao)
        interaction.update({ content: `:anger: | ${client.tls.phrase(user, "misc.color.att_cancelada")}`, embeds: [], components: [], ephemeral: true })

    // Formatando o ID do botão para o propósito esperado
    const data_cor = `${dados.split(".")[2]}.${dados.split(".")[3]}`

    const colors = ['7289DA', 'D62D20', 'FFD319', '36802D', 'FFFFFF', 'F27D0C', '44008B', '000000', '29BB8E', '2F3136', 'RANDOM'], precos = [200, 300, 400, 500, 50]

    const preco = precos[parseInt(data_cor.split(".")[0])]

    // Validando se o usuário tem dinheiro suficiente
    if (user.misc.money < preco) {
        return interaction.reply({
            content: `:epic_embed_fail: | ${client.tls.translate(client, interaction, "misc.color.sem_money").replace("preco_repl", client.locale(preco))}`,
            ephemeral: true
        })
    }

    // user.misc.money -= preco

    const caso = "movido", quantia = preco
    await require('../../../automaticos/relatorio')({ client, caso, quantia })

    // Diferente da cor cor aleatória e da cor customizada
    if (data_cor.split(".")[0] !== '10' && data_cor.split(".")[0] !== '4')
        user.misc.color = colors[data_cor.split(".")[1].split("-")[0]]
    else if (data_cor.split(".")[1].split("0")[0] === '10') // Salvando a cor randomica
        user.misc.color = 'RANDOM'
    else
        user.misc.color = data_cor.split("-")[1]

    // Salvando os dados
    user.save()

    interaction.update({ content: `${client.emoji(emojis_dancantes)} | ${client.tls.phrase(user, "misc.color.cor_att")}`, embeds: [], components: [], ephemeral: true })
}