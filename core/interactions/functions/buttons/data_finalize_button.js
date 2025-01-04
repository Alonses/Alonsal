const { clear_data } = require("../../../data/user_update_data")

module.exports = async ({ client, user, interaction, dados }) => {

    let operacao = parseInt(dados.split(".")[2])
    const caso = parseInt(dados.split(".")[6])
    const operador = dados.split(".")[5]

    // Botão de cancelar
    if (parseInt(dados.split(".")[1]) === 0) operacao = 0

    // Códigos de operação
    // 0 -> Botão cancelar / Botão errado
    // 1 -> Confirmando a exclusão

    if (operacao === 0)
        return interaction.update({
            content: client.tls.phrase(user, "manu.data.operacao_cancelada", 11),
            components: [],
            flags: "Ephemeral"
        })

    // Realizando a exclusão dos dados do usuário
    clear_data({ client, user, interaction, operador, caso })
}