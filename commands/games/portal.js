const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("portal")
        .setDescription("⌠🎲⌡ View the coordinate for a portal")
        .setDescriptionLocalizations({
            "de": '⌠🎲⌡ Sehen Sie sich die Koordinaten eines Portals an',
            "es-ES": '⌠🎲⌡ Ver las coordenadas de un portal',
            "fr": '⌠🎲⌡ Voir les coordonnées d\'un portail',
            "it": '⌠🎲⌡ Vedi le coordinate di un portale',
            "pt-BR": '⌠🎲⌡ Veja a coordenada para um portal',
            "ru": '⌠🎲⌡ Посмотреть координаты портала',
        })
        .addIntegerOption(option =>
            option.setName("x")
                .setDescription("The x position in the current dimension")
                .setDescriptionLocalizations({
                    "de": 'Die Position von x in der aktuellen Dimension',
                    "es-ES": 'La posición de x en la dimensión actual.',
                    "fr": 'La position de x dans la dimension actuelle',
                    "it": 'La posizione di x nella dimensione corrente',
                    "pt-BR": 'A posição x na dimensão atual',
                    "ru": 'Положение x в текущем измерении'
                })
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("z")
                .setDescription("The z position in the current dimension")
                .setDescriptionLocalizations({
                    "de": 'Die Position von z in der aktuellen Dimension',
                    "es-ES": 'La posición de z en la dimensión actual.',
                    "fr": 'La position de z dans la dimension actuelle',
                    "it": 'La posizione di z nella dimensione corrente',
                    "pt-BR": 'A posição z na dimensão atual',
                    "ru": 'Положение z в текущем измерении'
                })
                .setRequired(true))
        .addStringOption(option =>
            option.setName("destiny")
                .setNameLocalizations({
                    "de": 'ziel',
                    "es-ES": 'destino',
                    "fr": 'destin',
                    "it": 'destino',
                    "pt-BR": 'destino',
                    "ru": 'судьба',
                })
                .setDescription("Where do you want to go?")
                .setDescriptionLocalizations({
                    "de": 'Wohin willst du gehen?',
                    "es-ES": '¿A donde quieres ir?',
                    "fr": 'Où veux-tu aller?',
                    "it": 'Dove vuoi andare?',
                    "pt-BR": 'Para onde deseja ir?',
                    "ru": 'Куда ты хочешь пойти?'
                })
                .addChoices(
                    { name: '🍀 Overworld', value: '0' },
                    { name: '🔥 Nether', value: '1' }
                )),
    async execute({ client, user, interaction }) {

        let x = interaction.options.getInteger("x")
        let z = interaction.options.getInteger("z")

        // Do nether para a superfície ( *8 )
        let operacao = 0, caso = `🍀 ${client.tls.phrase(user, "game.portal.superficie")} -> 🔥 Nether`, dimension = client.tls.phrase(user, "game.portal.na_superficie"), to_dimension = client.tls.phrase(user, "game.portal.o_nether")

        if (interaction.options.getString("destiny"))
            operacao = parseInt(interaction.options.getString("destiny"))

        if (operacao === 0) { // Para a superfície
            x /= 8, z /= 8

            caso = `🔥 Nether -> 🍀 ${client.tls.phrase(user, "game.portal.superficie")}`, dimension = client.tls.phrase(user, "game.portal.no_nether"), to_dimension = client.tls.phrase(user, "game.portal.a_superficie")
        } else
            x *= 8, z *= 8

        let x_i = parseInt(x), z_i = parseInt(z)

        x = interaction.options.getInteger("x")
        z = interaction.options.getInteger("z")

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "game.portal.titulo"))
            .setColor(client.embed_color(user.misc.color))
            .setDescription(client.replace(client.tls.phrase(user, "game.portal.descricao"), [client.emoji("mc_portal"), dimension, x_i, z_i, client.emoji("mc_portal_frame"), to_dimension, x, z]))
            .setFooter({
                text: caso,
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        interaction.reply({
            embeds: [embed],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }
}