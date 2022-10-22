const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const create_buttons = require('../../adm/discord/create_buttons')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setNameLocalizations({
            "pt-BR": 'color',
            "es-ES": 'color',
            "fr": 'couleur'
        })
        .setDescription('⌠🎉⌡ Change your color')
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎉⌡ Altere sua cor',
            "es-ES": '⌠🎉⌡ Cambia tu color',
            "fr": '⌠🎉⌡ Change ta couleur'
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName('static')
                .setDescription('⌠🎉⌡ Pre-defined colors')
                .setDescriptionLocalizations({
                    "pt-BR": 'Cores pré-definidas',
                    "es-ES": 'Colores preestablecidos',
                    "fr": 'Couleurs prédéfinies'
                })
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('Change your profile color')
                        .setDescriptionLocalizations({
                            "pt-BR": 'Alterar a cor do seu perfil',
                            "es-ES": 'Cambia el color de tu perfil',
                            "fr": 'Changer la couleur de votre profil'
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
                .setName('custom')
                .setDescription('⌠🎉⌡ Choose your color!')
                .setDescriptionLocalizations({
                    "pt-BR": 'Escolha sua cor!',
                    "es-ES": '¡Elige tu color!',
                    "fr": 'Choisissez votre couleur!'
                })
                .addNumberOption(option => option.setName("r").setDescription("R").setRequired(true))
                .addNumberOption(option => option.setName("g").setDescription("G").setRequired(true))
                .addNumberOption(option => option.setName("b").setDescription("B").setRequired(true))),
    async execute(client, interaction) {

        const { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.usuarios.getUser(interaction.user.id), precos = [200, 300, 400, 500], colors = ['0x7289DA', '0xD62D20', '0xFFD319', '0x36802D', '0xFFFFFF', '0xF27D0C', '0x44008B', '0x000000', '0x29BB8E', '0x2F3136', 'RANDOM']
        let preco, entrada = "", new_color

        formata_num = (valor) => valor.toLocaleString("pt-BR", { minimunFractionDigits: 2 })

        if (interaction.options.getSubcommand() === "static") {
            entrada = interaction.options.data[0].options[0].value

            preco = precos[entrada.split(".")[0]]

            if (user.misc.color == colors[entrada.split(".")[1]])
                return interaction.reply({ content: `:passport_control: | ${customizacao[1]["cor_ativa"]}`, ephemeral: true })
        } else { // Cor customizada

            const rgb = {
                r: null,
                g: null,
                b: null
            }

            let entradas = interaction.options.data[0].options, valor_invalido = false

            // Validando os valores de entrada customizados
            entradas.forEach(valor => {
                if (valor.value < 0 || valor.value > 255)
                    valor_invalido = true

                if (valor.name == "r")
                    rgb.r = valor.value

                if (valor.name == "g")
                    rgb.g = valor.value

                if (valor.name == "b")
                    rgb.b = valor.value
            })

            if (valor_invalido)
                return interaction.reply({ content: customizacao[1]["error"], ephemeral: true })

            // Convertendo do RGB para HEX
            new_color = rgbToHex(rgb.r, rgb.g, rgb.b)
            preco = 50

            if (user.misc.color == new_color)
                return interaction.reply({ content: `:passport_control: | ${customizacao[1]["cor_ativa"]}`, ephemeral: true })
        }

        let cor_demonstracao = entrada.split(".")[1] == 10 ? alea_hex() : colors[entrada.split(".")[1]]
        let nota_cor_aleatoria = ""

        // Cor customizada
        if (interaction.options.getSubcommand() == "custom"){
            cor_demonstracao = new_color
            entrada = "4.0"
        }

        if (entrada.split(".")[1] == 10)
            nota_cor_aleatoria = `\n:rainbow: ${customizacao[1]["rand_color"]}`

        // Enviando o embed para validação
        const embed = new EmbedBuilder()
            .setTitle(customizacao[1]["titulo"])
            .setDescription(`\`\`\`${customizacao[1]["descricao"]}\`\`\`${nota_cor_aleatoria}`)
            .setColor(cor_demonstracao)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setFooter({ text: customizacao[1]["footer"], iconURL: client.user.avatarURL({ dynamic: true }) })

        const row = create_buttons([{ name: `Confirmar:${entrada}-${new_color}`, value: '1', type: 2 }, { name: 'Cancelar:0.0', value: '0', type: 3 }], interaction)

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? `0${hex}` : hex
}

function rgbToHex(r, g, b) { return `0x${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}` }

function alea_hex() { return rgbToHex(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)) }