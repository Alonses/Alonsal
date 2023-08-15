const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const { getVotes } = require('../../adm/database/schemas/Vote')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("c_vote")
        .setDescription("⌠🤖⌡ Verificar os resultados da votação")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, user, interaction) {

        if (!client.owners.includes(interaction.user.id)) return

        const votos = await getVotes()

        interaction.reply({
            content: `${client.emoji(emojis_dancantes)} | Votos computados até o momento\n\n:flag_de: \`${votos?.de || 0}\`, :flag_nl: \`${votos?.nl || 0}\`, :flag_se: \`${votos?.se || 0}\`\n:flag_tr: \`${votos?.tr || 0}\`, :flag_jp: \`${votos?.jp || 0}\``,
            ephemeral: true
        })
    }
}