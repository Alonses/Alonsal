const { emojis_dancantes } = require('../../../../arquivos/json/text/emojis.json')

module.exports = async ({ client, user, interaction, dados }) => {

    // Gerenciamento de transferência de Bufunfas entre usuários
    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirma

    if (!operacao)
        return interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })

    // Transferindo Bufunfas entre usuários
    const id_alvo = dados.split(".")[2].split("[")[0]
    const alvo = await client.getUser(id_alvo)
    const bufunfas = parseFloat(dados.split("[")[1])

    user.misc.money -= bufunfas
    alvo.misc.money += bufunfas

    user.save()
    alvo.save()

    const caso = "movido", quantia = bufunfas
    require('../../../automaticos/relatorio')({ client, caso, quantia })

    interaction.update({ content: `${client.tls.phrase(user, "misc.pay.sucesso", [9, 10]).replace("valor_repl", client.locale(bufunfas))} <@!${alvo.uid}>`, ephemeral: client.decider(user?.conf.ghost_mode, 0), embeds: [], components: [] })

    // Notificando o usuário que recebeu as Bufunfas
    client.sendDM(alvo, `${client.tls.phrase(alvo, "misc.pay.notifica").replace("user_repl", user.uid).replace("valor_repl", client.locale(bufunfas))} ${client.emoji(emojis_dancantes)}`)
}