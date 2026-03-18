const { PermissionsBitField } = require('discord.js')

const { getTimedRoleAssigner, removeCachedUserRole } = require('../../../database/schemas/User_roles')
const { atualiza_roles } = require('../../../auto/triggers/user_roles')

const { defaultRoleTimes } = require('../../../formatters/patterns/timeout')

module.exports = async ({ client, user, interaction, dados, pagina }) => {

    let operacao = parseInt(dados.split(".")[1]), reback = "role_timed_assigner"
    let user_alvo = dados.split(".")[2]

    // Operações
    // 0 -> Remove a configuração salva em cache
    // 1 -> Iniciar atribuição

    // 2 -> Escolher cargos
    // 3 -> Escolher tempo de expiração

    // 10 -> Confirmar a atribuição de cargo para o membro

    const cargo = await getTimedRoleAssigner(client.encrypt(user_alvo), client.encrypt(interaction.guild.id))

    if (operacao === 0) {

        // Excluindo o cargo salvo em cache para configuração
        removeCachedUserRole(client.encrypt(user_alvo), client.encrypt(interaction.guild.id))

        return client.reply(interaction, {
            content: client.tls.phrase(user, "menu.botoes.operacao_cancelada", 11),
            components: []
        })

    } else if (operacao === 1) {

        let botoes = [
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: `${reback}|${user_alvo}` },
            { id: "role_timed_assigner", name: { tls: "menu.botoes.confirmar" }, type: 1, emoji: client.emoji(10), data: `10.${user_alvo}` }
        ]

        return client.reply(interaction, {
            components: [client.create_buttons(botoes, interaction, user)]
        })

    } else if (operacao === 2) {

        // Permissão para atualizar os cargos de membros do servidor
        if (!await client.execute("permissions", { interaction, id_user: client.id(), permissions: PermissionsBitField.Flags.ManageRoles }))
            return interaction.update({
                content: client.tls.phrase(user, "mode.anuncio.permissao_cargos", 7),
                flags: "Ephemeral"
            })

        // Menu para escolher o cargo que será concedido ao membro
        const data = {
            title: { tls: "menu.menus.escolher_cargo" },
            pattern: "choose_role",
            alvo: "role_timed_assigner_give#role",
            reback: "browse_button.role_timed_assigner",
            operation: operacao,
            submenu: `${user_alvo}.${operacao}`,
            values: await client.execute("getGuildRoles", { interaction, ignore_role: client.decifer(cargo.rid) })
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        const row = client.execute("menu_navigation", { user, data, pagina })
        let botoes = [
            { id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: `${reback}|${user_alvo}` },
            { id: "role_timed_assigner", name: { tls: "menu.botoes.atualizar" }, type: 0, emoji: client.emoji(42), data: `2.${user_alvo}` }
        ]

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data, pagina }), client.create_buttons(botoes, interaction, user)],
            flags: "Ephemeral"
        })

    } else if (operacao === 3) {

        // Submenu para escolher o tempo de expiração do cargo
        const valores = []
        Object.keys(defaultRoleTimes).forEach(key => { if (parseInt(key) !== cargo.timeout) valores.push(`${key}.${defaultRoleTimes[key]}`) })

        const data = {
            title: { tls: "menu.menus.escolher_tempo_remocao" },
            pattern: "numbers",
            alvo: "role_timed_assigner_timeout",
            submenu: `${user_alvo}.${operacao}`,
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: { tls: "menu.botoes.retornar" }, type: 2, emoji: client.emoji(19), data: `${reback}|${user_alvo}`
        }], interaction, user)

        return interaction.update({
            components: [client.create_menus({ interaction, user, data }), row],
            flags: "Ephemeral"
        })
    }

    if (operacao === 10) { // Atribuindo o cargo selecionado ao membro

        // Verificando se o cargo informado não possui permissões moderativas
        if (await client.execute("rolePermissions", { interaction, id_role: client.decifer(cargo.rid), permissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.Administrator] }))
            return interaction.update({
                content: client.tls.phrase(user, "mode.timed_roles.cargo_moderativo", 7),
                flags: "Ephemeral"
            })

        // Membro já possui o cargo mencionado
        if (await client.execute("hasRole", { interaction, id_role: client.decifer(cargo.rid), id_user: user_alvo }))
            return interaction.update({
                content: client.tls.phrase(user, "mode.timed_roles.cargo_ja_concedido", 7),
                flags: "Ephemeral"
            })

        const role = client.getGuildRole(interaction, client.decifer(cargo.rid))
        const bot_member = await client.execute("getMemberGuild", { interaction, id_user: client.id() })

        if (role.position > bot_member.roles.highest.position)
            return interaction.update({
                content: client.tls.phrase(user, "mode.timed_roles.cargo_superior", 7),
                flags: "Ephemeral"
            })

        // Adicionando o cargo temporário ao membro
        const membro_guild = await client.execute("getMemberGuild", { interaction, id_user: user_alvo })
        membro_guild.roles.add(role).then(async () => {

            // Atualizando os status do cargo para poder cronometrar
            cargo.valid = true
            cargo.timestamp = client.execute("timestamp") + defaultRoleTimes[cargo.timeout]
            await cargo.save()

            let motivo = ""
            const guild = await client.getGuild(interaction.guild.id)

            if (cargo.relatory)
                motivo = `\n\`\`\`fix\n💂‍♂️ ${client.tls.phrase(guild, "mode.timed_roles.nota_moderador")}\n\n${client.decifer(cargo.relatory)}\`\`\``

            const embed = client.create_embed({
                title: { tls: "mode.timed_roles.titulo_cargo_concedido" },
                color: "turquesa",
                description: { tls: "mode.timed_roles.descricao_cargo_concedido", emoji: 43, replace: [membro_guild, motivo] },
                fields: [
                    {
                        name: `${client.defaultEmoji("playing")} **${client.tls.phrase(guild, "mode.anuncio.cargo")}**`,
                        value: `${client.emoji("mc_name_tag")} \`${role.name}\`\n<@&${client.decifer(cargo.rid)}>`,
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("time")} **${client.tls.phrase(guild, "mode.warn.validade")}**`,
                        value: `<t:${cargo.timestamp}:f>\n( <t:${cargo.timestamp}:R> )`,
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("person")} **${client.tls.phrase(guild, "mode.warn.moderador")}**`,
                        value: `${client.emoji("icon_id")} \`${client.decifer(cargo.assigner)}\`\n${client.emoji("mc_name_tag")} \`${client.decifer(cargo.assigner_nick)}\`\n( <@${client.decifer(cargo.assigner)}> )`,
                        inline: true
                    }
                ]
            }, guild)

            // Enviando o aviso ao canal do servidor
            client.execute("notify", {
                id_canal: guild.timed_roles.channel,
                conteudo: { content: `${membro_guild}`, embeds: [embed] }
            })
            atualiza_roles()

            return interaction.update({
                content: client.tls.phrase(user, "mode.timed_role.cargo_concedido", 10, [client.decifer(cargo.rid), user_alvo, cargo.timestamp]),
                embeds: [],
                components: [],
                flags: "Ephemeral"
            })
        }).catch(console.error)

    } else {

        await cargo.save()
        require('../../chunks/role_assigner')({ client, user, interaction })
    }
}