const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("portal")
        .setDescription("⌠🎲⌡ View the coordinate for a portal")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Veja a coordenada para um portal'
        })
        .addIntegerOption(option =>
            option.setName("x")
                .setDescription("The x position in the current dimension")
                .setDescriptionLocalizations({
                    "pt-BR": 'A posição x na dimensão atual'
                })
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("z")
                .setDescription("The z position in the current dimension")
                .setDescriptionLocalizations({
                    "pt-BR": 'A posição z na dimensão atual'
                })
                .setRequired(true))
        .addStringOption(option =>
            option.setName("destiny")
                .setNameLocalizations({
                    "pt-BR": 'destino'
                })
                .setDescription("Where do you want to go?")
                .setDescriptionLocalizations({
                    "pt-BR": 'Para onde deseja ir?'
                })
                .addChoices(
                    { name: '🍀 Superfície', value: '0' },
                    { name: '🔥 Nether', value: '1' }
                )),
    async execute(client, user, interaction) {

        let x = interaction.options.getInteger("x")
        let z = interaction.options.getInteger("z")

        // Do nether para a superfície ( *8 )
        let operacao = 0, caso = `🍀 Superfície -> 🔥 Nether`, dimension = "na Superfície", to_dimension = "o Nether"

        if (interaction.options.getString("destiny"))
            operacao = parseInt(interaction.options.getString("destiny"))

        if (operacao === 0) { // Para a superfície
            x /= 8, z /= 8

            caso = `🔥 Nether -> 🍀 Superfície`, dimension = "no Nether", to_dimension = "a Superfície"
        } else
            x *= 8, z *= 8

        let x_i = parseInt(x), z_i = parseInt(z)

        x = interaction.options.getInteger("x")
        z = interaction.options.getInteger("z")

        const embed = new EmbedBuilder()
            .setTitle("> Coordenadas de portais")
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`${client.emoji(emojis.mc_portal)} Seu portal principal precisa ser montado nas seguintes coordenadas ${dimension}\`\`\`fix\nX: ${x_i}; Z: ${z_i}\`\`\`\n${client.emoji(emojis.mc_portal_frame)} Um novo portal será criado nas seguintes coordenadas ao atravessar para ${to_dimension}\`\`\`fix\nX: ${x}; Z: ${z}\`\`\`\n:mag: | Habilite as coordenadas apertando F3 (na Edição Java) ou nas configurações de mundo pela Edição Bedrock.\n\n:warning: | Note que os portais precisam ter um distânciamento mínimo entre as coordenadas para que sejam vinculados corretamente, caso existam portais muito próximos, a linkagem entre eles não irá funcionar.`)
            .setFooter({ text: caso, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        interaction.reply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
    }
}