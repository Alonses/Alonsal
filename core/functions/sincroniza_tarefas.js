/**
 * Vincula uma tarefa ou lista ao servidor onde foi gerada a interação
 * @param {object} data - possui as chaves alvo e interaction, alvo pode ser uma tarefa ou lista
 */
module.exports = async ({ client, data }) => {

    const { alvo, interaction } = data

    if (!alvo.sid) {
        alvo.sid = client.encrypt(interaction.guild.id)
        await alvo.save()
    }
}