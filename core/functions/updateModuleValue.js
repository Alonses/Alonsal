const { getModule } = require("../database/schemas/Module")

module.exports = async ({ data }) => {

    const hash = data.hash
    const chave = data.chave
    const value = data.value

    // Sem hash ou chave informada, cancelando a operação
    if (!hash || !chave) return

    // Atualiza o módulo com o conteúdo que foi enviado
    const modulo = await getModule(hash)
    const local = chave.split(".")

    // Vasculha o objeto do módulo a procura do valor para alterar
    local.reduce((acc, key, index) => {
        if (index === local.length - 1)
            acc[key] = value

        return acc[key]
    }, modulo)

    await modulo.save()
}