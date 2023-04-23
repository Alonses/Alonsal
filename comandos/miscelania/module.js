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
                    { name: '🖊️ Frase', value: '1' },
                    // { name: '🏯 Eventos históricos', value: '2' }
                )
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("hora")
                .setMaxValue(24)
                .setMinValue(0)
                .setDescription("Em qual horário?")
                .setRequired(true))
        .addIntegerOption(option =>
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
            return client.tls.reply(interaction, user, "misc.modulo.sem_bufunfa", true, 0)

        const tipos_modulo = ["🌩️ Clima", "🖊️ Frases", "🏯 Eventos históricos"], ativacoes = [client.tls.phrase(user, "misc.modulo.dias_uteis"), client.tls.phrase(user, "misc.modulo.finais_semana"), client.tls.phrase(user, "misc.modulo.todos_os_dias")]
        const type = interaction.options.getString("tipo")

        // Prevenção de erros
        if (type == 0 && !user.misc.locale)
            return client.tls.reply(interaction, user, "misc.modulo.sem_locale", true, 0)

        const corpo_modulo = await getModule(interaction.user.id, type)

        corpo_modulo.stats.days = interaction.options.getString("quando")
        corpo_modulo.stats.hour = `${interaction.options.getInteger("hora")}:${interaction.options.getInteger("minuto")}`

        await corpo_modulo.save()

        const ativacao_modulo = `${ativacoes[corpo_modulo.stats.days]} às ${corpo_modulo.stats.hour}`
        const montante = await getModulePrice(interaction.user.id)

        const embed = new EmbedBuilder()
            .setTitle(client.tls.phrase(user, "misc.modulo.cabecalho_menu"))
            .setColor(client.embed_color(user.misc.color))
            .addFields(
                {
                    name: `**${client.defaultEmoji("types")} ${client.tls.phrase(user, "misc.modulo.tipo")}**`,
                    value: `\`${tipos_modulo[corpo_modulo.type]}\``,
                    inline: true
                },
                {
                    name: `**${client.defaultEmoji("time")} ${client.tls.phrase(user, "misc.modulo.ativacao")}**`,
                    value: `\`${ativacao_modulo}\``,
                    inline: true
                },
                {
                    name: `**${client.defaultEmoji("money")} ${client.tls.phrase(user, "misc.modulo.valor")}**`,
                    value: `\`B$ ${corpo_modulo.stats.price}\``,
                    inline: true
                },
            )
            .setDescription(client.replace(client.tls.phrase(user, "misc.modulo.descricao"), [corpo_modulo.stats.price, montante]))
            .setFooter({ text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

        // Criando os botões para o menu de badges
        const row = client.create_buttons([{ id: "modules", name: client.tls.phrase(user, "menu.botoes.confirmar"), value: '1', type: 2, data: `1|${corpo_modulo.type}` }, { id: "modules", name: client.tls.phrase(user, "menu.botoes.cancelar"), value: '0', type: 3, data: `0|${corpo_modulo.type}` }], interaction)

        return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}