const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

const { emojis_dancantes } = require('../../arquivos/json/text/emojis.json')
const { emoji_button, type_button } = require('../../adm/funcoes/emoji_button')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("broadcast")
        .setDescription("⌠📡⌡ Start a broadcast")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Iniciar um broadcast',
            "es-ES": '⌠📡⌡ Iniciar una transmisión',
            "fr": '⌠📡⌡ Lancer une diffusion',
            "it": '⌠📡⌡ Avviare una trasmissione',
            "ru": '⌠📡⌡ начать трансляцию'
        }),
    async execute(client, user, interaction) {

        const guild = await client.getGuild(interaction.guild.id)

        // Verificando se o Broadcast é permitido no servidor
        if (!client.decider(guild?.conf.broadcast, 0))
            return interaction.reply({ content: ":octagonal_sign: | O Broadcast está desligado neste servidor.", ephemeral: true })

        const canal_alvo = await client.channels().get(interaction.channel.id)

        // Sem permissão para enviar mensagens
        if (!canal_alvo.permissionsFor(client.user()).has(PermissionsBitField.Flags.SendMessages))
            return interaction.reply({ content: ":ocatagonal_sign: | Eu não posso enviar mensagens neste canal, não é possível iniciar um Broadcast aqui!", ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle(`> Solicitando um Broadcast ${client.emoji(emojis_dancantes)}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription("Clique abaixo para informar ao Solondo de que você quer fazer um Broadcast.\n\nAo solicitar um Broadcast, o Solondo poderá visualizar o ID deste chat e se conectar para conversar com você de forma remota através de mim!\nTodas as mensagens que forem enviadas neste canal, poderão ser vistas pelo Solondo também.\n\nÉ possível anexar imagens e arquivos no chat (aqui tem muita tecnologia) também!\n\nCaso você desative o Broadcast do servidor, ou o Solondo fique 5 minutos offline, este vinculo será automaticamente desligado.")
            .setFooter({ text: client.tls.phrase(user, "manu.painel.rodape"), iconURL: interaction.user.avatarURL({ dynamic: true }) })

        const row = client.create_buttons([{ id: "guild_solicitar_broadcast", name: "Solicitar", type: 1, emoji: client.emoji(emojis_dancantes), data: "1" }, { id: "guild_solicitar_broadcast", name: "Broadcast", type: type_button(guild?.conf.broadcast), emoji: emoji_button(guild?.conf.broadcast), data: "2" }], interaction)

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}