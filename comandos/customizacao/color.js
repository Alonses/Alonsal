const { SlashCommandBuilder } = require('discord.js')

const busca_emoji = require('../../adm/funcoes/busca_emoji')
const { emojis_dancantes, emojis_negativos } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setNameLocalizations({
            "pt-BR": 'cor',
            "es-ES": 'color',
            "fr": 'couleur'
        })
        .setDescription('⌠🎉⌡ Change your color')
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎉⌡ Altere sua cor',
            "es-ES": '⌠🎉⌡ Cambia tu color',
            "fr": '⌠🎉⌡ Change ta couleur'
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
                    { name: 'Blue B$250', value: '0.0' },
                    { name: 'Red B$250', value: '0.1' },
                    { name: 'Green B$250', value: '0.3' },
                    { name: 'Cyan B$250', value: '0.8' },
                    { name: 'Yellow B$350', value: '1.2' },
                    { name: 'Orange B$350', value: '1.5' },
                    { name: 'Purple B$350', value: '2.6' },
                    { name: 'Gray B$350', value: '1.9' },
                    { name: 'White B$500', value: '2.4' },
                    { name: 'Black B$500', value: '2.7' }
                )
                .setRequired(true)),
    async execute(client, interaction) {

        const { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)
        const user = client.custom.getUser(interaction.user.id)
        let entrada = interaction.options.data[0].value

        const precos = [250, 350, 500, 1000], colors = ['0x7289DA', '0xD62D20', '0xFFD319', '0x36802D', '0xFFFFFF', '0xF27D0C', '0x44008B', '0x000000', '0x29BB8E', '0x2F3136']

        let preco = precos[entrada.split(".")[0]]
        let epic_embed_fail = busca_emoji(client, emojis_negativos)

        if (user.color == colors[entrada.split(".")[1]])
            return interaction.reply({ content: `:passport_control: | ${customizacao[1]["cor_ativa"]}`, ephemeral: true })

        // Validando se o usuário tem dinheiro suficiente
        if (user.money < preco)
            return interaction.reply({ content: `${epic_embed_fail} | ${customizacao[1]["sem_money"].replace("preco_repl", preco.toLocaleString("pt-BR"))}`, ephemeral: true })

        const emoji_dancando = busca_emoji(client, emojis_dancantes)

        user.money -= parseInt(preco)
        user.color = colors[entrada.split(".")[1]]

        // Salvando os dados
        client.custom.saveUser(user)

        interaction.reply({ content: `${emoji_dancando} | ${customizacao[1]["cor_att"]}`, ephemeral: true })
    }
}
