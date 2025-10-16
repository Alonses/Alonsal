module.exports = ({ client, data }) => {

    // Retorna o valor de desconto convertido para um número inteiro até 100
    const desconto = data?.valor || client.cached.subscriber_discount
    return client.execute("locale", { valor: ((desconto - 1) * -1) * 100 })
}