const { SlashCommandBuilder } = require('discord.js')

const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { emojis_dancantes, emojis_negativos } = require('../../arquivos/json/text/emojis.json')

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
                            { name: 'Random B$500', value: '3.10'}
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
                .addNumberOption(option => option.setName("r").setDescription("Valor pro R").setRequired(true))
                .addNumberOption(option => option.setName("g").setDescription("Valor pro G").setRequired(true))
                .addNumberOption(option => option.setName("b").setDescription("Valor pro B").setRequired(true))),
    async execute(client, interaction) {

        const { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.custom.getUser(interaction.user.id), precos = [200, 300, 400, 500], colors = ['0x7289DA', '0xD62D20', '0xFFD319', '0x36802D', '0xFFFFFF', '0xF27D0C', '0x44008B', '0x000000', '0x29BB8E', '0x2F3136', 'RANDOM']
        let preco, entrada = "", new_color, epic_embed_fail = busca_emoji(client, emojis_negativos)

        if (interaction.options.getSubcommand() === "static") {
            entrada = interaction.options.data[0].options[0].value

            preco = precos[entrada.split(".")[0]]

            if (user.color == colors[entrada.split(".")[1]])
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

            if (user.color == new_color)
                return interaction.reply({ content: `:passport_control: | ${customizacao[1]["cor_ativa"]}`, ephemeral: true })
        }

        // Validando se o usuário tem dinheiro suficiente
        if (user.money < preco)
            return interaction.reply({ content: `${epic_embed_fail} | ${customizacao[1]["sem_money"].replace("preco_repl", preco.toLocaleString("pt-BR"))}`, ephemeral: true })

        const emoji_dancando = busca_emoji(client, emojis_dancantes)
        user.money -= parseInt(preco)

        if (interaction.options.getSubcommand() === "static")
            user.color = colors[entrada.split(".")[1]]
        else // Salvando a cor customizada
            user.color = new_color

        // Salvando os dados
        client.custom.saveUser(user)

        interaction.reply({ content: `${emoji_dancando} | ${customizacao[1]["cor_att"]}`, ephemeral: true })
    }
}

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? `0${hex}` : hex
}

function rgbToHex(r, g, b) { return `0x${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}` }