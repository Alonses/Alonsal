const { EmbedBuilder } = require("discord.js")

module.exports = async ({ client, user, interaction, dados }) => {

    const escolha_user = "placeholder", dados_para_exclusao = "placeholder_2"

    const embed = new EmbedBuilder()
        .setTitle("> Excluíndo dados")
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`:warning: Seus dados serão excluídos definitivamente se você clicar em confirmar.\n\nPor segurança e total controle de sua parte, eu não salvo os seus dados por aqui ou crio backups, isso significa que os dados uma vez excluídos não podem ser recuperados.\n\nEscolha selecionada: ${escolha_user}\`\`\`fix\nO que será excluído:\n${dados_para_exclusao}\`\`\``)
        .setFooter({ text: "Use os botões abaixo por sua conta e risco, não será possível desfazer caso confirme a exclusão.", iconURL: interaction.user.avatarURL({ dynamic: true }) })

    const row = client.create_buttons([{ id: "data_button", name: client.tls.phrase(user, "menu.botoes.confirmar"), value: '0', emoji: client.emoji(10), type: 2, data: '1' }, { id: "data_button", name: client.tls.phrase(user, "menu.botoes.cancelar"), value: '0', type: 3, emoji: client.emoji(0), data: '0' }, { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), value: '1', type: 0, emoji: client.emoji(19), data: `data` }], interaction)

    interaction.update({ embeds: [embed], components: [row], ephemeral: true })
}