const busca_emoji = require("../discord/busca_emoji")

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')

module.exports = ({ client, interaction }) => {

    const id_button = `${interaction.customId.split("[")[0]}${interaction.customId.split("]")[1]}`
    const { customizacao } = require(`../../arquivos/idiomas/${client.idioma.getLang(interaction)}.json`)

    if (id_button == `Conf_${interaction.user.id}`) {

        // Formatando o ID do botão para o propósito esperado
        const data_cor = interaction.customId.split("[")[1].split("]")[0]

        const user = client.usuarios.getUser(interaction.user.id)
        const colors = ['0x7289DA', '0xD62D20', '0xFFD319', '0x36802D', '0xFFFFFF', '0xF27D0C', '0x44008B', '0x000000', '0x29BB8E', '0x2F3136', 'RANDOM'], precos = [200, 300, 400, 500, 50]

        const preco = precos[parseInt(data_cor.split(".")[0])]

        // Validando se o usuário tem dinheiro suficiente
        if (user.misc.money < preco)
            return interaction.reply({ content: `${epic_embed_fail} | ${customizacao[1]["sem_money"].replace("preco_repl", formata_num(preco))}`, ephemeral: true })

        const emoji_dancando = busca_emoji(client, emojis_dancantes)
        user.misc.money -= preco

        const caso = "movimentacao", quantia = preco
        require('../../adm/automaticos/relatorio.js')({ client, caso, quantia })

        if (data_cor.split(".") != 10)
            user.misc.color = colors[data_cor.split(".")[1].split("-")[0]]
        else // Salvando a cor customizada
            user.misc.color = data_cor.split("-")[1]

        // Salvando os dados
        client.usuarios.saveUser(user)

        interaction.update({ content: `${emoji_dancando} | ${customizacao[1]["cor_att"]}`, embeds: [], components: [], ephemeral: true })
    }

    if (id_button == `Canc_${interaction.user.id}`)
        return interaction.update({ content: `:anger: | ${customizacao[1]["att_cancelada"]}`, embeds: [], components: [], ephemeral: true })
}