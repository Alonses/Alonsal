const { ChannelType } = require('discord.js')

const { atualiza_modulos } = require('../../../auto/triggers/modules')
const { getModule, dropModule } = require('../../../database/schemas/Module')

const { moduleDays } = require('../../../formatters/patterns/user')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    // Gerenciamento de anotações
    let operacao = parseInt(dados.split(".")[1])
    const hash = dados.split(".")[2]
    dados = `0.${hash}`

    // Códigos de operação
    // 0 -> Sub menu para confirmar exclusão

    // 5 -> Confirma exclusão
    // 6 -> Cancela exclusão

    // 1 -> (Des)ativa módulo
    // 3 -> Alterar dia

    // 10 -> (Des)ativa o módulo como vitrine
    // 11 -> (Des)ativa o módulo de tempo com retorno resumido

    let row = client.create_buttons([
        { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "modulos" }
    ], interaction, user)

    const modulo = await getModule(hash)

    if (!modulo) // Verificando se o módulo ainda existe
        return interaction.update({
            content: client.tls.phrase(user, "misc.modulo.modulo_inexistente", 1),
            embeds: [],
            components: [row],
            flags: "Ephemeral"
        })

    // Forçando escolha de canal para envio do módulo no servidor
    if (modulo.misc.scope === "guild" && !modulo.misc.cid) operacao = 12

    if (operacao === 1) {

        // (Des)ativa o módulo
        // Impedindo que o módulo de clima seja ativado caso não haja um local padrão
        if (modulo.type === 0 && !user.misc.locale)
            return interaction.update({
                content: client.tls.phrase(user, "util.tempo.modulo_sem_locale", client.emoji(0)),
                flags: client.decider(user?.conf.ghost_mode, 0) ? "Ephemeral" : null
            })

        modulo.stats.active = !modulo.stats.active
        await modulo.save()

    } else if (operacao === 3) {

        const dias = []

        // Filtrando os dias que não estão selecionados
        Object.keys(moduleDays).forEach(dia => {
            if (parseInt(dia) !== modulo.stats.days)
                dias.push(dia)
        })

        // Alterando o idioma do servidor
        const data = {
            title: { tls: "menu.menus.escolher_frequencia" },
            pattern: "modules_select_day",
            alvo: "modules_select_day",
            reback: "verify_module",
            hash: hash,
            values: dias
        }

        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), client.create_buttons([
                { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: `verify_module.${hash}` }
            ], interaction, user)],
            flags: "Ephemeral"
        })
    } else if (operacao === 0) {

        const botoes = [
            { id: "module_button", name: { tls: "menu.botoes.confirmar" }, type: 2, emoji: client.emoji(10), data: `5|${hash}` },
            { id: "module_button", name: { tls: "menu.botoes.cancelar" }, type: 3, emoji: client.emoji(0), data: `6|${hash}` }
        ]

        return client.reply(interaction, {
            content: client.tls.phrase(user, "misc.modulo.confirmar_exclusao"),
            components: [client.create_buttons(botoes, interaction, user)]
        })
    } else if (operacao === 5) {

        // Excluindo o módulo do usuário
        await dropModule(hash)

        const obj = {
            content: client.tls.phrase(user, "misc.modulo.excluido", 13),
            embeds: [],
            components: [row],
        }

        if (client.decider(user?.conf.ghost_mode, 0))
            obj.flags = "Ephemeral"

        return client.reply(interaction, obj)

    } else if (operacao === 10) {

        // (Des)ativando o módulo como vitrine
        modulo.rotative.active = !modulo.rotative.active
        await modulo.save()
    } else if (operacao === 11) {

        // (Des)ativando o retorno do módulo de tempo como resumido
        modulo.misc.resumed = !modulo.misc.resumed
        await modulo.save()

    } else if (operacao === 12) {

        // Escolhendo o canal para envio do módulo no servidor
        const data = {
            title: { tls: "menu.menus.escolher_canal" },
            pattern: "choose_channel",
            alvo: "guild_module#channel",
            reback: "browse_button.module_button",
            submenu: hash,
            operation: operacao,
            values: []
        }

        // Listando os canais do servidor
        data.values = data.values.concat(await client.getGuildChannels(interaction, user, ChannelType.GuildText, modulo.misc.cid))

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        const row = client.menu_navigation(user, data, pagina || 0)
        let botoes = [
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 0, emoji: client.emoji(19), data: "module_button.0" },
            { id: "module_button", name: { tls: "menu.botoes.atualizar" }, type: 1, emoji: client.emoji(42), data: `12.${hash}` }
        ]

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })
    }

    // Atualizando a lista de módulos salvos localmente
    if (operacao !== 0) await atualiza_modulos(client)

    require('../../chunks/verify_module')({ client, user, interaction, dados })
}