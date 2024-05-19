const { PermissionsBitField, EmbedBuilder } = require('discord.js')

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

    const cargo = await getTimedRoleAssigner(user_alvo, interaction.guild.id)

    if (operacao === 0) {

        // Excluindo o cargo salvo em cache para configuração
        await removeCachedUserRole(user_alvo, interaction.guild.id)

        return client.reply(interaction, {
            content: ":no_entry_sign: | Operação cancelada.",
            components: []
        })

    } else if (operacao === 1) {

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}|${user_alvo}` },
            { id: "role_timed_assigner", name: "Confirmar", type: 2, emoji: client.emoji(10), data: `10.${user_alvo}` }
        ]

        return client.reply(interaction, {
            components: [client.create_buttons(botoes, interaction)]
        })

    } else if (operacao === 2) {

        // Permissão para atualizar os cargos de membros do servidor
        if (!await client.permissions(interaction, client.id(), PermissionsBitField.Flags.ManageRoles))
            return interaction.update({
                content: client.tls.phrase(user, "mode.anuncio.permissao_cargos", 7),
                ephemeral: true
            })

        // Menu para escolher o cargo que será concedido ao membro
        const data = {
            title: { tls: "menu.menus.escolher_cargo" },
            pattern: "choose_role",
            alvo: "role_timed_assigner_give#role",
            reback: "browse_button.role_timed_assigner",
            operation: operacao,
            submenu: `${user_alvo}.${operacao}`,
            values: await client.getGuildRoles(interaction, cargo.rid)
        }

        // Subtrai uma página do total ( em casos de exclusão de itens e pagina em cache )
        if (data.values.length < pagina * 24) pagina--

        let botoes = [
            { id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}|${user_alvo}` },
            { id: "role_timed_assigner", name: client.tls.phrase(user, "menu.botoes.atualizar"), type: 1, emoji: client.emoji(42), data: `2.${user_alvo}` }
        ]

        let row = client.menu_navigation(client, user, data, pagina || 0)

        if (row.length > 0) // Botões de navegação
            botoes = botoes.concat(row)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data, pagina }), client.create_buttons(botoes, interaction)],
            ephemeral: true
        })

    } else if (operacao === 3) {

        // Submenu para escolher o tempo de expiração do cargo
        const valores = []

        Object.keys(defaultRoleTimes).forEach(key => { valores.push(defaultRoleTimes[key]) })

        const data = {
            title: { tls: "menu.menus.escolher_tempo_remocao" },
            pattern: "numbers",
            alvo: "role_timed_assigner_timeout",
            submenu: `${user_alvo}.${operacao}`,
            values: valores
        }

        let row = client.create_buttons([{
            id: "return_button", name: client.tls.phrase(user, "menu.botoes.retornar"), type: 0, emoji: client.emoji(19), data: `${reback}|${user_alvo}`
        }], interaction)

        return interaction.update({
            components: [client.create_menus({ client, interaction, user, data }), row],
            ephemeral: true
        })
    }

    if (operacao === 10) { // Atribuindo o cargo selecionado ao membro

        // Cargo informado possui permissões moderativas
        if (!await client.rolePermissions(interaction, cargo.rid, [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.Administrator]))
            return interaction.update({
                content: ":passport_control: | Selecione um cargo que não contenha permissões de moderação para poder atribuir ao membro.",
                ephemeral: true
            })

        // Membro já possui o cargo mencionado
        if (await client.hasRole(interaction, cargo.rid, cargo.uid))
            return interaction.update({
                content: ":passport_control: | Este membro já possui o cargo informado, tente novamente com um cargo que ele ainda não possua.",
                ephemeral: true
            })

        const role = interaction.guild.roles.cache.find((r) => r.id === cargo.rid)
        const bot_member = await client.getMemberGuild(interaction.guild.id, client.id())

        if (role.position > bot_member.roles.highest.position)
            return interaction.update({
                content: ":passport_control: | O cargo mencionado é maior que o meu! Não posso atribuir este cargo ao membro.",
                ephemeral: true
            })

        // Adicionado o cargo temporário ao membro
        const membro_guild = await client.getMemberGuild(interaction, cargo.uid)
        membro_guild.roles.add(role).then(async () => {

            // Atualizando os status do cargo para poder cronometrar
            cargo.valid = true
            cargo.timestamp = client.timestamp() + defaultRoleTimes[cargo.timeout]
            await cargo.save()

            let motivo = ""

            if (cargo.relatory)
                motivo = `\n\`\`\`fix\n💂‍♂️ Nota do moderador:\n\n${cargo.relatory}\`\`\``

            const embed = new EmbedBuilder()
                .setTitle("> Um novo cargo temporário!")
                .setColor(0x29BB8E)
                .setDescription(`:new: | ${membro_guild} ganhou um cargo temporário neste servidor!${motivo}`)
                .addFields(
                    {
                        name: `${client.defaultEmoji("playing")} **Cargo**`,
                        value: `${client.emoji("mc_name_tag")} \`${role.name}\`\n<@&${cargo.rid}>`,
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("time")} **Validade**`,
                        value: `<t:${cargo.timestamp}:f>\n( <t:${cargo.timestamp}:R> )`,
                        inline: true
                    },
                    {
                        name: `${client.defaultEmoji("person")} **Moderador**`,
                        value: `${client.emoji("icon_id")} \`${cargo.assigner}\`\n\`${cargo.assigner_nick}\`\n( <@${cargo.assigner}> )`,
                        inline: true
                    }
                )

            const guild = await client.getGuild(interaction.guild.id)

            // Enviando o aviso ao canal do servidor
            client.notify(guild.timed_roles.channel, { content: `${membro_guild}`, embeds: [embed] })
            atualiza_roles()

            return interaction.update({
                content: `:white_check_mark: | O Cargo temporário ( <@&${cargo.rid}> ) foi adicionado ao <@${cargo.uid}>!\n\nEste cargo ficará vinculado ao membro até <t:${cargo.timestamp}:f>, ou até que um moderador remova manualmente.`,
                embeds: [],
                components: [],
                ephemeral: true
            })
        }).catch(console.error)

    } else {

        await cargo.save()
        require('../../chunks/role_assigner')({ client, user, interaction })
    }
}