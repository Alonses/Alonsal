module.exports = async ({ client, user, interaction, dados }) => {

    let operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Painel de dados
    // 1 -> Painel de exclusão de dados
    // 2 -> Painel de telemetria

    if (operacao === 0)
        return require('../../../formatters/chunks/model_data')({ client, user, interaction })

    if (operacao === 1)
        return require("../../../interactions/chunks/data")({ client, user, interaction })

    if (operacao === 2)
        return require('../../../formatters/chunks/model_data_telemetry')({ client, user, interaction })
}