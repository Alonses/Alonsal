module.exports = async ({ client, user, interaction }) => {

    const row = client.create_buttons([
        { name: { tls: "manu.apoio.contribua" }, type: 4, emoji: client.emoji("mc_bolo"), value: "https://picpay.me/slondo" },
        { name: "Buy a Coffee!", type: 4, emoji: "☕", value: "https://buymeacoffee.com/slondo" },
        { name: { tls: "menu.botoes.mais_detalhes" }, type: 4, emoji: "🌟", value: "https://alonsal.discloud.app/" }
    ], interaction, user)

    const embed = client.create_embed({
        title: `${client.tls.phrase(user, "manu.apoio.apoie")} ${client.emoji("mc_bolo")}`,
        image: "https://i.imgur.com/VCneT1l.png",
        description: "Ao ajudar o Alonsal monetariamente você será recompensado com o status de `👑 Assinante Alonsal`.\nComo assinante, você terá diversos benefícios em recursos do bot, como desconto de Bufunfas em `⚡ módulos` e `🎨 customizações`, limites maiores de `⚡ módulos` configurados, servidores em `🌎 Network`, membros autorizados em `🔊 canais de voz dinâmicos` e mais!\n\nScaneie o código QR ou clique no botão abaixo para doar\ne ajudar a manter e desenvolver o Alonsal!\n\nToda ajuda é ultra Bem-vinda ;D\n\n\n**🌟 Benefícios para assinantes**\n\n**⚡ Módulos**\n- 🕵️‍♂️ Limite de módulos pessoais altera de `3` para `10` por cada tipo.\n- 🌐 Limite de módulos em servidor altera de `2` para `10` entre todos os tipos.\n- 📣 Acesso a módulos auto-editáveis, semelhante a vitrines.\n\n**🔊 Canais de voz dinâmicos**\n- 🧛‍♀️ Limite de usuários autorizados altera de `10` para `30` por servidor.\n\n**💂‍♂️ Moderação**\n- 🌟 Conceder vinculo de impulsionador a um servidor.\n- 🌐 Limite de servidores do Network altera de `10` para `30`.\n- 🔊 Multi-ativadores de Canais Dinâmicos altera de `2` para `10`.\n\n**👑 Cosméticos**\n- 🏆 Badge exclusiva de suporte.\n- 💸 Desconto de `75% +` em tudo que gaste Bufunfas.\n- 💰 Bufunfas que possuir rendem nos dias úteis.",
    }, user)

    interaction.reply({
        embeds: [embed],
        components: [row],
        flags: "Ephemeral"
    })
}