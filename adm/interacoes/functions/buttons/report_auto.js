const { getReport } = require('../../../database/schemas/Report')

module.exports = async ({ client, user, interaction, dados }) => {

    // Gerenciamento de reportes de usuários
    const operacao = parseInt(dados.split(".")[1])

    // Códigos de operação
    // 0 -> Cancela
    // 1 -> Confirma

    if (!operacao)
        interaction.update({ content: ":o: | Operação cancelada!", embeds: [], components: [], ephemeral: true })

    // Reportando os usuários banidos do servidor de forma automática
    if (operacao === 1) {

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
}