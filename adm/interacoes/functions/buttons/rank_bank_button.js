const { getRankMoney } = require('../../../database/schemas/User')

module.exports = async ({ client, user, interaction, dados }) => {

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

    if (operacao === 3) {

        // Coletando os dados para localizar o usuário
        let data_usuarios = await getRankMoney()
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
        let data_usuarios = await getRankMoney()
        pagina = Math.ceil(data_usuarios.length / 6)
    }

    dados = pagina

    require('../../../formatadores/chunks/model_bank')({ client, user, interaction, dados })
}