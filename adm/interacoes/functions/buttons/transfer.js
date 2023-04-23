const { emojis_dancantes } = require('../../../../arquivos/json/text/emojis.json')

module.exports = async ({ client, user, interaction, dados }) => {

    // Gerenciamento de transferência de Bufunfas entre usuários
    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirma

    if (!operacao)
        return client.tls.report(interaction, user, "menu.botoes.operacao_cancelada", true, 11, interaction.customId)

    // Transferindo Bufunfas entre usuários
    const id_alvo = dados.split(".")[2].split("[")[0]
    const alvo = await client.getUser(id_alvo)
    const bufunfas = parseFloat(dados.split("[")[1])

    user.misc.money -= bufunfas
    alvo.misc.money += bufunfas

    await user.save()
    await alvo.save()

    const caso = "movido", quantia = bufunfas
    require('../../../automaticos/relatorio')({ client, caso, quantia })

    interaction.update({ content: `${client.replace(client.tls.phrase(user, "misc.pay.sucesso", [9, 10]), client.locale(bufunfas))} <@!${alvo.uid}>`, ephemeral: client.decider(user?.conf.ghost_mode, 0), embeds: [], components: [] })

    // Notificando o usuário que recebeu as Bufunfas
    client.sendDM(alvo, client.replace(client.tls.phrase(alvo, "misc.pay.notifica", client.emoji(emojis_dancantes)), [user.uid, client.locale(bufunfas)]))
}