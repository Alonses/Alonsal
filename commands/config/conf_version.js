const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_version")
        .setDescription("⌠🤖⌡ Altere a versão do Alonsal")
        .addStringOption(option =>
            option.setName("versao")
                .setDescription("Qual será a versão")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (interaction.user.id !== client.owners[0])
            return client.tls.reply(interaction, user, "inic.error.comando_restrito", true, 18)

        const bot = await client.getBot()
        bot.persis.version = interaction.options.getString("versao")
        await bot.save()

        interaction.reply({
            content: `:placard: | A Versão do ${client.username()} foi atualizada para \`${bot.persis.version}\``,
            ephemeral: true
        })
        client.notify(process.env.channel_feeds, `:placard: | A Versão do ${client.username()} foi atualizada para \`${bot.persis.version}\``)
    }
}