const { SlashCommandBuilder, Permissions } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('⌠💂⌡ Bloqueia o canal'),
	async execute(client, interaction) {

        return interaction.reply({ content: "Um comando bem enceirado vem ai...", ephemeral: true })

        const { moderacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction.guild.id)}.json`)

        const permissions_user = interaction.channel.permissionsFor(interaction.member)
        const permissions_bot = await interaction.guild.members.fetch(interaction.client.user.id)

        if (!permissions_user.has("MANAGE_CHANNELS"))
            return interaction.reply({ content: `:octagonal_sign: | ${moderacao[7]["permissao_1"]}`, ephemeral: true })

        if (!permissions_bot.permissions.has("MANAGE_CHANNELS") || !permissions_bot.permissions.has("MANAGE_ROLES"))
            return interaction.reply({ content: `:octagonal_sign: | ${moderacao[7]["permissao_2"]}`, ephemeral: true })

        // Bloqueando o chat
        const msg_retorno = `:lock: | ${moderacao[7]["canal"]} **${interaction.channel.name}** ${moderacao[7]["lock"]}`
        
        interaction.channel.permissionOverwrites.set([
            {
                id: interaction.guild.id,
                deny: [Permissions.FLAGS.SEND_MESSAGES]
            },
            {
                id: client.user.id,
                allow: [Permissions.FLAGS.SEND_MESSAGES]
            }
        ])
        .then(() => {
            interaction.reply(msg_retorno)
        })
    }
}