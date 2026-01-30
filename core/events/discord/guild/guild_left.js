const { disableGuildFeatures } = require('../../../database/schemas/Guild')
const { verifyDynamicBadge } = require('../../../database/schemas/User_badges')

const { badges } = require('../../../formatters/patterns/user')

module.exports = async ({ client, guild }) => {

    if (client.id() !== process.env.client_1 || !process.env.channel_server) return

    // Desligando as funções do servidor
    await disableGuildFeatures(client, guild.id)

    // Verificando qual usuário mais convidou o bot
    verifyDynamicBadge(client, "hoster", badges.HOSTER)

    // Verificando se o bot deve notificar ao sair de servidores
    if (!bot.x.guild_joins) return

    const embed = client.create_embed({
        title: "> 🔴 Server update",
        color: "vermelho",
        description: `:globe_with_meridians: ( \`${guild.id}\` | \`${guild.name}\` )`,
        timestamp: true
    })

    client.execute("notify", {
        id_canal: process.env.channel_server,
        conteudo: { embeds: [embed] }
    })
}