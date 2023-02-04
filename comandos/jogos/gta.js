const { SlashCommandBuilder } = require('discord.js')

const GTADAY = 48 // minutos

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gta")
        .setDescription("⌠🎲⌡ Shows the current time in GTA Online")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ Mostra a hora atual no GTA Online',
            "es-ES": '⌠🎲⌡ Muestra la hora actual en GTA Online',
            "fr": '⌠🎲⌡ Affiche l\'heure actuelle dans GTA Online',
            "it": '⌠🎲⌡ Mostra l\'ora corrente in GTA Online',
            "ru": '⌠🎲⌡ Показывает текущее время в GTA Online'
        }),
    async execute(client, user, interaction) {

        let currentDate = new Date()

        // Previne erros entre meia noite e 5 da manhã
        let hora_variavel = currentDate.getHours() - 5 > 0 ? currentDate.getHours() - 5 : 19 + currentDate.getHours()
        let horaAtual = `${hora_variavel}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`

        const hora_gta = dateGTA(timeToMin(horaAtual))

        let emoji_horario = hora_gta.slice(0, 2) < 20 && hora_gta.slice(0, 2) > 6 ? hora_gta.slice(0, 2) > 17 ? ":city_sunset:" : ":park:" : ":bridge_at_night:"

        interaction.reply({ content: `${emoji_horario} | ${client.tls.phrase(user, "game.gta.horario").replace("horario_repl", hora_gta)}`, ephemeral: user.misc.ghost_mode })
    }
}

function timeToMin(date = "") {

    /*
       Transforma a data atual em minutos
    */

    const times = date.split(":").map(val => parseInt(val))
    return (times[0] * 60) + times[1] + (times[2] / 60)
}

const decHourToMin = (time) => {

    /*
      Tranforma o numero decimal das horas em minutos 
      Ex. "12.5" seria "12:30"
    */

    const hour = Math.floor(time)
    const min = time - hour

    return min * 60
}

function dateGTA(time) {

    const min = time % 48

    const hour = Math.floor((min / GTADAY) * 24)
    const minuts = Math.floor(decHourToMin((min / GTADAY) * 24))

    const hora = hour < 10 ? `0${hour}` : hour
    const minutos = minuts < 10 ? `0${minuts}` : minuts

    return `${hora}:${minutos}`
}