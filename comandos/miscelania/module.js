const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getModule } = require('../../adm/database/schemas/Module')
const { getModulePrice } = require('../../adm/database/schemas/Module')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("modulo")
        .setDescription("Defina módulos com funções pré-programadas")
        .addStringOption(option =>
            option.setName("tipo")
                .setNameLocalizations({
                    "pt-BR": 'escolha',
                    "es-ES": 'eleccion',
                    "fr": 'choix',
                    "it": 'scelta',
                    "ru": 'выбор'
                })
                .setDescription("What's your choice?")
                .setDescriptionLocalizations({
                    "pt-BR": 'Qual a sua escolha?',
                    "es-ES": '¿Cual es tu eleccion?',
                    "fr": 'Quel est ton choix?',
                    "it": 'Qual\'è la tua scelta?',
                    "ru": 'Каков ваш выбор?'
                })
                .addChoices(
                    { name: '🌩️ Clima', value: '0' },
                    // { name: '🖊️ Frase', value: '1' },
                    // { name: '🏯 Eventos históricos', value: '2' }
                )
                .setRequired(true))
        .addNumberOption(option =>
            option.setName("hora")
                .setMaxValue(24)
                .setMinValue(0)
                .setDescription("Em qual horário?")
                .setRequired(true))
        .addNumberOption(option =>
            option.setName("minuto")
                .setMaxValue(60)
                .setMinValue(0)
                .setDescription("Em qual minuto?")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("quando")
                .setDescription("Em quais dias?")
                .addChoices(
                    { name: 'Dias úteis', value: '0' },
                    { name: 'Finais de semana', value: '1' },
                    { name: 'Todos os dias', value: '2' }
                )
                .setRequired(true)),
    async execute(client, user, interaction) {

        if (user.misc.money < 20)
            return interaction.reply({ content: ":octagonal_sign: | Você não possui Bufunfas o suficiente para usar módulos, consiga algumas com o comando /daily antes!", ephemeral: true })

        const tipos_modulo = ["🌩️ Clima", "🖊️ Frases", "🏯 Eventos históricos"], ativacoes = ["Dias úteis", "Finais de semana", "Todos os dias"]
        const type = interaction.options.getString("tipo")

        // Prevenção de erros
        if (type == 0 && !user.misc.locale)
            return interaction.reply(":octagonal_sign: | Para ativar o módulo de clima é necessário definir um local padrão com o comando `/link locale` antes!")

        const corpo_modulo = await getModule(interaction.user.id, type)

        corpo_modulo.stats.days = interaction.options.getString("quando")
        corpo_modulo.stats.hour = `${interaction.options.getNumber("hora")}:${interaction.options.getNumber("minuto")}`

        await corpo_modulo.save()

        const ativacao_modulo = `${ativacoes[corpo_modulo.stats.days]} às ${corpo_modulo.stats.hour}`
        const montante = await getModulePrice(interaction.user.id)

        const embed = new EmbedBuilder()
            .setTitle("> Criando um módulo")
            .setColor(client.embed_color(user.misc.color))
            .addFields(
                {
                    name: `**${client.defaultEmoji("types")} Tipo de módulo**`,
                    value: `\`${tipos_modulo[corpo_modulo.type]}\``,
                    inline: true
                },
                {
                    name: `**${client.defaultEmoji("time")} Ativação**`,
                    value: `\`${ativacao_modulo}\``,
                    inline: true
                },
                {
                    name: `**${client.defaultEmoji("money")} Valor**`,
                    value: `\`B$ ${corpo_modulo.stats.price}\``,
                    inline: true
                },
            )
            .setDescription(`:nerd: | Este módulo irá descontar \`B$${corpo_modulo.stats.price} p/ dia\`, quanto mais módulos ativar,\nmais bufunfas serão descontadas do seu banco por dia.\n\nAtualmente o valor por operar seus módulos é \`B$${montante} p/dia\`.\n----------------------------------------------------------------------------`)
            .setFooter({ text: "Use os botões abaixo para confirmar ou cancelar.", iconURL: interaction.user.avatarURL({ dynamic: true }) })

        // Criando os botões para o menu de badges
        const row = client.create_buttons([{ name: `Confirmar:modules.${corpo_modulo.type}`, value: '1', type: 2 }, { name: `Cancelar:modules.${corpo_modulo.type}`, value: '0', type: 3 }], interaction)

        return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}