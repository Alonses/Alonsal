const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sans')
        .setDescription('⌠😂⌡ WrItE LiKe tHaT QuIcKlY')
        .setDescriptionLocalizations({
            "pt-BR": '⌠😂⌡ EsCrEvA DeSsA FoRmA RaPidÃo',
            "es-ES": '⌠😂⌡ EsCrIbE AsI MuY RaPiDo',
            "fr": '⌠😂⌡ ÉcRiVeZ CoMmE CeCi rApIdEmEnT',
            "it": '⌠😂⌡ ScRiVi vElOcEmEnTe cOn qUeStO StIlE'
        })
        .addStringOption(option =>
            option.setName('text')
                .setNameLocalizations({
                    "pt-BR": 'texto',
                    "es-ES": 'texto',
                    "fr": 'texte',
                    "it": 'testo'
                })
                .setDescription('Write something!')
                .setDescriptionLocalizations({
                    "pt-BR": 'Escreva algo!',
                    "es-ES": '¡Escribe algo!',
                    "fr": 'Écris quelque chose!',
                    "it": 'Scrivi qualcosa!'
                })
                .setRequired(true)),
    async execute(client, user, interaction) {

        const texto_entrada = interaction.options.data[0].value.split("")

        for (let i = 0; i < texto_entrada.length; i++)
            if (i % 2 === 0 && i % 1 === 0)
                texto_entrada[i] = texto_entrada[i].toLocaleUpperCase()
            else
                texto_entrada[i] = texto_entrada[i].toLocaleLowerCase()

        interaction.reply({ content: `\`\`\`${texto_entrada.join("").slice(0, 1990)}\`\`\``, ephemeral: true })
    }
}