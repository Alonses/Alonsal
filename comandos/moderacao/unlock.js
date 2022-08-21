const { SlashCommandBuilder, Permissions } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlock')
		.setDescription('⌠💂⌡ Desbloqueia o canal'),
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
        const msg_retorno = `:unlock: | ${moderacao[7]["canal"]} **${message.channel.name}** ${moderacao[7]["unlock"]}`
        
        interaction.channel.permissionOverwrites.set([
            {
                id: interaction.guild.id,
                allow: [Permissions.FLAGS.SEND_MESSAGES]
            }
        ])
        .then(() => interaction.reply(msg_retorno))
    }
}