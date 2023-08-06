const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_broadcast")
        .setDescription("⌠🤖⌡ Enviar mensagem em canal especifico")
        .addSubcommand(subcommand =>
            subcommand.setName("configurar")
                .setDescription("⌠🤖⌡ Configurar um canal de broadcast")
                .addStringOption(option =>
                    option.setName("alvo")
                        .setDescription("ID do canal que será enviado as mensagens")
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName("local")
                        .setDescription("ID do canal que receberá as mensagens")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName("update")
                .setDescription("⌠🤖⌡ (Des)ativar o broadcast"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (interaction.user.id !== client.owners[0]) return

        const bot = await client.getBot()

        // Solicitando a função e executando
        return require(`./subcommands/broadcast_${interaction.options.getSubcommand()}`)({ client, interaction, bot })
    }
}