const { EmbedBuilder } = require("discord.js")

const { verifyVoiceChannel } = require("../../database/schemas/User_voice_channel")

module.exports = async ({ client, user, interaction, dados, update }) => {

    const id_canal = dados.split(".")[0]
    const id_guild = dados.split(".")[1]
    const canal_guild = await client.getGuildChannel(interaction?.channel.id || id_canal)
    const voice_channel = await verifyVoiceChannel(client.encrypt(interaction?.channel.id || id_canal), client.encrypt(interaction?.guild.id || id_guild))

    if (!update) {

        // Enviando a mensagem e salvando o ID dela para atualizações futuras
        const obj = await gera_painel(client, user, id_canal, canal_guild, voice_channel)
        envia_painel(client, user, interaction, voice_channel, canal_guild, obj)
            .catch({})

    } else {

        // Atualizando a mensagem original com o painel de controle do canal de voz
        canal_guild.messages.fetch(client.decifer(voice_channel.mid))
            .then(async (m) => { m.edit(await gera_painel(client, user, id_canal, canal_guild, voice_channel)) })
            .catch(async () => {
                const obj = await gera_painel(client, user, id_canal, canal_guild, voice_channel)
                envia_painel(client, user, interaction, voice_channel, canal_guild, obj)
                    .catch({})
            })
    }
}

async function gera_painel(client, user, id_canal, canal_guild, voice_channel) {

    // Criando o embed de botões para configuração do canal pelo membro
    const embed = new EmbedBuilder()
        .setTitle(`${client.tls.phrase(user, "mode.voice_channels.titulo_controle_canal", null, canal_guild.name.split(" ")[1])} 🔊`)
        .setDescription(client.tls.phrase(user, "mode.voice_channels.painel_configuracao_canal"))
        .setColor(client.embed_color(user.misc.color))
        .setFields(
            {
                name: `${canal_guild.userLimit < 1 ? "🗽" : "🚧"} **${client.tls.phrase(user, "mode.voice_channels.limite_usuarios")}**`,
                value: canal_guild.userLimit < 1 ? `\`${client.tls.phrase(user, "util.canal.sem_limite")}\`` : `\`${canal_guild.userLimit} ${client.tls.phrase(user, "mode.voice_channels.usuarios")}\``,
                inline: true
            }
        )

    const row = client.create_buttons([
        { id: "user_voice_channel", name: client.tls.phrase(user, "menu.botoes.limitar_canal"), type: 1, emoji: client.defaultEmoji("metrics"), data: `1.${id_canal}.${client.decifer(voice_channel.uid)}` },
        // { id: "user_voice_channel", name: "Privar canal", type: 1, emoji: "🔒", data: `2.${id_canal}.${client.decifer(voice_channel.uid)}` }
    ], client.decifer(voice_channel.uid))

    const obj = {
        content: `<@${client.decifer(voice_channel.uid)}>`,
        embeds: [embed],
        components: [row]
    }

    return obj
}

async function envia_painel(client, user, interaction, voice_channel, canal_guild, obj) {

    canal_guild.send(obj)
        .then(async (message) => {
            voice_channel.mid = client.encrypt(message.id)
            await voice_channel.save()

            if (interaction)
                client.tls.reply(interaction, user, "mode.voice_channels.dados_perdidos", true, 70)
        })
}