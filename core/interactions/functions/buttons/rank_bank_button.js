module.exports = async ({ client, user, interaction, dados, autor_original }) => {

    let pagina = parseInt(dados.split(".")[2])
    const operacao = parseInt(dados.split(".")[1])

    // ID de operações
    // 1 -> Voltar para a página inicial
    // 2 -> Voltar uma página
    // 3 -> Mostrar usuário no ranking
    // 4 -> Próxima página
    // 5 -> Ir para a última página

    if (operacao === 1) pagina = 1
    else if (operacao === 2) pagina--
    else if (operacao === 4) pagina++

    if (operacao === 3) {

        // Coletando os dados para localizar o usuário
        let posicao = 1

        for (let i = 0; i < client.cached.rank.bank.length; i++) {
            if (interaction.user.id !== client.cached.rank.bank[i].uid)
                posicao++
            else break
        }

        if (posicao > client.cached.rank.bank.length)
            posicao = 1

        // Arredonda para cima a página com o usuário
        pagina = Math.ceil(posicao / 6)
    }

    if (operacao === 5) pagina = Math.ceil(client.cached.rank.bank.length / 6)

    dados = pagina

    require('../../../formatters/chunks/model_bank')({ client, user, interaction, dados, autor_original })
}