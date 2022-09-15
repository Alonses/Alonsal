const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { existsSync, mkdirSync, writeFileSync } = require('fs')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
const busca_emoji = require('../../adm/funcoes/busca_emoji.js')
const busca_badges = require('../../adm/funcoes/busca_badges.js')

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
                    { name: 'Waxed', value: '4' }
                )
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        const user = {
            id: null,
            badge: null,
            fixed_badge: null,
            badge_list: []
        }

        const all_badges = []

        let entradas = interaction.options.data
        const emoji_dancante = busca_emoji(client, emojis_dancantes)

        entradas.forEach(valor => {
            if (valor.name == "id")
                user.id = valor.value

            if (valor.name == "badge")
                user.badge = parseInt(valor.value)
        })

        const badge = busca_emoji(client, busca_badges(client, 'single', parseInt(user.badge))[0])
        const badge_name = busca_badges(client, 'single', parseInt(user.badge))[1]

        // Criando o JSON para o usuário da badge
        if (!existsSync(`./arquivos/data/badges/${user.id}`))
            mkdirSync(`./arquivos/data/badges/${user.id}`, { recursive: true })

        if (existsSync(`./arquivos/data/badges/${user.id}/badges.json`)) {
            delete require.cache[require.resolve(`../../arquivos/data/badges/${user.id}/badges.json`)]
            const { fixed_badge, badge_list } = require(`../../arquivos/data/badges/${user.id}/badges.json`)

            user.fixed_badge = fixed_badge

            badge_list.forEach(valor => {
                user.badge_list.push(valor)
                all_badges.push(parseInt(Object.keys(valor)[0])) // Listando todas as badges que o usuário possui
            })
        }

        const date1 = new Date()
        if (!all_badges.includes(user.badge)) // Adicionando uma nova badge
            user.badge_list.push(constructJson(user.badge, Math.floor(date1.getTime() / 1000)))

        writeFileSync(`./arquivos/data/badges/${user.id}/badges.json`, JSON.stringify(user))
        delete require.cache[require.resolve(`../../arquivos/data/badges/${user.id}/badges.json`)]

        client.users.fetch(user.id, false).then((user_interno) => {
            user_interno.send(`${emoji_dancante} | Você acabou de ganhar uma Badge! O \`${badge_name}\` ${badge}! Ele será exibido em seu perfil ao usarem o comando \`/user info\`\n\nVocê também pode fixar Badges em destaque com o comando \`/badges\`!`)

            interaction.reply({ content: `${emoji_dancante} | Badge \`${badge_name}\` ${badge} atribuída ao usuário ${user_interno}!`, ephemeral: true })
        })
    }
}

function constructJson(jsonGuild, arrayValores) {
    return { [jsonGuild]: arrayValores }
}