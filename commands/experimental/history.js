const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("history")
        .setDescription("⌠💡|🇧🇷⌡ Fatos que ocorreram no mundo em determinada data")
        .addSubcommand(subcommand =>
            subcommand
                .setName("unico")
                .setDescription("⌠💡|🇧🇷⌡ Apenas um acontecimento")
                .addStringOption(option =>
                    option.setName("data")
                        .setDescription("Uma data específica, neste formato 21/01"))
                .addIntegerOption(option =>
                    option.setName("especifico")
                        .setDescription("1, 2, 3...")
                        .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("lista")
                .setDescription("⌠💡|🇧🇷⌡ Listar todos os acontecimentos do dia")
                .addStringOption(option =>
                    option.setName("data")
                        .setDescription("Uma data específica, neste formato 21/01"))),
    async execute({ client, user, interaction, user_command }) {

        let dados = ""
        const alvo = user

        if (interaction.options.getString("data")) // Data customizada
            dados = `?data=${interaction.options.getString("data")}`

        // Aumentando o tempo de duração da resposta
        await client.deferedReply(interaction, client.decider(user?.conf.ghost_mode || user_command, 0) ? "Ephemeral" : null)

        if (interaction.options.getSubcommand() === "lista") // Lista de eventos
            require('../../core/formatters/chunks/model_history')({ client, alvo, dados, interaction, user_command })
        else {

            // Apenas um acontecimento
            let especifico = "acon=alea"

            if (interaction.options.getInteger("especifico"))
                especifico = `acon=${interaction.options.getInteger("especifico")}`

            // Filtrando os valores de entrada caso tenham sido declarados
            if (data.length > 0)
                especifico = `&${especifico}`

            dados = {
                data: dados,
                especifico: especifico
            }

            require('../../core/formatters/chunks/model_history')({ client, alvo, dados, interaction, user_command })
        }
    }
}