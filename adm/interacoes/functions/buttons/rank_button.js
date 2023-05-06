const { getRankGlobal } = require('../../../database/schemas/Rank_g')
const { getRankServer } = require('../../../database/schemas/Rank_s')

module.exports = async ({ client, user, interaction, dados }) => {

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

    if (operacao === 3 || operacao === 5) {

        // Coletando os dados para o servidor ou para o global
        if (escopo === "server")
            data_usuarios = await getRankServer(interaction.guild.id)
        else
            data_usuarios = await getRankGlobal()

        // Encontrando o usuário no ranking
        if (operacao === 3) {
            const users = []

            data_usuarios.forEach(valor => {
                users.push(valor)
            })

            // Ordena os usuários em ordem decrescente de XP
            users.sort(function (a, b) {
                return (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0)
            })

            let posicao = 1

            for (let i = 0; i < users.length; i++) {
                if (interaction.user.id !== users[i].uid)
                    posicao++
                else
                    break
            }

            // Arredonda para cima a página com o usuário
            pagina = Math.ceil(posicao / 6)
        }

        // Movendo para a última página do ranking
        if (operacao === 5)
            pagina = parseInt(data_usuarios.length / 6)
    }

    require('../../../formatadores/chunks/model_rank')(client, user, interaction, pagina, escopo)
}