const { atualiza_user_eraser } = require("../../../auto/user_eraser")

module.exports = async ({ client, user, interaction, dados }) => {

    let operacao = parseInt(dados.split(".")[2])

    // Botão de cancelar
    if (parseInt(dados.split(".")[1]) === 0)
        operacao = 0

    // Códigos de operação
    // 0 -> Botão cancelar / Botão errado
    // 1 -> Confirmando a exclusão

    if (operacao === 0)
        return interaction.update({
            content: client.tls.phrase(user, "manu.data.operacao_cancelada", 11),
            components: [],
            ephemeral: true
        })

    // Movendo o usuário para exclusão automática
    user.erase.erase_on = client.timestamp()
    user.erase.forced = true

    await user.save()

    // Atualizando a lista de usuários que estão expirando
    atualiza_user_eraser(client)

    client.reply(interaction, {
        content: client.replace(client.tls.phrase(user, "manu.data.aviso_movido_exclusao", 7), client.timestamp() + 1209600),
        components: [],
        ephemeral: true
    })
}