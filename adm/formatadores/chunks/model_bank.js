const { EmbedBuilder } = require('discord.js')

const { busca_badges, badgeTypes } = require('../../data/badges')

const { emojis_dancantes } = require('../../../arquivos/json/text/emojis.json')
const { getRankMoney } = require('../../database/schemas/User')

const medals = {
    0: ":first_place:",
    1: ":second_place:",
    2: ":third_place:"
}

let paginas, pagina

module.exports = async ({ client, user, interaction, dados }) => {

    const date1 = new Date()
    const data_usuarios = await getRankMoney()
    const usernames = [], bufunfas = [], ids = []
    let rodape = interaction.user.username, i = 0

    if (typeof dados !== "undefined") // Enviado pelos botões de interação
        pagina = dados
    else
        pagina = interaction.options.getInteger("page") || 1

    // Sem dados salvos no banco de ranking
    if (!data_usuarios)
        return client.tls.editReply(interaction, user, "dive.rank.error_2", client.decider(user?.conf.ghost_mode, 0), 1)

    // Verificando a quantidade de entradas e estimando o número de páginas
    paginas = Math.ceil(data_usuarios.length / 6)

    if (pagina > paginas) // Número de página escolhida maior que as disponíveis
        return client.tls.editReply(interaction, user, "dive.rank.error_1", client.decider(user?.conf.ghost_mode, 0), 0)

    // Removendo os usuários respectivos as primeiras páginas
    remover = pagina === paginas ? (pagina - 1) * 6 : data_usuarios.length % 6 !== 0 ? pagina !== 2 ? (pagina - 1) * 6 : (pagina - 1) * 6 : (pagina - 1) * 6

    for (let x = 0; x < remover; x++)
        data_usuarios.shift()

    if (paginas > 1)
        rodape = `( ${pagina} | ${paginas} ) - ${paginas}`

    for (const user_int of data_usuarios) {
        if (i < 6) {
            let fixed_badge = busca_badges(client, badgeTypes.FIXED, user_int) || ""
            if (fixed_badge) fixed_badge = fixed_badge.emoji

            let cached_user = await client.getCachedUser(user_int.uid)

            if (cached_user) {
                // Validando se o usuário é um bot
                if (!cached_user.bot) {
                    if (parseInt(pagina) !== 1)
                        usernames.push(`${client.defaultEmoji("person")} #${remover + i + 1} \`${(cached_user.username).replace(/ /g, "")}\` ${fixed_badge}`)
                    else
                        usernames.push(`${medals[i] || ":medal:"} #${i + 1} \`${(cached_user.username).replace(/ /g, "")}\` ${fixed_badge}`)

                    ids.push(`\`${user_int.uid}\``)
                    bufunfas.push(`\`B$ ${client.locale(parseInt(user_int.misc.money))}\``)

                    i++
                }
            }
        }
    }

    // Rodapé do Embed de ranking
    rodape = paginas > 1 ? `${rodape} ${client.tls.phrase(user, "dive.rank.rodape")}` : rodape
    let daily = `:bank: ${client.tls.phrase(user, "misc.banco.dica_comando")} ${client.emoji(emojis_dancantes)}`

    if (user.misc.daily) {
        const tempo_restante = Math.floor((date1.getTime() + (((23 - date1.getHours()) * 3600000) + ((59 - date1.getMinutes()) * 60000) + ((60 - date1.getSeconds()) * 1000))) / 1000)

        daily = `:bank: ${client.tls.phrase(user, "misc.banco.daily")} <t:${tempo_restante}:R>\n[ <t:${tempo_restante}:f> ]`
    }

    const embed = new EmbedBuilder()
        .setTitle("> Ranking de Bufunfas")
        .setColor(client.embed_color(user.misc.color))
        .setDescription(daily)
        .addFields(
            {
                name: `${client.emoji("mc_wax")} ${client.tls.phrase(user, "dive.rank.enceirados")}`,
                value: usernames.join("\n"),
                inline: true
            },
            {
                name: `${client.emoji("mc_esmeralda")} **Bufunfas**`,
                value: bufunfas.join("\n"),
                inline: true
            },
            {
                name: `**${client.emoji("icon_id")} ${client.tls.phrase(user, "mode.report.identificador")}**`,
                value: ids.join("\n"),
                inline: true
            }
        )
        .setFooter({
            text: rodape,
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    let row = []
    const b_disabled = require("../../funcoes/navegacao_rank")({ pagina, paginas, ids, interaction })

    if (paginas > 1)
        row = client.create_buttons([
            { id: "rank_bank_button", name: '⏪', type: 1, data: `1|${pagina}.rank_bank_navegar`, disabled: b_disabled[0] },
            { id: "rank_bank_button", name: '◀️', type: 1, data: `2|${pagina}.rank_bank_navegar`, disabled: b_disabled[1] },
            { id: "rank_bank_button", name: '🔘', type: 0, data: `3|${pagina}.rank_bank_navegar`, disabled: b_disabled[2] },
            { id: "rank_bank_button", name: '▶️', type: 1, data: `4|${pagina}.rank_bank_navegar`, disabled: b_disabled[3] },
            { id: "rank_bank_button", name: '⏩', type: 1, data: `5|${pagina}.rank_bank_navegar`, disabled: b_disabled[4] }
        ], interaction)

    if (!dados) { // Verifica se não é uma interação recorrente ( criada por botões )
        if (paginas > 1) // Com mais de uma página no ranking
            await interaction.editReply({
                embeds: [embed],
                components: [row],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
        else // Apenas uma página no ranking
            await interaction.editReply({
                embeds: [embed],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
    } else { // Interação criada por botões
        if (paginas > 1) // Com mais de uma página no ranking
            await interaction.update({
                embeds: [embed],
                components: [row],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
        else // Apenas uma página no ranking
            await interaction.update({
                embeds: [embed],
                ephemeral: client.decider(user?.conf.ghost_mode, 0)
            })
    }
}