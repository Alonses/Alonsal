const { getRoleAssigner } = require('../database/schemas/Role_assigner')

let membros_sv = []

let operacao_ativa = false
let updates = [0, 0, 0, 0, 0]
let emoji_dancante
let cargos
let repeticao
let timestamp

module.exports = async ({ client, user, interaction, force_stop }) => {

    cargos = await getRoleAssigner(interaction.guild.id)

    if (force_stop) {

        interaction.update({
            content: `:octagonal_sign: | Operação cancelada\`\`\`fix\n👤Usuários atualizados: ${updates[1]}\n🚯Usuários ignorados: ${updates[2]} (já possuem o cargo)\n🚯Usuários ignorados: ${updates[4]} (restrições de cargos definidos)\n🤖Bots ignorados: ${updates[3]}\`\`\``,
            components: []
        })

        updates = [0, 0, 0, 0, 0]
        membros_sv = []
        operacao_ativa = 0

        clearTimeout(repeticao)
        return
    }

    if (!operacao_ativa) {

        emoji_dancante = client.emoji("emojis_dancantes")

        const list = await client.guilds(interaction.guild.id)
        await list.members.fetch()
            .then(members => {
                membros_sv = members.map(member => member.id) // ID's dos membros do servidor
            })

        updates[0] = membros_sv.length

        await interaction.update({
            components: [client.create_buttons([{ id: "role_assigner", name: "Interromper operação", type: 3, emoji: client.emoji(13), data: "11" }], interaction)],
            ephemeral: true
        })

        timestamp = client.timestamp() + (updates[0] * 1.5) + 1
        alterar_users(client, user, interaction, 0)
    } else
        interaction.update({
            content: ":hotsprings: | Há uma operação ativa no momento",
            ephemeral: true
        })
}

// updates[0] -> Quantidade de membros no servidor
// updates[1] -> Membro atualizado
// updates[2] -> Membros ignorados
// updates[3] -> Membros bots ignorados
// updates[4] -> Membros ignorados por cargos definidos

async function alterar_users(client, user, interaction, contador) {

    let member = await client.getMemberGuild(interaction.guild.id, membros_sv[0]) // Coleta

    if (!member.user.bot) { // Atualiza apenas usuários que não são bots

        let user_ignorado = false

        if (cargos.ignore) {
            const cargos_ignorados = cargos?.ignore.split(".")

            // Verificando se o usuário possui algum cargo listado para ignorar
            cargos_ignorados.forEach(cargo_ignorado => {
                if (member.roles.cache.has(cargo_ignorado))
                    user_ignorado = true

                if (cargo_ignorado === "all" && member.roles.cache.size > 1)
                    user_ignorado = true
            })
        }

        cargos.atribute.split(".").forEach(async cargo_interno => {

            if (!member.roles.cache.has(cargo_interno)) // Adicionando

                if (cargos.ignore) {
                    if (!user_ignorado) // Membro não possui um cargo ignorado
                        await member.roles.add(cargo_interno).then(updates[1]++).catch(console.error)
                    else
                        updates[4]++
                } else // Adicionando
                    await member.roles.add(cargo_interno).then(updates[1]++).catch(console.error)
            else
                updates[2]++
        })
    } else
        updates[3]++

    contador++

    repeticao = setTimeout(() => {
        membros_sv.shift()

        if (membros_sv.length > 0) {
            interaction.editReply({ content: `${emoji_dancante} | Atualizando usuários: \`${contador} de ${updates[0]}\`\n( Término estimado <t:${timestamp}:R> )` })
            alterar_users(client, user, interaction, contador)
        } else {
            operacao_ativa = 0
            interaction.editReply({
                content: `:checkered_flag: | Operação concluída\`\`\`fix\n👤Usuários atualizados: ${updates[1]}\n🚯Usuários ignorados: ${updates[2]} (já possuem o cargo)\n🚯Usuários ignorados: ${updates[4]} (restrições de cargos definidos)\n🤖Bots ignorados: ${updates[3]}\`\`\``,
                components: []
            })

            client.sendDM(user, { data: `:checkered_flag: | Operação concluída!\`\`\`fix\n👤Usuários atualizados: ${updates[1]}\n🚯Usuários ignorados: ${updates[2]} (já possuem o cargo)\n🚯Usuários ignorados: ${updates[4]} (restrições de cargos definidos)\n🤖Bots ignorados: ${updates[3]}\`\`\`` })
        }
    }, 1500)
}