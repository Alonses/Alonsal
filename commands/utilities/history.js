const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const formata_texto = require('../../core/formatters/formata_texto.js')

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
    async execute(client, user, interaction) {

        let data = ""

        if (interaction.options.getString("data")) // Data customizada
            data = `?data=${interaction.options.getString("data")}`

        // Aumentando o tempo de duração da resposta
        await interaction.deferReply({
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })

        if (interaction.options.getSubcommand() === "lista") // Lista de eventos
            return require('../../core/formatters/chunks/model_history.js')(client, user, data, interaction)
        else {

            // Apenas um acontecimento
            let especifico = "acon=alea"

            if (interaction.options.getInteger("especifico"))
                especifico = `acon=${interaction.options.getInteger("especifico")}`

            // Filtrando os valores de entrada caso tenham sido declarados
            if (data.length > 0)
                especifico = `&${especifico}`

            const dados = {
                data: data,
                especifico: especifico
            }

            return require('../../core/formatters/chunks/model_history')(client, user, dados, interaction)
        }
    }
}