const { PermissionsBitField } = require('discord.js')

const { getUserRole } = require('../../../core/database/schemas/User_roles.js')

module.exports = async ({ client, user, interaction }) => {

    // Permissão para atualizar os cargos de membros do servidor
    if (!await client.execute("permissions", { interaction, id_user: client.id(), permissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ModerateMembers] }))
        return client.tls.reply(interaction, user, "mode.roles.sem_permissao", true, 7)

    if (!await client.execute("rolePermissions", { interaction, id_role: interaction.options.getRole("role").id, permissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.Administrator] })) // Cargo informado não é válido
        return interaction.reply({
            content: ":passport_control: | Selecione um cargo que não contenha permissões de moderação e não seja gerenciado pelo discord (como por impulsos).",
            flags: "Ephemeral"
        })

    // Membro já possui o cargo mencionado
    if (await client.execute("hasRole", { interaction, id_role: interaction.options.getRole("role").id, id_user: interaction.options.getUser("user").id }))
        return interaction.reply({
            content: ":passport_control: | Este membro já possui o cargo informado, tente novamente com um cargo que ele ainda não possua.",
            flags: "Ephemeral"
        })

    const cached_role = client.getGuildRole(interaction, interaction.options.getRole("role").id)
    const bot_member = await client.execute("getMemberGuild", { interaction, id_user: client.id() })

    if (cached_role.position > bot_member.roles.highest.position)
        return interaction.reply({
            content: ":passport_control: | O cargo mencionado é maior que o meu! Não posso atribuir este cargo ao membro.",
            flags: "Ephemeral"
        })

    const guild = await client.getGuild(interaction.guild.id)

    // Servidor sem canal de avisos definido
    if (!guild.timed_roles.channel)
        return interaction.reply({
            content: ":radio: | Antes de utilizar este comando você deve configurar um canal de avisos para notificarmos os membros sobre a atribuição!!\n\nVocê pode configurar o canal através do </panel guild:1107163338930126869> ou através do </conf guild:1094346210636214304>, ambos em `⌚ Timed roles`",
            flags: "Ephemeral"
        })

    const user_alvo = interaction.options.getUser("user")
    const role = await getUserRole(user_alvo.id, interaction.guild.id, client.execute("timestamp"))

    if (guild.timed_roles.timeout) // Sincroniza o cargo temporário com o tempo minimo do servidor
        role.timeout = guild.timed_roles.timeout

    role.rid = interaction.options.getRole("role").id
    role.nick = user_alvo.username

    // Salvando dados do moderador que acionou o comando
    role.assigner = interaction.user.id
    role.assigner_nick = interaction.user.username

    if (interaction.options?.getString("reason"))
        role.relatory = interaction.options.getString("reason")

    await role.save()

    return require('../../../core/interactions/chunks/role_timed_assigner.js')({ client, user, interaction })
}