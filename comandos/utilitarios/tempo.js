module.exports = {
    name: "tempo",
    description: "Veja informações do tempo em alguma cidade",
    aliases: [ "tp", "t", "clima", "previsao" ],
    usage: ".at brasil",
    cooldown: 5,
    permissions: [ "SEND_MESSAGES" ],
    execute(client, message, args) {

        const { MessageEmbed } = require('discord.js');
        const fetch = require('node-fetch');
        const { weather_key, time_key } = require('../../config.json');
        const { codigos_tempo } = require('../../arquivos/json/text/codigos_tempo.json');

        const base_url = "http://api.openweathermap.org/data/2.5/weather?";
        const time_url = "http://api.timezonedb.com/v2.1/get-time-zone?";

        let pesquisa = "";

        if(args.length < 1){
            message.channel.send(`${message.author} informe o nome de alguma cidade para buscar\nPor exemplo como \`.at sao paulo\``);
            return;
        }

        for(let i = 0; i < args.length; i++){
            pesquisa += args[i].normalize("NFD").replace(/[^a-zA-Zs]/g, "");

            if(args[i + 1] !== undefined)
                pesquisa += " ";
        }

        let url_completa = base_url +"appid="+ weather_key +"&q="+ pesquisa + "&units=metric";
        
        fetch(url_completa)
        .then(response => response.json())
        .then( async res => {
            if(res.cod == '404')
                message.channel.send(`${message.author} não encontrei nada relacionado a \``+ pesquisa +`\`, tente novamente`);
            else{
                let url_hora = time_url +"key="+ time_key + "&format=json&by=position&lat="+ res.coord.lat +"&lng="+ res.coord.lon;

                fetch(url_hora) // Buscando o horário local
                .then(response => response.json())
                .then( async res_hora => {
                    let bandeira_pais = ' :flag_'+ (res.sys.country).toLowerCase() +':';

                    let horario_local = res_hora.formatted;
                    horario_local = new Date(horario_local);

                    let minutos = ("0" + horario_local.getMinutes()).substr(-2); // Preservar o digito 0
                    let hora = ("0" + horario_local.getHours()).substr(-2); // Preservar o digito 0
                    let dia = horario_local.getDate();
                    
                    mes = horario_local.toLocaleString('pt', { month: 'long' });
                    hours = horario_local.getHours();

                    hours = hours % 12;
                    hours = hours ? hours : 12;

                    if(minutos >= 30)
                        hours += "30";
                    
                    horario_local = hora +":"+ minutos +" | "+ dia +" de "+ mes;
                    let relogio_emoji = ":clock"+ hours +":";

                    const cidade_encontrada = new MessageEmbed()
                    .setTitle(':boom: Tempo agora em '+ res.name + ' - '+ res.sys.country + ' '+ bandeira_pais)
                    .setColor(0x29BB8E)
                    .setDescription('**'+ codigos_tempo[res.weather[0].id] +'**\n'+ relogio_emoji +' **Hora local:** `'+ horario_local +'`')
                    .setThumbnail('http://openweathermap.org/img/wn/'+ res.weather[0].icon +'@2x.png')
                    .addFields(
                        { name: ':thermometer: **Temperatura**', value: ":small_orange_diamond: **Atual**: `"+ res.main.temp +"°C`\n:small_red_triangle: **Máxima:** `"+ res.main.temp_max +"°C`\n:small_red_triangle_down: **Mínima:** `"+ res.main.temp_min +"°C`", inline: true },
                        { name: ':sweat_drops: **Umidade**', value: "**Atual: **`"+ res.main.humidity +"%`", inline: true },
                        { name: ':wind_chime: **Velocidade do vento**', value: " **Atual: **`"+ res.wind.speed +" km/h`", inline: true },
                    )
                    .addField(':fire: **Sensação Térmica**', '**Atual: **`'+ res.main.feels_like +'°C`', true)
                    .addField(':compression: **Pressão do ar**', '**Atual: **`'+ res.main.pressure +' kPA`', true);

                    message.channel.send(cidade_encontrada);
                });
            }
        });
    }
};