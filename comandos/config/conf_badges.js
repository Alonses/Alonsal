const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { existsSync } = require('fs')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../../adm/discord/busca_emoji.js')
const {busca_badges, badgeTypes} = require('../../adm/data/badges');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_badge')
        .setDescription('⌠🤖⌡ Atribuir badges a usuários')
        .addStringOption(option =>
            option.setName('id')
                .setDescription("O ID do usuário alvo")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('badge')
                .setDescription('A badge que será atribuida')
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
    async execute(client, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        let entradas = interaction.options.data, id_alvo, badge_alvo

        entradas.forEach(valor => {
            if (valor.name === "id")
                id_alvo = valor.value

            if (valor.name === "badge")
                badge_alvo = parseInt(valor.value)
        })

        const user = client.usuarios.getUser(id_alvo), all_badges = []

        if (user.badges.badge_list.length > 0)
            user.badges.badge_list.forEach(valor => {
                all_badges.push(parseInt(Object.keys(valor)[0])) // Listando todas as badges que o usuário possui
            })

        if (!all_badges.includes(badge_alvo)) { // Adicionando uma nova badge

            const date1 = new Date()
            user.badges.badge_list.push(constructJson(badge_alvo, Math.floor(date1.getTime() / 1000)))

            const badge = busca_badges(client, badgeTypes.SINGLE, parseInt(badge_alvo));
            const emoji_dancante = busca_emoji(client, emojis_dancantes)

            client.usuarios.saveUser([user])

            client.discord.users.fetch(user.id, false).then((user_interno) => {

                user_interno.send(`${emoji_dancante} | ${client.tls.phrase(client, user.id, "dive.badges.new_badge").replace("nome_repl", badge.name).replace("emoji_repl", badge.emoji)}`)

                interaction.reply({ content: `${emoji_dancante} | Badge \`${badge.name}\` ${badge.emoji} atribuída ao usuário ${user_interno}!`, ephemeral: true })
            })
        } else
            interaction.reply({ content: `:octagonal_sign: | O usuário <@!${user.id}> já possui a Badge mencionada!`, ephemeral: true })
    }
}

function constructJson(jsonGuild, arrayValores) {
    return { [jsonGuild]: arrayValores }
}