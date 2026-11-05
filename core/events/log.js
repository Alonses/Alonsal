const { incrementBotCommands } = require("../database/schemas/Bot")

/**
 * Registra o uso de comandos e experiência do usuário
 * @param {object} params
 * @param {object} params.client - Instância do client
 * @param {object} params.interaction - Objeto de interação do usuário
 */
module.exports = async ({ client, interaction }) => {

    // Contabiliza o uso de uma interação sem bloquear a resposta ao usuário
    if (client.x.relatorio)
        incrementBotCommands(client.x.id)
            .catch(error => console.error("🛑 | Erro ao salvar relatório de comandos:", error))

    // Registra experiência recebida pelo usuário
    client.registryExperience(interaction, "comando")
}