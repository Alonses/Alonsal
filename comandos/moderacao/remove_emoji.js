const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("⌠💂⌡ Remove emojis from the server")
        .setDescriptionLocalizations({
            "pt-BR": '⌠💂⌡ Remove emojis do servidor'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName("emoji")
                .setDescription("⌠💂⌡ Remover um emoji")
                .addStringOption(option =>
                    option.setName("nome")
                        .setDescription("O nome do emoji")
                        .setRequired(true)))
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName("figurinha")
        //         .setDescription("⌠💂⌡ Remover uma figurinha")
        //         .addStringOption(option =>
        //             option.setName("nome")
        //                 .setDescription("O nome da figurinha")))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
    async execute(client, user, interaction) {

        const membro_sv = await interaction.guild.members.cache.get(client.id())

        // Verificando se o bot pode gerenciar emojis e stickers
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers))
            // return client.tls.reply(interaction, user, "mode.clear.permissao_2", true, 0)
            return interaction.reply({ content: "💂 | Eu não posso gerenciar os emojis e figurinhas deste servidor.", ephemeral: true })

        const dados = interaction.options.data[0].options[0].value

        try { // Removendo um emoji customizado do servidor
            if (dados.startsWith("<") && dados.endsWith(">")) {
                const id = dados.match(/\d{15,}/g)[0]

                // Verificando se o emoji é usado pelo bot
                if (JSON.stringify(emojis).includes(id))
                    return interaction.reply({ content: ":octagonal_sign: | Este emoji é usado por mim! Não podemos remover ele seu cornu.", ephemeral: true })

                // Confirmando se o emoji é do servidor e excluindo
                await interaction.guild.emojis.fetch(`${id}`)
                    .then(emoji => {
                        let nome = emoji.name

                        emoji.delete()
                            .then(() =>
                                interaction.reply({ content: `:wastebasket: | O emoji \`${nome}\` foi removido do servidor!`, ephemeral: true }))
                            .catch(() =>
                                interaction.reply({ content: ":octagonal_sign: | Não foi possível remover este emoji", ephemeral: true })
                            )
                    })
                    .catch(err => {
                        console.log(err)
                        return interaction.reply({ content: `:mag: | Este emoji não pertence a este servidor!\nPor favor, tente novamente`, ephemeral: true })
                    })
            } else
                return interaction.reply({ content: ":warning: | Informe um emoji customizado para adicionar", ephemeral: true })
        } catch (err) {
            return interaction.reply({ content: ":warning: | Informe um emoji customizado para adicionar", ephemeral: true })
        }
    }
}