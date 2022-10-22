const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gta')
        .setDescription('⌠🎲⌡ Mostra a hora atual no GTA Online'),
    async execute(client, interaction) {

        const GTADAY = 48 // minutos

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

        let currentDate = new Date()

        // Previne erros entre meia noite e 5 da manhã
        let hora_variavel = currentDate.getHours() - 5 > 0 ? currentDate.getHours() - 5 : 19 + currentDate.getHours()
        let horaAtual = `${hora_variavel}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`

        const hora_gta = dateGTA(timeToMin(horaAtual))
        let emoji_horario = hora_gta.slice(0, 2) < 17 && hora_gta.slice(0, 2) > 6 ? ":park:" : ":bridge_at_night:"

        interaction.reply(`${emoji_horario} | Agora é \`${hora_gta}\` no gta online`)
    }
}