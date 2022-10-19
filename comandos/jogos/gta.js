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

            console.log(time)
            const min = time % 48

            const hour = Math.floor((min / GTADAY) * 24)
            const minuts = Math.floor(decHourToMin((min / GTADAY) * 24))

            const hora = hour < 10 ? `0${hour}` : hour
            const minutos = minuts < 10 ? `0${minuts}` : minuts

            return `${hora}:${minutos}`
        }

        let currentDate = new Date()
        let horaAtual = `${currentDate.getHours() - 5}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
        console.log(`Hora Real -> ${horaAtual}`)
        console.log(`Hora no GTA -> ${dateGTA(timeToMin(horaAtual))}`)

        interaction.reply(`Agora deve ser \`${dateGTA(timeToMin(horaAtual))}\` no gta`)
    }
}