const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
const { getReport, removeReport } = require('../database/schemas/Report')

module.exports = async ({ client, user, interaction }) => {

    const id_button = `${interaction.customId.split("[")[0]}${interaction.customId.split("]")[1]}`
    const date1 = new Date()

    console.log(interaction.customId)

    if (!interaction.customId.includes("report")) {

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

            interaction.guild.bans.fetch()
                .then(async bans => {
                    list = bans.map(user => user)

                    for (let i = 0; i < list.length; i++)
                        if (list[i].reason) {
                            let alvo = await getReport(list[i].user.id, interaction.guild.id)

                            alvo.relatory = list[i].reason
                            alvo.timestamp = Math.floor(date1.getTime() / 1000)
                            alvo.auto = true

                            adicionados++
                            await alvo.save()
                        }

                    let msg_feed = `${adicionados} usuários banidos foram adicionados aos registros de mau comportados, obrigado!`

                    if (adicionados < 1)
                        msg_feed = "Nenhum usuário foi adicionado, pois não possuem justificativa de banimento ou não há banimentos no servidor."

                    return interaction.update({ content: `${client.guard_emoji()} | ${msg_feed}`, embeds: [], components: [], ephemeral: true })
                })
        }

        if (id_button === `Canc_${interaction.user.id}`)
            interaction.update({ content: `:anger: | Operação cancelada!`, embeds: [], components: [], ephemeral: true })

    } else if (interaction.customId.includes("report_user")) {

        const alvo = await getReport(id_button.split(".")[2], interaction.guild.id)

        // Reportando um usuário mau comportado
        if (id_button.includes("Adicionareanun") && id_button.includes(interaction.user.id)) {
            // Adicionando e anunciando para outros servidores

            alvo.archived = false
            await alvo.save()

            interaction.update({ content: `${client.guard_emoji()} | ${client.tls.phrase(user, "mode.report.usuario_add")}`, embeds: [], components: [], ephemeral: true })
            require('../../adm/automaticos/dispara_reporte')({ client, alvo })

        } else if (id_button.includes("Adicionarsilen") && id_button.includes(interaction.user.id)) {
            // Adicionando sem reportar para outros servidores

            alvo.archived = false
            await alvo.save()

            interaction.update({ content: `${client.guard_emoji()} | O usuário foi adicionado silenciosamente a lista de mau comportados, obrigado!`, embeds: [], components: [], ephemeral: true })

        } else if (id_button.includes("Cancelar") && id_button.includes(interaction.user.id)) {
            // Removendo o usuário da lista de reportados

            await removeReport(alvo.uid, interaction.guild.id)

            interaction.update({ content: `:anger: | Operação cancelada!`, embeds: [], components: [], ephemeral: true })
        }
    }
}