const { SlashCommandBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dice")
        .setNameLocalizations({
            "pt-BR": 'dado',
            "es-ES": 'dado',
            "fr": 'des',
            "it": 'dadi',
            "ru": 'отданный'
        })
        .setDescription("⌠🎲⌡ Roll one or more dice")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Rodar um ou vários dados',
            "es-ES": '⌠🎲⌡ Rotar uno o más dados',
            "fr": '⌠🎲⌡ Tourner un ou plusieurs dés',
            "it": '⌠🎲⌡ Tira uno o più dadi',
            "ru": '⌠🎲⌡ Поверните один или несколько кубиков'
        })
        .addIntegerOption(option =>
            option.setName("amount")
                .setNameLocalizations({
                    "pt-BR": 'quantia',
                    "es-ES": 'monto',
                    "fr": 'montant',
                    "it": 'quantita',
                    "ru": 'количество'
                })
                .setDescription("The amount of dice to roll")
                .setDescriptionLocalizations({
                    "pt-BR": 'A quantia de dados para rolar',
                    "es-ES": 'La cantidad de dados a tirar',
                    "fr": 'Le nombre de dés à lancer',
                    "it": 'La quantità di dadi da lanciare',
                    "ru": 'Количество костей для броска'
                })
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("faces")
                .setNameLocalizations({
                    "es-ES": 'caras',
                    "fr": 'visages',
                    "it": 'facce',
                    "ru": 'лица'
                })
                .setDescription("Number of dice faces")
                .setDescriptionLocalizations({
                    "pt-BR": 'Número da faces dos dados',
                    "es-ES": 'Número de caras de dados',
                    "fr": 'Nombre de faces de dés',
                    "it": 'Numero di facce dei dadi',
                    "ru": 'Количество граней игральных костей'
                })
                .setMinValue(4)
                .setMaxValue(120)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("accrual")
                .setNameLocalizations({
                    "pt-BR": 'acrescimo',
                    "es-ES": 'agregar',
                    "fr": 'ajouter',
                    "it": 'inserisci',
                    "ru": 'добавить'
                })
                .setDescription("add in the sum")
                .setDescriptionLocalizations({
                    "pt-BR": 'acrescentar a somatória',
                    "es-ES": 'agregar la suma',
                    "fr": 'ajouter la somme',
                    "it": 'aggiungi la somma',
                    "ru": 'добавить к сумме'
                })
                .setMinValue(1)
                .setMaxValue(50000)),
    async execute(client, user, interaction) {

        const qtd_dados = interaction.options.data[0].value
        const qtd_faces = interaction.options.data[1].value
        let acrescimo = 0

        // Valor para adicionar a somatória caso informado
        if (interaction.options.data.length == 3)
            acrescimo = interaction.options.data[2].value

        const faces = []
        let somatoria = 0

        for (let i = 1; i < qtd_dados + 1; i++) {

            const num = Math.round(qtd_faces * Math.random())
            somatoria += num

            if (i < qtd_dados)
                faces.push(`${num}, `)
            else
                faces.push(num)

            if (qtd_dados < 40) {
                if (i % 4 === 0 && i !== 0)
                    faces.push("\n")
            } else
                if (i % 10 === 0 && i !== 0)
                    faces.push("\n")
        }

        if (acrescimo > 0)
            somatoria = `[ ${somatoria} ] + ${acrescimo} ⇁ ${(somatoria + acrescimo).toLocaleString("pt-BR")}`
        else
            somatoria = somatoria.toLocaleString("pt-BR")

        interaction.reply({ content: `${client.emoji(emojis.dice)} ${qtd_dados}d${qtd_faces} | \`${somatoria}\` |\n\`\`\`${faces.join("")}\`\`\``, ephemeral: user.misc.ghost_mode })
    }
}