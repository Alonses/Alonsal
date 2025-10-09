const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_new_subscriber")
        .setDescription("⌠🤖⌡ Adiciona um novo assinante")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("O usuário assinante")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("expiração")
                .setDescription("A data de expiração da assinatura")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        if (!client.x.owners.includes(interaction.user.id)) return

        let id_alvo = interaction.options.getUser("usuario").id
        expiracao = client.timestamp(interaction.options.getString("expiração"))

        if (expiracao < client.timestamp() && interaction.options.getString("expiração") !== "0")
            return interaction.reply({ content: ":octagonal_sign: | Informe uma data maior do que hoje para a expiração da assinatura no formato `31/12`!", flags: "Ephemeral" })

        // Formatando o tempo da expiração
        if (interaction.options.getString("expiração") === "0") {
            preview_expiracao = `\`${client.tls.phrase(user, "misc.assinante.vitalicia")}\``
            expiracao = 0
        } else preview_expiracao = `<t:${expiracao}:f>`

        // Atualizando o status do usuário
        const embed = client.create_embed({
            title: "> Ativar assinatura",
            fields: [
                {
                    name: `${client.defaultEmoji("person")} **Assinante**`,
                    value: `<@${id_alvo}>`,
                    inline: true
                },
                {
                    name: ":clock: **Expiração**",
                    value: preview_expiracao,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("time")} **Aplicação**`,
                    value: `<t:${client.timestamp()}:f>`,
                    inline: true
                }
            ],
            footer: { text: { tls: "menu.botoes.selecionar_operacao" }, iconURL: interaction.user.avatarURL({ dynamic: true }) }
        }, user)

        // Criando os botões para o menu de badges
        const row = client.create_buttons([
            { id: "misc_subscribers", name: { tls: "menu.botoes.confirmar_notificando" }, type: 2, emoji: client.emoji(6), data: `1|${id_alvo}.${expiracao}` },
            { id: "misc_subscribers", name: { tls: "menu.botoes.apenas_confirmar" }, type: 1, emoji: client.emoji(31), data: `2|${id_alvo}.${expiracao}` },
            { id: "misc_subscribers", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: 0 }
        ], interaction, user)

        return interaction.reply({
            embeds: [embed],
            components: [row],
            flags: "Ephemeral"
        })
    }
}