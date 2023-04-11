const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../adm/data/badges')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_badge")
        .setDescription("⌠🤖⌡ Atribuir badges a usuários")
        .addStringOption(option =>
            option.setName("id")
                .setDescription("O ID do usuário alvo")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("badge")
                .setDescription("A badge que será atribuida")
                .addChoices(
                    { name: 'Tester', value: '0' },
                    { name: 'Debugger', value: '1' },
                    { name: 'Programmer', value: '2' },
                    { name: 'Creator', value: '3' },
                    { name: 'Waxed', value: '4' },
                    { name: 'Donater', value: '5' },
                    { name: 'Puler', value: '6' },
                    { name: 'Rosquer', value: '7' },
                    { name: 'Pionner', value: '8' }
                )
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        let entradas = interaction.options.data, id_alvo, badge_alvo

        entradas.forEach(valor => {
            if (valor.name === "id")
                id_alvo = valor.value

            if (valor.name === "badge")
                badge_alvo = parseInt(valor.value)
        })

        const all_badges = []

        const badges_user = await client.getUserBadges(id_alvo)

        if (badges_user.length > 0)
            badges_user.forEach(valor => {
                all_badges.push(parseInt(valor.badge)) // Listando todas as badges que o usuário possui
            })

        if (!all_badges.includes(badge_alvo)) { // Atribuindo uma nova badge a um usuário

            const badge = busca_badges(client, badgeTypes.SINGLE, parseInt(badge_alvo))

            const embed = new EmbedBuilder()
                .setTitle("> Conceder Badge")
                .setColor(client.embed_color(user.misc.color))
                .addFields(
                    {
                        name: `**${client.defaultEmoji("person")} Destinatário**`,
                        value: `<@${id_alvo}>`,
                        inline: true
                    },
                    {
                        name: `**:label: Badge**`,
                        value: `${badge.emoji} \`${badge.name}\``,
                        inline: true
                    },
                    {
                        name: `**${client.defaultEmoji("clock")} Aplicação**`,
                        value: `<t:${client.timestamp()}:f>`,
                        inline: true
                    }
                )
                .setFooter({ text: "Selecione a operação desejada nos botões abaixo.", iconURL: interaction.user.avatarURL({ dynamic: true }) })

            // Criando os botões para o menu de badges
            const row = client.create_buttons([{ name: `Confirmar e notificar:badges.[${badge_alvo}]`, value: '1', type: 2, badge: id_alvo }, { name: `Confirmar silenciosamente:badges.[${badge_alvo}]`, value: '0', type: 1, badge: id_alvo }, { name: 'Cancelar:badges', value: '0', type: 3 }], interaction)

            return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
        } else
            interaction.reply({ content: `:octagonal_sign: | O usuário <@!${id_alvo}> já possui a Badge mencionada!`, ephemeral: true })
    }
}