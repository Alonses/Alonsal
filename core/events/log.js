module.exports = async ({ client, interaction }) => {

    if (client.x.relatorio) {

        // Contabilizando o uso de uma interação
        const bot = await client.getBot()
        bot.persis.commands++
        bot.save()
    }

    // Experiência recebida pelo usuário
    client.registryExperience(interaction, "comando")
}