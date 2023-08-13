const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("⌠💂⌡ Remove emojis from the server")
        .addSubcommand(subcommand =>
            subcommand
                .setName("emoji")
                .setDescription("⌠💂⌡ Remove an emoji")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠💂⌡ Remover um emoji',
                    "es-ES": '⌠💂⌡ Eliminar un emoji',
                    "fr": '⌠💂⌡ Supprimer un emoji',
                    "it": '⌠💂⌡ Rimuovi un\'emoji',
                    "ru": '⌠💂⌡ Удалить эмодзи с сервера'
                })
                .addStringOption(option =>
                    option.setName("name")
                        .setNameLocalizations({
                            "pt-BR": 'nome',
                            "es-ES": 'nombre',
                            "fr": 'nom',
                            "it": 'nome',
                            "ru": 'имя'
                        })
                        .setDescription(":the name of the emoji:")
                        .setDescriptionLocalizations({
                            "pt-BR": ":o nome do emoji:",
                            "es-ES": ':el nombre del emoji:',
                            "fr": ':le nom de l\'emoji:',
                            "it": ':il nome dell\'emoji:',
                            "ru": ':название смайлика:'
                        })
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
    async execute(client, user, interaction) {

        const membro_sv = await client.getUserGuild(interaction, client.id())

        // Verificando se o bot pode gerenciar emojis e stickers
        if (!membro_sv.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers))
            // return client.tls.reply(interaction, user, "mode.clear.permissao_2", true, 0)
            return client.tls.reply(interaction, user, "mode.emojis.permissao", true, 3)

        const dados = interaction.options.getString("emoji")

        try { // Removendo um emoji customizado do servidor
            if (dados.startsWith("<") && dados.endsWith(">")) {
                const id = dados.match(/\d{15,}/g)[0]

                // Verificando se o emoji é usado pelo bot
                if (JSON.stringify(emojis).includes(id))
                    return client.tls.reply(interaction, user, "mode.emojis.emoji_reservado", true, 0)

                // Confirmando se o emoji é do servidor e excluindo
                await interaction.guild.emojis.fetch(`${id}`)
                    .then(emoji => {
                        let nome = emoji.name

                        emoji.delete()
                            .then(() =>
                                client.tls.reply(interaction, user, "mode.emojis.emoji_removido", true, 13, nome))
                            .catch(() =>
                                client.tls.reply(interaction, user, "mode.emojis.emoji_error_remover", true, 0)
                            )
                    })
                    .catch(() => {
                        return client.tls.reply(interaction, user, "mode.emojis.emoji_estrangeiro", true, 1)
                    })
            } else
                return client.tls.reply(interaction, user, "mode.emojis.emoji_custom_remover", true, 2)
        } catch {
            return client.tls.reply(interaction, user, "mode.emojis.emoji_custom_remover", true, 2)
        }
    }
}