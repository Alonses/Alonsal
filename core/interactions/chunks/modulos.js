const { PermissionsBitField } = require('discord.js')
const { listAllUserModules, listAllGuildModules, getModulesPrice } = require('../../database/schemas/Module')

const { moduleTypes } = require('../../formatters/patterns/user')

module.exports = async ({ client, user, interaction }) => {

    // Listando todos os módulos do usuário
    const modulos = await listAllUserModules(user.uid)
    const modulos_guild = await listAllGuildModules(client.encrypt(interaction.guild.id))
    let user_moderador = false, guild

    // Verificando se o usuário possui permissões para gerenciar os canais do servidor
    if (await client.permissions(interaction, interaction.user.id, [PermissionsBitField.Flags.ManageChannels])) {
        guild = await client.getGuild(interaction.guild.id)
        user_moderador = true
    }

    // Verificando se há modulos configurados
    if (modulos.length < 1 && modulos_guild.length < 1) return client.tls.report(interaction, user, "misc.modulo.sem_modulo", true, client.emoji(0))

    // Ajusta o limite de módulos para assinantes
    const limite_modulo = client.cached.subscribers.has(user.uid) ? 10 : 3, limite_modulo_guild = (guild.misc?.subscription.active ? 10 : 2) - modulos_guild.length
    const montante = await getModulesPrice(client, user.uid), user_modules = {}, guild_modules = {}
    let descricao_modulos = "👤 **Módulos pessoais**\n"

    modulos.forEach(modulo => { // Somando os tipos de módulos
        if (user_modules[modulo.type]) user_modules[modulo.type]++
        else user_modules[modulo.type] = 1
    })

    if (user_moderador)
        modulos_guild.forEach(modulo => {
            if (guild_modules[modulo.type]) guild_modules[modulo.type]++
            else guild_modules[modulo.type] = 1
        })

    // Formatando os módulos para visualização no embed
    for (let i = 0; i < Object.keys(moduleTypes).length; i++)
        if (i !== 2) descricao_modulos += `( \`${user_modules[`${i}`] || 0} / ${limite_modulo}\` ) **${client.tls.phrase(user, `misc.modulo.modulo_${i}`)}**\n`

    if (user_moderador && modulos_guild.length > 0) {

        descricao_modulos += "\n🌐 **Módulos do servidor**\n"

        for (let i = 0; i < Object.keys(moduleTypes).length; i++)
            if (i !== 6 && i !== 2) descricao_modulos += `( \`${guild_modules[`${i}`] || 0} / ${limite_modulo_guild}\` ) **${client.tls.phrase(user, `misc.modulo.modulo_${i}`)}**\n`
    }

    const embed = client.create_embed({
        title: { tls: "misc.modulo.titulo" },
        description: { tls: "misc.modulo.descricao_lista", replace: [modulos.length > 1 ? `\`${modulos.length} ${client.tls.phrase(user, "misc.modulo.modulos_configurados")}` : client.tls.phrase(user, "misc.modulo.modulo_configurado"), `${montante}${client.cached.subscribers.has(user.uid) ? ` (${client.getSubscriberDiscount()}% OFF 🌟)` : ""}`, descricao_modulos] },
        footer: { text: { tls: "misc.modulo.selecionar_modulo" }, iconURL: interaction.user.avatarURL({ dynamic: true }) }
    }, user)

    const data = {
        title: { tls: "misc.modulo.selecionar_modulo", emoji: 1 },
        pattern: "modules_browse",
        alvo: "modules_browse",
        values: []
    }

    if (modulos)
        data.values = data.values.concat(modulos)

    if (modulos_guild)
        data.values = data.values.concat(modulos_guild)

    const row = client.create_buttons([
        { id: "modules_list", name: { tls: "menu.botoes.atualizar" }, type: 1, emoji: client.emoji(42), data: "0" }
    ], interaction, user)

    const obj = {
        embeds: [embed],
        components: [client.create_menus({ interaction, user, data }), row],
        flags: "Ephemeral"
    }

    client.reply(interaction, obj)
}