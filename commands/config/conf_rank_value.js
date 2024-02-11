const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_ranking")
        .setDescription("⌠🤖⌡ Altere o valor do ranking")
        .addIntegerOption(option =>
            option.setName("valor")
                .setDescription("O novo valor para o ranking")
                .setRequired(true)
                .setMinValue(1))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        if (!client.owners.includes(interaction.user.id)) return

        let novo_valor = parseInt(interaction.options.getInteger("valor"))
        const valor_ranking = novo_valor === 0 ? 2 : novo_valor

        const bot = await client.getBot()

        bot.persis.ranking = valor_ranking
        await bot.save()

        interaction.reply({
            content: `:tropical_drink: | Agora o ranking dará \`${valor_ranking} EXP\` p/ mensagem e \`${valor_ranking * 1.5} EXP\` p/ comando`,
            ephemeral: true
        })

        client.notify(process.env.channel_feeds, { content: `:medal: | Ranking do Alonsal ajustado para \`${valor_ranking} EXP\` p/ mensagem e \`${valor_ranking * 1.5} EXP\` p/ comando` })
    }
}