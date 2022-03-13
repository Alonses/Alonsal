const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { weather_key, time_key } = require('../../config.json');
const { emojis_negativos, emojis } = require('../../arquivos/json/text/emojis.json');
const getCountryISO3 = require("country-iso-2-to-3");
const base_url = "http://api.openweathermap.org/data/2.5/weather?";
const time_url = "http://api.timezonedb.com/v2.1/get-time-zone?";

module.exports = {
    name: "tempo",
    description: "Veja informações do tempo em alguma cidade",
    aliases: [ "t", "clima", "previsao", "weather", "we" ],
    usage: "t Brasil",
    cooldown: 3,
    permissions: [ "SEND_MESSAGES" ],
    async execute(client, message, args) {

        const idioma_adotado = client.idioma.getLang(message.guild.id);
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_adotado}.json`);

        const prefix = client.prefixManager.getPrefix(message.guild.id);
        const translations = require(`i18n-country-code/locales/${idioma_adotado.slice(0, 2)}.json`);    

        let pesquisa = "";
        const pesquisa_bruta = `\"${args.join(" ").replaceAll("\"", "")}"`;
        const emoji_nao_encontrado = client.emojis.cache.get(emojis_negativos[Math.round((emojis_negativos.length - 1) * Math.random())]).toString();
        const emoji_troll = client.emojis.cache.get(emojis.trollface).toString();
        const indicaTemp = require('../../adm/funcoes/indicatemp.js');

        if(args.length < 1) // Pesquisa sem argumentos
            return message.reply(`:warning: | ${utilitarios[8]["aviso_1"].replaceAll(".a", prefix)}`);

        const indices = [];

        if(!args[0].raw.startsWith("\"")) // Pesquisa bruta
            args.forEach(valor => { // Pesquisa formatada
                indices.push(valor.raw.normalize("NFD").replace(/[^a-zA-Zs]/g, ""));
            });
        else
            indices.push((args.join(" ")).replaceAll("\"", "")) 

        pesquisa = indices.join(" ");
        if(pesquisa === "") return message.reply(`:mag: | ${utilitarios[8]["error_1"]}`);
        
        let url_completa = `${base_url}appid=${weather_key}&q=${pesquisa}&units=metric&lang=pt`;

        if(idioma_adotado === "en-us")
            url_completa = url_completa.replace("&lang=pt", "");
        
        if(idioma_adotado === "fr-fr")
            url_completa = url_completa.replace("&lang=pt", "&lang=fr");
        
        fetch(url_completa)
        .then(response => response.json())
        .then(async res => {

            if(res.cod === '404' || res.cod === '400')
                return message.reply(`${emoji_nao_encontrado} | ${utilitarios[8]["aviso_2"]} \`${pesquisa}\`, ${utilitarios[9]["tente_novamente"]}\n${utilitarios[8]["sugestao"]} \`${prefix}t ${pesquisa_bruta}\``);
            else if(res.cod === '429') // Erro da API
                return message.reply(`${emoji_nao_encontrado} | ${utilitarios[8]["aviso_3"]}`);
            else if(res.id === 1873107)
                return message.reply(`${emoji_nao_encontrado} | ${utilitarios[8]["error_2"]}`);
            else{
                const url_hora = `${time_url}key=${time_key}&format=json&by=position&lat=${res.coord.lat}&lng=${res.coord.lon}`;

                fetch(url_hora) // Buscando o horário local
                .then(response => response.json())
                .then(async res_hora => {

                    let dados_att = new Date((res.dt + res.timezone) * 1000);
                    dados_att = `${("0" + dados_att.getHours()).substr(-2)}:${("0" + dados_att.getMinutes()).substr(-2)} (*)`;

                    let bandeira_pais = "";
                    let nome_pais = "";
                    let nota_rodape = `${utilitarios[8]["dados_atts"]} ${dados_att}`;
                    let horario_local;

                    if(typeof res.sys.country !== "undefined"){
                        bandeira_pais = `:flag_${(res.sys.country).toLowerCase()}:`;

                        const cod_pais = getCountryISO3(res.sys.country);
                        nome_pais = ` - ${translations[cod_pais]}`;
                        
                        if(res.sys.country === "AQ")
                            nome_pais = ` - ${utilitarios[8]["antartida"]}`;

                        if(nome_pais.includes(res.name)){
                            nome_pais = "";
                            nota_rodape += ` | ${utilitarios[8]["aviso_pais"]}`;
                        }

                        horario_local = res_hora.formatted;
                        horario_local = new Date(horario_local);
                    }else{
                        horario_local = new Date(res.dt * 1000);

                        if(res.name !== "Globe" && (res.coord.lon !== 0 && res.coord.lat !== 0))
                            nota_rodape += ` | ${utilitarios[8]["aviso_continente"]}`;
                        else if(res.coord.lon === 0 && res.coord.lat === 0)
                            nota_rodape += ` | ${utilitarios[8]["aviso_planeta"]}`;
                    }

                    let nascer_sol = new Date((res.sys.sunrise + res.timezone) * 1000);
                    let por_sol = new Date((res.sys.sunset + res.timezone) * 1000);

                    nascer_sol = ("0" + nascer_sol.getHours()).substr(-2) +":"+ ("0" + nascer_sol.getMinutes()).substr(-2);
                    por_sol = ("0" + por_sol.getHours()).substr(-2) +":"+ ("0" + por_sol.getMinutes()).substr(-2);

                    let tempo_atual = res.weather[0].description; // Clima atual
                    tempo_atual = tempo_atual.charAt(0).toUpperCase() + tempo_atual.slice(1);

                    const minutos = ("0" + horario_local.getMinutes()).substr(-2); // Preservar o digito 0
                    const hora = ("0" + horario_local.getHours()).substr(-2); // Preservar o digito 0
                    const dia = horario_local.getDate();

                    let mes = horario_local.toLocaleString('pt', { month: 'long' });
                    
                    if(idioma_adotado === "en-us")
                        mes = horario_local.toLocaleString('en', { month: 'long' });

                    let hours = horario_local.getHours();

                    hours %= 12;
                    hours = hours ? hours : 12;

                    if(minutos >= 30)
                        hours += "30";
                    
                    let emoji_ceu_atual = ":park:";

                    // Umidade
                    let emoji_umidade = ":sweat_drops:";
                    let emoji_indica_humidade = "";
                    let emoji_indica_visibilidade = "";

                    if(res.main.humidity < 60)
                        emoji_umidade = ":droplet:";
                    
                    if(res.main.humidity < 30)
                        emoji_umidade = ":cactus:";

                    // Nuvens
                    let emoji_nuvens = ":cloud:";

                    if(res.clouds.all < 60)
                        emoji_nuvens = ":white_sun_cloud:"

                    if(res.clouds.all < 41)
                        emoji_nuvens = ":white_sun_small_cloud:";

                    if(res.clouds.all < 31){
                        emoji_nuvens = ":sunny:";

                        if(hora > 17 || hora < 7) // Noite
                            emoji_nuvens = ":full_moon_with_face:";
                    }

                    if(hora > 17 || hora < 7)
                        emoji_ceu_atual = ":milky_way:";

                    // Sensação térmica dinâmica
                    let emoji_sensacao_termica = ":hot_face:";

                    if(res.main.feels_like >= 13 && res.main.feels_like <= 30)
                        emoji_sensacao_termica = ":ok_hand:";    

                    if(res.main.feels_like < 13)
                        emoji_sensacao_termica = ":cold_face:";

                    if(res.main.feels_like < 0)
                        emoji_sensacao_termica = ":snowman2:";

                    if(res.main.feels_like >= 35)
                        emoji_sensacao_termica = ":fire:";
                    
                    horario_local = `:clock${hours}: **${utilitarios[8]["hora_local"]}:** \`${hora}:${minutos} | ${dia} ${utilitarios[8]["de"]} ${mes}\``;

                    const direcao_vento = direcao_cardial(res.wind.deg, idioma_adotado);
                    let nome_local = `${utilitarios[8]["na"]} ${res.name}`;
                    let infos_chuva = "";
                    let chuva_troll = "";

                    if(typeof res.sys.country != "undefined")
                        if(idioma_adotado === "pt-br")
                            nome_local = nome_local.replace("na", "em");
                    
                    if(res.name === "Globe")
                        nome_local = `${utilitarios[8]["terra"]} :earth_americas:`;
                    
                    if(typeof res.rain !== "undefined"){
                        infos_chuva = `${utilitarios[8]["chovendo"]}\n${utilitarios[8]["chuva"]} 1H: ${res.rain["1h"]}mm`;
                    
                        if(typeof res.rain["3h"] != "undefined")
                            infos_chuva += `\n${utilitarios[8]["chuva"]} 3H: ${res.rain["3h"]}mm`;

                        emoji_indica_humidade = " 🔼";
                        emoji_indica_visibilidade = " 🔽";
                        chuva_troll = `${emoji_troll} _${utilitarios[8]["chuva_troll"]}_`;
                    }
                    
                    if(typeof res.snow !== "undefined"){
                        infos_chuva = `${utilitarios[8]["nevando"]}\n${utilitarios[8]["neve"]} 1H: ${res.rain["1h"]}mm`;
                    
                        if(typeof res.rain["3h"] != "undefined")
                            infos_chuva += `\n${utilitarios[8]["neve"]} 3H: ${res.rain["3h"]}mm`;

                        emoji_indica_visibilidade = " 🔽";

                        chuva_troll = `${emoji_troll} _${utilitarios[8]["neve_troll"]}_`;
                    }

                    if(typeof res.wind.gust !== "undefined"){
                        if(infos_chuva !== "")
                            infos_chuva += "\n------------------------------";

                        infos_chuva += `\n${utilitarios[8]["rajadas_vento"]}\n${utilitarios[8]["velocidade"]}: ${res.wind.gust} km/h`;
                    }

                    if(infos_chuva !== "")
                        infos_chuva = `\`\`\`fix\n${infos_chuva}\`\`\``;

                    let pressao_local = `**${utilitarios[12]["atual"]}: **\`${res.main.pressure} kPA\``;

                    if(typeof res.main.grnd_level !== "undefined") 
                        pressao_local = `:camping: **${utilitarios[8]["nivel_chao"]}: ** \`${res.main.grnd_level} kPA\`\n:island: **${utilitarios[8]["nivel_mar"]}: ** \`${res.main.sea_level} kPA\``;

                    emoji_indica_temp = indicaTemp(res.sys.sunrise + res.timezone, res.sys.sunset + res.timezone, res.dt + res.timezone, res.main.temp_max, res.main.temp_min, res.main.temp, chuva_troll);

                    const clima_atual = new MessageEmbed()
                    .setTitle(`:boom: ${utilitarios[8]["tempo_agora"]} ${nome_local}${nome_pais} ${bandeira_pais}`)
                    .setColor(0x29BB8E)
                    .setDescription(`${horario_local} | **${tempo_atual}**${infos_chuva}${chuva_troll}`)
                    .setThumbnail(`http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`)
                    .addFields(
                        {
                            name: `:thermometer: **${utilitarios[8]["temperatura"]}**`, 
                            value: `${emoji_indica_temp} **${utilitarios[12]["atual"]}**: \`${res.main.temp}°C\`\n:small_red_triangle: **Max:** \`${res.main.temp_max}°C\`\n:small_red_triangle_down: **Min:** \`${res.main.temp_min}°C\``, 
                            inline: true
                        },
                        {
                            name: `${emoji_ceu_atual} **${utilitarios[8]["ceu_momento"]}**`,
                            value: `${emoji_nuvens} **${utilitarios[8]["nuvens"]}: **\`${res.clouds.all}%\`\n:sunrise: **${utilitarios[8]["nas_sol"]}: **\`${nascer_sol}\`\n:city_sunset: **${utilitarios[8]["por_sol"]}: **\`${por_sol}\``, 
                            inline: true},
                        {
                            name: `:wind_chime: **${utilitarios[8]["vento"]}**`, 
                            value: `:airplane: **Vel.: **\`${res.wind.speed} km/h\`\n:compass: **${utilitarios[8]["direcao"]}: ** \`${direcao_vento}\`\n:eye: **${utilitarios[8]["visibilidade"]}: ** \`${res.visibility / 100}%${emoji_indica_visibilidade}\``, 
                            inline: true 
                        },
                    )
                    .addFields(
                        {
                            name: `${emoji_sensacao_termica} **${utilitarios[8]["sensacao_termica"]}.**`, 
                            value: `**${utilitarios[12]["atual"]}: **\`${res.main.feels_like}°C\``, 
                            inline: true
                        },
                        {
                            name: `${emoji_umidade} **${utilitarios[8]["umidade_ar"]}**`, 
                            value: `**${utilitarios[12]["atual"]}: **\`${res.main.humidity}%${emoji_indica_humidade}\``, 
                            inline: true
                        },
                        {
                            name: `:compression: **${utilitarios[8]["pressao_ar"]}**`, 
                            value: `${pressao_local}`, 
                            inline: true
                        }
                    )
                    .setFooter(nota_rodape);
                        
                    message.reply({ embeds: [clima_atual] });
                });
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
}

function direcao_cardial(degrees, idioma_adotado){
    let direcao = parseInt((degrees / 22.5) + 0.5);

    if(idioma_adotado === "pt-br")
        cards = ["Norte", "N/NL", "Nordeste", "L/NL", "Leste", "L/SL", "Sudeste", "S/SL", "Sul", "S/SO", "Sudoeste", "O/SO", "Oeste", "O/NO", "Noroeste", "N/NO"];
    else if(idioma_adotado == "en-us")
        cards = ["North", "N/NL", "North East", "L/NL", "East", "L/SL", "Southeast", "S/SL", "Sul", "S/SO", "South-west", "O/SO", "West", "O/NO", "Northwest", "N/NO"];
    else
        cards = ["Nord", "N/NL", "Nord-Est", "L/NL", "Est", "L/SL", "Sud-est", "S/SL", "Sud", "S/SO", "Sud-ouest", "O/SO", "Ouest", "O/NO", "Nord Ouest", "N/NO"];

    direcao = cards[direcao % 16];

    return direcao;
}