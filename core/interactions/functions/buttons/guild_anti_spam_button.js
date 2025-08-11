const { ChannelType, EmbedBuilder } = require('discord.js')

const { listAllGuildStrikes, getGuildStrike } = require('../../../database/schemas/Guild_strikes')

const { loggerMap } = require('../../../formatters/patterns/guild')

// 1 -> Ativar ou desativar o módulo anti-spam
// 2 -> Ativar ou desativar os strikes
// 3 -> Ativar ou desativar os links suspeitos
// 7 -> Ativar ou desativar as notificações do anti-spam
// 8 -> Ativar ou desativar a punição de moderadores no servidor
// 25 -> Altera o tipo de varredura do anti-spam

const operations = {
    1: { action: "conf.spam", page: 0 },
    2: { action: "spam.strikes", page: 0 },
    3: { action: "spam.suspicious_links", page: 1 },
    7: { action: "spam.notify", page: 2 },
    8: { action: "spam.manage_mods", page: 1 },
    25: { action: "spam.scanner.links", page: 0 }
}

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "panel_guild_anti_spam", pagina_guia = 0
    let guild = await client.getGuild(interaction.guild.id)

    if (operacao > 3) pagina_guia = 2

    // Sem canal de avisos definido, solicitando um canal
    if (!guild.spam.channel && !guild.logger.channel) {
        reback = "panel_guild.0"
        operacao = 6
    }

    // Tratamento dos cliques
    // 0 -> Entrar no painel de cliques
    // 4 -> Sub-menu para configurar os Strikes
    // 5 -> Quantidade de ativações para considerar spam
    // 6 -> Escolher canal de avisos

    if (operations[operacao]) ({ guild, pagina_guia } = client.switcher({ guild, operations, operacao }))
    else if (operacao === 4) {

        const strikes = await listAllGuildStrikes(interaction.guild.id)

        // Submenu para navegar pelos strikes do servidor
        let botoes = [], row = [
            { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "panel_guild_anti_spam.0" }
        ], indice_matriz = 5

        if (strikes.length < 1) {
            await getGuildStrike(interaction.guild.id, 0)

            botoes.push({
                id: "strike_configure_button", name: "1°", type: 1, emoji: client.emoji(39), data: `9|0`
            })
        } else
            strikes.forEach(strike => {

                botoes.push({ id: "strike_configure_button", name: `${strike.rank + 1}°`, type: 1, emoji: strike.action ? loggerMap[strike.action] : client.emoji(39), data: `9|${strike.rank}` })

                if (strike.action)
                    if (strike.action === "member_ban" && indice_matriz == 5)
                        indice_matriz = strike.rank
            })

        if (botoes.length < 5) // Botão para adicionar um novo strike
            row.push({ id: "strike_configure_button", name: { tls: "menu.botoes.novo_strike", alvo: user }, type: 2, emoji: client.emoji(43), data: `9|${strikes.length < 1 ? 1 : strikes.length}` })

        let texto_aviso_indice = ""

        if (indice_matriz !== 5 && strikes.length < 5)
            texto_aviso_indice = "\n```🐱‍👤 Há um strike configurado para banir membros antes do 5° strike, strikes posteriores podem ser editados, porém não terão efeito prático caso um membro ultrapasse o strike do Ban e retorne caso venha a ser desbanido no futuro.```"

        const embed = new EmbedBuilder()
            .setTitle(`> ${client.emoji("3")} ${client.tls.phrase(user, "mode.spam.configurando_strikes")}`)
            .setColor(client.embed_color(user.misc.color))
            .setDescription(`${client.tls.phrase(user, "mode.spam.descricao_configuracao_strike")}${texto_aviso_indice}`)
            .setFooter({
                text: client.tls.phrase(user, "mode.warn.customizacao_rodape"),
                iconURL: interaction.user.avatarURL({ dynamic: true })
            })

        return interaction.update({
            embeds: [embed],
            components: [client.create_buttons(botoes, interaction), client.create_buttons(row, interaction)],
            flags: "Ephemeral"
        })

    } else if (operacao === 5) {

        // Definindo a quantia de ativações que os usuários precisam receber no servidor para serem considerados como spam
        const data = {
            title: { tls: "menu.menus.escolher_numero" },
            pattern: "numbers",
            alvo: "guild_spam_strikes",
            raw: true,
            values: ["3", "4", "5", "6", "7", "8", "9", "10"]
        }

        let row = client.create_buttons([
            { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: "panel_guild_anti_spam.2" }
        ], interaction)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), row],
            flags: "Ephemeral"
        })

    } else if (operacao === 6) {

        // Definindo o canal de avisos do anti-spam
        const data = {
            title: { tls: "menu.menus.escolher_canal" },
            pattern: "choose_channel",
            alvo: "guild_spam#channel",
            reback: "browse_button.guild_anti_spam_button",
            operation: operacao,
            values: []
        }

        if (guild.spam.channel)
            data.values.push({ name: client.tls.phrase(user, "manu.guild_data.remover_canal"), id: "none" })

        // Listando os canais do servidor
        data.values = data.values.concat(await client.getGuildChannels(interaction, user, ChannelType.GuildText, guild.spam.channel))

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        const row = client.menu_navigation(user, data, pagina || 0)
        let botoes = [
            { id: "return_button", name: { tls: "menu.botoes.retornar", alvo: user }, type: 0, emoji: client.emoji(19), data: `${reback}.2` },
            { id: "guild_anti_spam_button", name: { tls: "menu.botoes.atualizar", alvo: user }, type: 1, emoji: client.emoji(42), data: "4" }
        ]

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            flags: "Ephemeral"
        })
    }

    if (operacao === 10) pagina_guia = 1

    // Salvando os dados atualizados
    if (operations[operacao]) await guild.save()

    // Redirecionando a função para o painel de anti-spam
    require('../../chunks/panel_guild_anti_spam')({ client, user, interaction, pagina_guia })
}