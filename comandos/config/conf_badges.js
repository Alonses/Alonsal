const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
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
                    { name: 'Rosquer', value: '7' }
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

        if (user.badges.badge_list.length > 0)
            user.badges.badge_list.forEach(valor => {
                all_badges.push(parseInt(Object.keys(valor)[0])) // Listando todas as badges que o usuário possui
            })

        if (!all_badges.includes(badge_alvo)) { // Adicionando uma nova badge

            const date1 = new Date()
            user.badges.badge_list.push({ key: badge_alvo, value: Math.floor(date1.getTime() / 1000) })
            user.save()

            const badge = busca_badges(client, badgeTypes.SINGLE, parseInt(badge_alvo))

            client.discord.users.fetch(id_alvo, false).then(async (user_interno) => {

                let alvo = await client.getUser(user_interno.id)

                user_interno.send(`${client.emoji(emojis_dancantes)} | ${client.tls.phrase(alvo, "dive.badges.new_badge").replace("nome_repl", badge.name).replace("emoji_repl", badge.emoji)}`)

                interaction.reply({ content: `${client.emoji(emojis_dancantes)} | Badge \`${badge.name}\` ${badge.emoji} atribuída ao usuário ${user_interno}!`, ephemeral: true })
            })
        } else
            interaction.reply({ content: `:octagonal_sign: | O usuário <@!${id_alvo}> já possui a Badge mencionada!`, ephemeral: true })
    }
}