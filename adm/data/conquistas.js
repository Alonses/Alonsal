module.exports = async (client, modo, id_alvo, interaction) => {

    const user = await client.getUser(id_alvo)

    // const { conquistas } = require(`../../arquivos/idiomas/${user.lang}.json`)

    const all_achievements = []

    user.conquistas.forEach(valor =>
        all_achievements.push(parseInt(Object.keys(valor)[0]))
    ) // Listando todas as conquistas obtidas pelo usuário

    if (!all_achievements.includes(modo)) { // Atribuindo a conquista o usuário

        const date1 = new Date()
        user.conquistas.push(constructJson(modo, Math.floor(date1.getTime() / 1000)))

        if (modo === 1) { // Badge por transferir um funny number para o alonsal
            user.badges.badge_list.push(constructJson('5', Math.floor(date1.getTime() / 1000)))
        }

        user.save()

        if (user?.conf.notify || true) // Notificando o usuário alvo caso ele receba notificações em DM do bot
            client.discord.users.fetch(user.id, false).then((user_interno) => {
                user_interno.send('Você acabou de ganhar uma Conquista!')
            })
    }
}

function constructJson(jsonGuild, arrayValores) {
    return { [jsonGuild]: arrayValores }
}