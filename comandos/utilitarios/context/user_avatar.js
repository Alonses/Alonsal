const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
    menu_data: new ContextMenuCommandBuilder()
        .setName("Avatar")
        .setType(ApplicationCommandType.User),
    async menu(client, user, interaction) {

        // Redirecionando o evento
        require("../subcommands/user_avatar")({ client, user, interaction })
    }
}