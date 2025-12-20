const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { busca_badges } = require('../../core/data/user_badges')
const { badgeTypes } = require('../../core/formatters/patterns/user')

const BADGE_CHOICES = [
    { name: 'Tester', value: '0' },
    { name: 'Debugger', value: '1' },
    { name: 'Programmer', value: '2' },
    { name: 'Creator', value: '3' },
    { name: 'Waxed', value: '4' },
    { name: 'Donater', value: '5' },
    { name: 'Puler', value: '6' },
    { name: 'Rosquer', value: '7' },
    { name: 'Pionner', value: '8' },
    { name: 'Reporter', value: '10' },
    { name: 'Sugestor', value: '13' }
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_badge")
        .setDescription("⌠🤖⌡ Conceder badge a um usuário")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("O usuário alvo")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("badge")
                .setDescription("A badge que será atribuida")
                .addChoices(...BADGE_CHOICES)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute({ client, user, interaction }) {

        // Validando permissões
        if (!client.x.owners.includes(interaction.user.id)) return

        const targetUserId = interaction.options.getUser("usuario").id
        const targetBadgeId = parseInt(interaction.options.getString("badge"))

        // Buscando badges do usuário
        const userBadges = await client.getUserBadges(client.encrypt(targetUserId))
        const userBadgeIds = userBadges.map(badge => parseInt(badge.badge))

        // Verificando se o usuário já possui a badge
        if (userBadgeIds.includes(targetBadgeId)) {
            return interaction.reply({
                content: `:octagonal_sign: | O usuário <@!${targetUserId}> já possui a Badge mencionada!`,
                flags: "Ephemeral"
            })
        }

        // Buscando informações da badge
        const badge = busca_badges(client, badgeTypes.SINGLE, targetBadgeId)

        // Criando um embed com as informações para aprovação da nova badge
        const embed = client.create_embed({
            title: "> Conceder nova Badge",
            fields: [
                {
                    name: `${client.defaultEmoji("person")} **Destinatário**`,
                    value: `<@${targetUserId}>`,
                    inline: true
                },
                {
                    name: ":label: **Badge**",
                    value: `${badge.emoji} \`${badge.name}\``,
                    inline: true
                },
                {
                    name: `${client.defaultEmoji("time")} **Concessão**`,
                    value: `<t:${client.execute("timestamp")}:f>`,
                    inline: true
                }
            ],
            footer: {
                text: { tls: "menu.botoes.selecionar_operacao" },
                iconURL: interaction.user.avatarURL({ dynamic: true })
            }
        }, user)

        // Criando botões do menu para aprovação
        const row = client.create_buttons([
            {
                id: "misc_badges",
                name: { tls: "menu.botoes.confirmar_notificando" },
                type: 1,
                emoji: client.emoji(6),
                data: `1|${targetUserId}.${targetBadgeId}`
            },
            {
                id: "misc_badges",
                name: { tls: "menu.botoes.apenas_confirmar" },
                type: 0,
                emoji: client.emoji(31),
                data: `2|${targetUserId}.${targetBadgeId}`
            },
            {
                id: "misc_badges",
                name: { tls: "menu.botoes.cancelar" },
                type: 3,
                emoji: client.emoji(0),
                data: 0
            }
        ], interaction, user)

        return interaction.reply({
            embeds: [embed],
            components: [row],
            flags: "Ephemeral"
        })
    }
}