const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

const { getReport, removeReport } = require('../database/schemas/Report')

const { createBadge } = require('../../adm/database/schemas/Badge')
const { busca_badges, badgeTypes } = require('../../adm/data/badges')
const { getModule, deleteModule } = require('../database/schemas/Module')
const { atualiza_modulos } = require('../automaticos/modulo')
const { dropTask, getTask } = require('../database/schemas/Task')
const { getUserGroups } = require('../database/schemas/Task_group')

const create_menus = require('../discord/create_menus')

module.exports = async ({ client, user, interaction }) => {

    if (!interaction.customId.includes(interaction.user.id))
        return interaction.reply({ content: "Parado aí seu salafrário! Esses botões só podem ser usados pelo autor do comando!", ephemeral: true })

    const id_button = `${interaction.customId.split("[")[0]}${interaction.customId.split("]")[1]}`

    if (!interaction.customId.includes("report") && !interaction.customId.includes("transfer") && !interaction.customId.includes("badge") && !interaction.customId.includes("modules") && !interaction.customId.includes("task_button")) {

        if (id_button === `Conf_${interaction.user.id}`) {

            // Formatando o ID do botão para o propósito esperado
            const data_cor = interaction.customId.split("[")[1].split("]")[0]

            const colors = ['0x7289DA', '0xD62D20', '0xFFD319', '0x36802D', '0xFFFFFF', '0xF27D0C', '0x44008B', '0x000000', '0x29BB8E', '0x2F3136', 'RANDOM'], precos = [200, 300, 400, 500, 50]

            const preco = precos[parseInt(data_cor.split(".")[0])]

            // Validando se o usuário tem dinheiro suficiente
            if (user.misc.money < preco) {
                return interaction.reply({
                    content: `:epic_embed_fail: | ${client.tls.translate(client, interaction, "misc.color.sem_money").replace("preco_repl", client.locale(preco))}`,
                    ephemeral: true
                })
            }

            user.misc.money -= preco

            const caso = "movimentacao", quantia = preco
            await require('../../adm/automaticos/relatorio.js')({ client, caso, quantia })

            // Diferente da cor cor aleatória e da cor customizada
            if (data_cor.split(".")[0] !== '10' && data_cor.split(".")[0] !== '4')
                user.misc.color = colors[data_cor.split(".")[1].split("-")[0]]
            else if (data_cor.split(".")[1].split("0")[0] === '10') // Salvando a cor randomica
                user.misc.color = 'RANDOM'
            else
                user.misc.color = data_cor.split("-")[1]

            // Salvando os dados
            user.save()

            interaction.update({ content: `${client.emoji(emojis_dancantes)} | ${client.tls.phrase(user, "misc.color.cor_att")}`, embeds: [], components: [], ephemeral: true })
        }

        if (id_button === `Canc_${interaction.user.id}`)
            interaction.update({ content: `:anger: | ${client.tls.phrase(user, "misc.color.att_cancelada")}`, embeds: [], components: [], ephemeral: true })

    } else if (interaction.customId.includes("report_auto")) {

        // Reportando os usuários banidos do servidor de forma automática
        if (id_button === `Conf_${interaction.user.id}`) {

            let list = []
            let adicionados = 0

            // Coletando os usuários que foram banidos no servidor
            interaction.guild.bans.fetch()
                .then(async bans => {
                    list = bans.map(user => user)

                    for (let i = 0; i < list.length; i++)
                        if (list[i].reason) {
                            let alvo = await getReport(list[i].user.id, interaction.guild.id)

                            // Adicionando o usuário caso
                            alvo.relatory = list[i].reason
                            alvo.timestamp = client.timestamp()
                            alvo.issuer = interaction.user.id
                            alvo.auto = true

                            adicionados++
                            await alvo.save()
                        }

                    let msg_feed = `${adicionados} usuários banidos foram adicionados aos registros de mau comportados, obrigado!`

                    if (adicionados < 1)
                        msg_feed = "Nenhum usuário foi adicionado, pois não possuem justificativa de banimento ou não há banimentos no servidor."

                    return interaction.update({ content: `${client.defaultEmoji("guard")} | ${msg_feed}`, embeds: [], components: [], ephemeral: true })
                })
        }

        if (id_button === `Canc_${interaction.user.id}`)
            interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })

    } else if (interaction.customId.includes("report_user")) {

        const alvo = await getReport(id_button.split(".")[2], interaction.guild.id)

        // Reportando um usuário mau comportado
        if (id_button.includes("Adicionareanun") && id_button.includes(interaction.user.id)) {
            // Adicionando e anunciando para outros servidores

            alvo.archived = false
            await alvo.save()

            interaction.update({ content: `${client.defaultEmoji("guard")} | ${client.tls.phrase(user, "mode.report.usuario_add")}`, embeds: [], components: [], ephemeral: true })
            require('../../adm/automaticos/dispara_reporte')({ client, alvo })

        } else if (id_button.includes("Adicionarsilen") && id_button.includes(interaction.user.id)) {
            // Adicionando sem reportar para outros servidores

            alvo.archived = false
            await alvo.save()

            interaction.update({ content: `${client.defaultEmoji("guard")} | O usuário foi adicionado silenciosamente a lista de mau comportados, obrigado!`, embeds: [], components: [], ephemeral: true })

        } else if (id_button.includes("Cancelar") && id_button.includes(interaction.user.id)) {
            // Removendo o usuário da lista de reportados

            await removeReport(alvo.uid, interaction.guild.id)

            interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })
        }
    } else if (interaction.customId.includes("transfer")) {

        // Transferindo Bufunfas entre usuários

        if (id_button.includes("Conf")) {

            const alvo = await client.getUser(interaction.customId.split("[")[1].split(".")[1])
            const bufunfas = parseFloat(interaction.customId.split("]")[0].split("[")[2])

            user.misc.money -= bufunfas
            alvo.misc.money += bufunfas

            user.save()
            alvo.save()

            const caso = "movimentacao", quantia = bufunfas
            require('../../adm/automaticos/relatorio.js')({ client, caso, quantia })

            interaction.update({ content: `:bank: :white_check_mark: | ${client.tls.phrase(user, "misc.pay.sucesso").replace("valor_repl", client.locale(bufunfas))} <@!${alvo.uid}>`, ephemeral: client.ephemeral(user?.conf.ghost_mode, 0), embeds: [], components: [] })

            if (client.ephemeral(alvo?.conf.ghost_mode, 1))
                client.sendDM(alvo, `:bank: | ${client.tls.phrase(alvo, "misc.pay.notifica").replace("user_repl", user.uid).replace("valor_repl", client.locale(bufunfas))} ${client.emoji(emojis_dancantes)}`)
        } else
            interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })

    } else if (interaction.customId.includes("badge")) {
        // Atribuindo badges a usuários

        if (!id_button.includes("Canc")) {
            id_alvo = interaction.customId.split(".")[3]
            badge_alvo = interaction.customId.split(".[")[1].split("]]")[0]
        }

        // Atribuindo e notificando
        if (interaction.customId.includes("Conf") && interaction.customId.includes(interaction.user.id)) {

            await createBadge(id_alvo, badge_alvo, client.timestamp())

            const badge = busca_badges(client, badgeTypes.SINGLE, parseInt(badge_alvo))

            client.discord.users.fetch(id_alvo, false).then(async (user_interno) => {
                const alvo = await client.getUser(id_alvo)

                // Atribuindo silenciosamente
                if (!interaction.customId.includes("Confirmarsilen")) {

                    if (client.ephemeral(alvo?.conf.ghost_mode, 1))
                        client.sendDM(alvo, `${client.emoji(emojis_dancantes)} | ${client.tls.phrase(alvo, "dive.badges.new_badge").replace("nome_repl", badge.name).replace("emoji_repl", badge.emoji)}`)

                    interaction.update({ content: `${client.emoji(emojis_dancantes)} | Badge \`${badge.name}\` ${badge.emoji} atribuída ao usuário ${user_interno}!`, embeds: [], components: [], ephemeral: true })
                } else
                    interaction.update({ content: `${client.emoji(emojis_dancantes)} | Badge \`${badge.name}\` ${badge.emoji} atribuída silenciosamente ao usuário ${user_interno}!`, embeds: [], components: [], ephemeral: true })
            })
        } else // Cancelando a atribuição da badge
            interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })

    } else if (interaction.customId.includes("modules")) {

        // Tipo do módulo
        const type = interaction.customId.split(".")[1].split("]")[0]

        const modulo = await getModule(interaction.user.id, parseInt(type))
        const ativacoes = ["nos dias úteis", "nos finais de semana", "todos os dias"]

        // Ativando o módulo
        if (interaction.customId.includes("Conf")) {
            modulo.stats.active = true

            await modulo.save()

            interaction.update({ content: `:mega: | Módulo ativado! Seu módulo será enviado ${ativacoes[modulo.stats.days]} às \`${modulo.stats.hour}\``, embeds: [], components: [], ephemeral: true })
        } else {
            await deleteModule(interaction.user.id, parseInt(type))

            interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })
        }

        atualiza_modulos(client, 0, true)

    } else if (interaction.customId.includes("task_button")) {

        // Gerenciamento de anotações
        const operacao = interaction.customId.split("[")[0]
        const timestamp = parseInt(interaction.customId.split(".")[2])

        if (operacao === "Alterardelista") {

            const grupos = await getUserGroups(interaction.user.id)

            return interaction.update({ content: ":mag: | Escolha uma das listas abaixo para adicionar esta tarefa.", components: [create_menus("groups", client, interaction, user, grupos, timestamp)], embeds: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
        }

        console.log(operacao)

        if (operacao === "Apagar") {
            await dropTask(interaction.user.id, timestamp)

            console.log("aq")

            return interaction.update({ content: ":white_check_mark: | Sua anotação foi excluída com sucesso!", embeds: [], components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
        }

        if (operacao === "Marcarcomoconc") {

            const task = await getTask(interaction.user.id, timestamp)

            task.concluded = true
            task.save()

            return interaction.update({ content: ":white_check_mark: | Sua anotação foi movida para as notas concluídas!", embeds: [], components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
        }

        if (operacao === "Abrirnovamente") {

            const task = await getTask(interaction.user.id, timestamp)

            task.concluded = false
            task.save()

            return interaction.update({ content: ":white_check_mark: | Sua anotação foi movida para as notas em aberto novamente!", embeds: [], components: [], ephemeral: client.ephemeral(user?.conf.ghost_mode, 0) })
        }
    }
}