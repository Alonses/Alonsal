/**
 * Registra o uso de comandos e experiência do usuário
 * @param {object} params
 * @param {object} params.client - Instância do client
 * @param {object} params.interaction - Objeto de interação do usuário
 */
module.exports = async ({ client, interaction }) => {

    // Verifica se o relatório está habilitado
    if (client.x.relatorio)
        try {
            // Contabiliza o uso de uma interação
            const bot = await client.getBot()

            bot.persis.commands++
            await bot.save()
        } catch (error) {
            console.error("🛑 | Erro ao salvar relatório de comandos:", error)
        }

    // Registra experiência recebida pelo usuário
    client.registryExperience(interaction, "comando")
}