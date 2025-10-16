const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_subscriber_discount")
        .setDescription("⌠🤖⌡ Alterar o desconto para assinantes")
        .addIntegerOption(option =>
            option.setName("porcentagem")
                .setDescription("A porcentagem de desconto")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(99))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        if (!client.x.owners.includes(interaction.user.id)) return

        let novo_valor = parseInt(interaction.options.getInteger("porcentagem"))
        const desconto_calculado = (100 - novo_valor) * 0.01

        client.cached.subscriber_discount = desconto_calculado

        const bot = await client.getBot()
        const valor_antigo = client.execute("getSubscriberDiscount", { valor: bot.persis.subscriber_discount })

        bot.persis.subscriber_discount = desconto_calculado
        await bot.save()

        interaction.reply({
            content: `:bank: | O valor descontado dos recursos para assinantes foi alterado de \`${valor_antigo}%\` para \`${client.execute("locale", { valor: novo_valor })}%\`.`,
            flags: "Ephemeral"
        })

        client.execute("notify", { id_canal: process.env.channel_feeds, conteudo: { content: `:bank: | Desconto em recursos do Alonsal alterado de \`${valor_antigo}%\` para \`${novo_valor}%\` para assinantes.` } })
    }
}