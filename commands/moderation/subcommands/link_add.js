const { EmbedBuilder } = require("discord.js")

const { verifySuspiciousLink, registerCachedSuspiciousLink } = require("../../../core/database/schemas/Spam_link")

module.exports = async ({ client, user, interaction }) => {

    let link = interaction.options.getString("link")

    try { // Verificando se o link é válido
        let url = new URL(link)
    } catch (err) {
        return interaction.reply({
            content: `${client.emoji(0)} | O texto informado não é um link!\nNão é possível salvar esse valor como um link suspeito.`,
            ephemeral: true
        })
    }

    if (await verifySuspiciousLink(link)) // Link já existe
        return interaction.reply({
            content: `${client.emoji(0)} | O link informado já está registrado por aqui!\nNão é possível salvar esse link novamente.`,
            ephemeral: true
        })

    const timestamp = client.timestamp()
    await registerCachedSuspiciousLink(link, interaction.guild.id, timestamp)

    const embed = new EmbedBuilder()
        .setTitle("> Registrando um novo link suspeito :link:")
        .setColor(client.embed_color(user.misc.color))
        .setDescription(`Você está informando que o link abaixo é malicioso:\`\`\`fix\n${link}\`\`\`\nAo reportar este link ao Alonsal, todas as mensagens que forem enviadas e contiverem esse link em um servidor com o recurso de \`🔗 Links suspeitos\` habilitado...\n\nImplicará na exclusão imediata da mensagem e penalização do autor com base no tratamento do \`📛 Anti-spam\`.`)
        .setFooter({
            text: "Use os botões abaixo para confirmar a intenção",
            iconURL: interaction.user.avatarURL({ dynamic: true })
        })

    // Criando os botões para a cor customizada
    const row = client.create_buttons([
        { id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.confirmar"), type: 2, emoji: client.emoji(10), data: `1.${timestamp}` },
        { id: "spam_link_button", name: client.tls.phrase(user, "menu.botoes.cancelar"), type: 3, emoji: client.emoji(0), data: `0.${timestamp}` }
    ], interaction)

    interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    })
}