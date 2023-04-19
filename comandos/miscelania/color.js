const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { rgbToHex } = require('../../adm/funcoes/hex_color')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("color")
        .setDescription("⌠🎉⌡ Change your color")
        .setNameLocalizations({
            "pt-BR": 'color',
            "es-ES": 'color',
            "fr": 'couleur',
            "it": 'colore',
            "ru": 'цвет'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName("static")
                .setDescription("⌠🎉⌡ Pre-defined colors")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠🎉⌡ Cores pré-definidas',
                    "es-ES": '⌠🎉⌡ Colores preestablecidos',
                    "fr": '⌠🎉⌡ Couleurs prédéfinies',
                    "it": '⌠🎉⌡ Colori preimpostati',
                    "ru": '⌠🎉⌡ Предопределенные цвета'
                })
                .addStringOption(option =>
                    option.setName("color")
                        .setDescription("Change your profile color")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Alterar a cor do seu perfil',
                            "es-ES": 'Cambia el color de tu perfil',
                            "fr": 'Changer la couleur de votre profil',
                            "it": 'Cambia il colore del tuo profilo',
                            "ru": 'Изменить цвет профиля'
                        })
                        .addChoices(
                            { name: 'Blue B$200', value: '0.0' },
                            { name: 'Red B$200', value: '0.1' },
                            { name: 'Green B$200', value: '0.3' },
                            { name: 'Cyan B$200', value: '0.8' },
                            { name: 'Yellow B$300', value: '1.2' },
                            { name: 'Orange B$300', value: '1.5' },
                            { name: 'Purple B$300', value: '2.6' },
                            { name: 'Gray B$300', value: '1.9' },
                            { name: 'White B$400', value: '2.4' },
                            { name: 'Black B$400', value: '2.7' },
                            { name: 'Random B$500', value: '3.10' }
                        )
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("custom")
                .setDescription("⌠🎉⌡ Choose your color!")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠🎉⌡ Escolha sua cor!',
                    "es-ES": '⌠🎉⌡ ¡Elige tu color!',
                    "fr": '⌠🎉⌡ Choisissez votre couleur!',
                    "it": '⌠🎉⌡ Scegli il tuo colore!',
                    "ru": '⌠🎉⌡ Выбери свой цвет!'
                })
                .addNumberOption(option => option.setName("r").setDescription("R").setRequired(true).setMaxValue(255).setMinValue(0))
                .addNumberOption(option => option.setName("g").setDescription("G").setRequired(true).setMaxValue(255).setMinValue(0))
                .addNumberOption(option => option.setName("b").setDescription("B").setRequired(true).setMaxValue(255).setMinValue(0))),
    async execute(client, user, interaction) {

        const colors = ['7289DA', 'D62D20', 'FFD319', '36802D', 'FFFFFF', 'F27D0C', '44008B', '000000', '29BB8E', '2F3136', 'RANDOM']
        let entrada = "", new_color

        // Cor pré-definida
        if (interaction.options.getSubcommand() === "static") {
            entrada = interaction.options.getString("color")

            if (user.misc.color === colors[entrada.split(".")[1]])
                return client.tls.reply(interaction, user, "misc.color.cor_ativa", true, 7)
        } else { // Cor customizada

            const rgb = {
                r: interaction.options.getNumber("r"),
                g: interaction.options.getNumber("g"),
                b: interaction.options.getNumber("b")
            }

            // Convertendo do RGB para HEX
            new_color = rgbToHex(rgb.r, rgb.g, rgb.b)

            if (user.misc.color === new_color)
                return client.tls.reply(interaction, user, "misc.color.cor_ativa", true, 7)
        }

        let cor_demonstracao = entrada.split(".")[1] === "10" ? client.embed_color("RANDOM") : colors[entrada.split(".")[1]]
        let nota_cor_aleatoria = ""

        // Cor customizada
        if (interaction.options.getSubcommand() === "custom") {
            cor_demonstracao = new_color
            entrada = "4.0"
        }

        if (entrada.split(".")[1] === 10)
            nota_cor_aleatoria = `\n:rainbow: ${client.tls.phrase(user, "misc.color.rand_color")}`

        // Enviando o embed para validação
        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "misc.color.titulo"))
            .setDescription(`\`\`\`${client.tls.phrase(user, "misc.color.descricao")}\`\`\`${nota_cor_aleatoria}`)
            .setColor(cor_demonstracao)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setFooter({ text: client.tls.phrase(user, "misc.color.footer"), iconURL: client.discord.user.avatarURL({ dynamic: true }) })

        // Criando os botões para a cor customizada
        const row = client.create_buttons([{ name: `Confirmar:${entrada}-${new_color}`, value: '1', type: 2 }, { name: 'Cancelar:0.0', value: '0', type: 3 }], interaction)

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}