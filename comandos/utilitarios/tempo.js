const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { api_key } = require('../../config.json')
const { tempo_atual } = require('./tempo_atual.json')

const base_url = "http://api.openweathermap.org/data/2.5/weather?"

module.exports = async({message, args}) => {

    let pesquisa = "";

    if(args.length < 1){
        message.channel.send(`${message.author} informe o nome de alguma cidade para buscar\nPor exemplo como \`.at sao paulo\``)
        return
    }

    for(let i = 0; i < args.length; i++){
        pesquisa += args[i]

        if(args[i + 1] !== undefined)
            pesquisa += " "
    }

    let url_completa = base_url +"appid="+ api_key +"&q="+ pesquisa + "&units=metric";

    fetch(url_completa)
    .then(response => response.json())
    .then( async res => {
        if(res.cod == '404')
            message.channel.send(`${message.author} não encontrei nada relacionado a \``+ pesquisa +`\`, tente novamente`);
        else{

            // let data = new Date()

            // data -= parseInt(res.timezone)
            // data = Date(data)

            // console.log(res)
            // +'**\n:clock1230: **Hora local:** `'+ data +'`'

            let bandeira_pais = ' :flag_'+ (res.sys.country).toLowerCase() +':';

            const cidade_encontrada = new MessageEmbed()
            .setTitle(':boom: Tempo agora em '+ res.name + ' - '+ res.sys.country + ' '+ bandeira_pais)
            .setColor(0x29BB8E)
            .setDescription('**'+ tempo_atual[res.weather[0].id] + '**')
            .setThumbnail('http://openweathermap.org/img/wn/'+ res.weather[0].icon +'@2x.png')
            .addFields(
                { name: ':thermometer: **Temperatura**', value: ":small_orange_diamond: **Atual**: `"+ res.main.temp +"°C`\n:small_red_triangle: **Máxima:** `"+ res.main.temp_max +"°C`\n:small_red_triangle_down: **Mínima:** `"+ res.main.temp_min +"°C`", inline: true },
                { name: ':sweat_drops: **Umidade**', value: "**Atual: **`"+ res.main.humidity +"%`", inline: true },
                { name: ':wind_chime: **Velocidade do vento**', value: " **Atual: **`"+ ( res.wind.speed * 3.6).toFixed(2) +" km/h`", inline: true },
            )
            .addField(':fire: **Sensação Térmica**', '**Atual: **`'+ res.main.feels_like +'°C`', true)
            .addField(':compression: **Pressão do ar**', '**Atual: **`'+ res.main.pressure +' kPA`', true);

            message.channel.send(cidade_encontrada);
        }
    })
}