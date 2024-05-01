const { getRankGlobal } = require('../../../database/schemas/User_rank_guild')
const { getRankServer } = require('../../../database/schemas/User_rank_guild')

module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    let defer = false
    const escopo = dados.split(".")[3]
    let pagina = parseInt(dados.split(".")[2])
    const operacao = parseInt(dados.split(".")[1])

    // ID de operações
    // 1 -> Voltar para a página inicial
    // 2 -> Voltar uma página
    // 3 -> Mostrar usuário no ranking
    // 4 -> Próxima página
    // 5 -> Ir para a última página

    if (operacao === 1)
        pagina = 1

    if (operacao === 2)
        pagina--

    if (operacao === 4)
        pagina++

    if (operacao === 3 || operacao === 5 || !autor_original) {
        defer = true

        let ephemeral = true

        if (autor_original)
            ephemeral = client.decider(user?.conf.ghost_mode, 0)

        await client.deferedResponse({ interaction, ephemeral })
    }

    if (operacao === 3) {

        // Coletando os dados para o servidor ou para o global
        const data_usuarios = await (escopo === "server" ? getRankServer(interaction.guild.id) : getRankGlobal())
        let posicao = 1

        for (let i = 0; i < data_usuarios.length; i++) {
            if (interaction.user.id !== data_usuarios[i].uid)
                posicao++
            else
                break
        }

        if (posicao > data_usuarios.length)
            posicao = 1

        // Arredonda para cima a página com o usuário
        pagina = Math.ceil(posicao / 6)
    }

    if (operacao === 5) {
        // Coletando os dados para o servidor ou para o global
        const data_usuarios = await (escopo === "server" ? getRankServer(interaction.guild.id) : getRankGlobal())

        pagina = Math.ceil(data_usuarios.length / 6)
    }

    require('../../../formatters/chunks/model_rank')(client, user, interaction, pagina, escopo, defer, autor_original)
}