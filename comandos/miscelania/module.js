const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { verifyUserModules, createModule } = require('../../adm/database/schemas/Module')
const { getModulesPrice } = require('../../adm/database/schemas/Module')

const formata_horas = require('../../adm/formatadores/formata_horas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("module")
        .setNameLocalizations({
            "pt-BR": 'modulo',
            "es-ES": 'modulo',
            "fr": 'module',
            "it": 'modulo',
            "ru": 'модуль'
        })
        .setDescription("⌠👤⌡ Define modules with pre-programmed functions")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("⌠👤⌡ Create a new module with pre-programmed functions")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Criar um novo módulo com funções pré-programadas',
                    "es-ES": '⌠👤⌡ Crea un nuevo módulo con funciones preprogramadas',
                    "fr": '⌠👤⌡ Créez un nouveau module avec des fonctions préprogrammées',
                    "it": '⌠👤⌡ Crea un nuovo modulo con funzioni preprogrammate',
                    "ru": '⌠👤⌡ Создать новый модуль с запрограммированными функциями'
                })
                .addStringOption(option =>
                    option.setName("choice")
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
                            { name: '🏯 Eventos históricos', value: '2' },
                            { name: '🃏 Charadas', value: '3' }
                        )
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("hour")
                        .setNameLocalizations({
                            "pt-BR": 'hora',
                            "es-ES": 'hora',
                            "fr": 'heure',
                            "it": 'ora',
                            "ru": 'час'
                        })
                        .setMaxValue(23)
                        .setMinValue(0)
                        .setDescription("Em qual horário?")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Em qual horário?',
                            "es-ES": '¿A que hora?',
                            "fr": 'Quelle heure?',
                            "it": 'A che ora?',
                            "ru": 'Во сколько?'
                        })
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName("minute")
                        .setNameLocalizations({
                            "pt-BR": 'minuto',
                            "es-ES": 'minuto',
                            "fr": 'minute',
                            "it": 'minuto',
                            "ru": 'минута'
                        })
                        .setMaxValue(59)
                        .setMinValue(0)
                        .setDescription("In which minute?")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Em qual minuto?',
                            "es-ES": '¿En qué minuto?',
                            "fr": 'Dans quelle minute?',
                            "it": 'In che minuto?',
                            "ru": 'Какая минута?'
                        })
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("when")
                        .setNameLocalizations({
                            "pt-BR": 'quando',
                            "es-ES": 'cuando',
                            "fr": 'quand',
                            "it": 'quando',
                            "ru": 'когда'
                        })
                        .setDescription("Which days?")
                        .setDescriptionLocalizations({
                            "pt-BR": 'Em quais dias?',
                            "es-ES": '¿En qué días?',
                            "fr": 'Quels jours?',
                            "it": 'In quali giorni?',
                            "ru": 'В какие дни?'
                        })
                        .addChoices(
                            { name: 'Dias úteis', value: '0' },
                            { name: 'Finais de semana', value: '1' },
                            { name: 'Todos os dias', value: '2' }
                        )
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setNameLocalizations({
                    "pt-BR": 'lista',
                    "es-ES": 'lista',
                    "fr": 'liste',
                    "it": 'elenco',
                    "ru": 'список'
                })
                .setDescription("⌠👤⌡ Browse your modules")
                .setDescriptionLocalizations({
                    "pt-BR": '⌠👤⌡ Navegue por seus módulos',
                    "es-ES": '⌠👤⌡ Explora tus módulos',
                    "fr": '⌠👤⌡ Parcourez vos modules',
                    "it": '⌠👤⌡ Sfoglia i tuoi moduli',
                    "ru": '⌠👤⌡ Смотрите свои модули'
                })),
    async execute(client, user, interaction) {

        if (interaction.options.getSubcommand() === "add") {
            if (user.misc.money < 20)
                return client.tls.reply(interaction, user, "misc.modulo.sem_bufunfa", true, 0)

            const tipos_modulo = ["🌩️ Clima", "🖊️ Frases", "🏯 Eventos históricos", "🃏 Charadas"], ativacoes = [client.tls.phrase(user, "misc.modulo.dias_uteis"), client.tls.phrase(user, "misc.modulo.finais_semana"), client.tls.phrase(user, "misc.modulo.todos_os_dias")]
            const type = parseInt(interaction.options.getString("choice"))

            // Verificando quantos módulos de um tipo existem para o usuário
            const modulos_semelhantes = await verifyUserModules(interaction.user.id, type)

            if (modulos_semelhantes.length > 2)
                return interaction.reply({ content: "Você pode ativar apenas 3 de cada tipo de módulo!", ephemeral: true })

            // Prevenção de erros
            if (type == 0 && !user.misc.locale)
                return client.tls.reply(interaction, user, "misc.modulo.sem_locale", true, 0)

            const corpo_modulo = await createModule(interaction.user.id, type)
            const timestamp = client.timestamp()

            if (type === 3) // Módulo de charadas
                corpo_modulo.stats.price = 1

            corpo_modulo.stats.days = interaction.options.getString("when")
            corpo_modulo.stats.hour = formata_horas(interaction.options.getInteger("hour"), interaction.options.getInteger("minute"))
            corpo_modulo.stats.timestamp = timestamp

            await corpo_modulo.save()

            const ativacao_modulo = `${ativacoes[corpo_modulo.stats.days]} às ${corpo_modulo.stats.hour}`
            const montante = await getModulesPrice(interaction.user.id)

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
                    }
                )
                .setDescription(client.replace(client.tls.phrase(user, "misc.modulo.descricao"), [corpo_modulo.stats.price, montante]))
                .setFooter({ text: client.tls.phrase(user, "menu.botoes.selecionar_operacao"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

            // Criando os botões para o menu de badges
            const row = client.create_buttons([{ id: "modules", name: client.tls.phrase(user, "menu.botoes.confirmar"), value: '1', type: 2, data: `1|${timestamp}` }, { id: "modules", name: client.tls.phrase(user, "menu.botoes.cancelar"), value: '0', type: 3, emoji: '🛑', data: `0|${timestamp}` }], interaction)

            return interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
        } else // Navegando pelos módulos
            return require('../../adm/interacoes/chunks/modulos')({ client, user, interaction })
    }
}