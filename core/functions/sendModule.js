module.exports = async ({ client, data }) => {

    const { alvo, dados, internal_module } = data

    // Decide para qual destino será enviado o módulo
    if (internal_module.misc.scope === "user") client.execute("sendDM", { user: alvo, dados, force: true, internal_module })
    else client.execute("notify", { id_canal: client.decifer(internal_module.misc.cid), conteudo: dados, objeto: internal_module })
}