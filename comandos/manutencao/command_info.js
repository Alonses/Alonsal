const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { comandos } = require('../../arquivos/data/comandos.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('⌠📡⌡ Veja informações de comandos')
        .addStringOption(option =>
            option.setName('comando')
            .setDescription('Escolha um comando para visualizar informações')
            .setRequired(true)
            .addChoices(
                { name: 'Anagrama', value: 'd|anagr' },
                { name: 'Avatar', value: 'u|avata' },
                { name: 'Cantadas', value: 'd|canta' },
                { name: 'Cazalbe', value: 'd|cazal' },
                { name: 'Coin', value: 'j|coin' },
                { name: 'Curiosidades', value: 'd|curio' },
                { name: 'Galerito', value: 'd|galer' },
                { name: 'Idioma', value: 'm|idioma' },
                { name: 'Jailson', value: 'd|jails' },
                { name: 'Jokenpô', value: 'j|joken' },
                { name: 'Mine', value: 'u|mine' },
                { name: 'Nikocado', value: 'd|nikoc' },
                { name: 'Rasputia', value: 'd|raspu' },
                { name: 'Sans', value: 'd|sans' },
                { name: 'Steam', value: 'u|steam' },
                { name: 'Tempo', value: 'u|tempo' },
                { name: 'Textões', value: 'd|texto' }
            )),
	async execute(client, interaction) {

        return interaction.reply({ content: "Um comando bem enceirado vem ai...", ephemeral: true })

        let idioma_definido = client.idioma.getLang(interaction.guild.id)
        if(idioma_definido == "al-br") idioma_definido = "pt-br"

        const { manutencao } = require(`../../arquivos/idiomas/${idioma_definido}.json`)
    
        const procura_infos = interaction.options.data[0].value
        let valida_aliase = false
        let indice

        for(let x = 0; x < comandos.length; x++){
            let linha = comandos[x].split(",")
            const aliases = linha

            for(let i = 1; i < aliases.length; i++){
                if(aliases[i].replace(/ /g, "") === procura_infos){
                    indice = linha[0]
                    valida_aliase = true
                    break
                }
            }
        }
        
        if(valida_aliase){
            fetch(`https://raw.githubusercontent.com/odnols/site-do-alonsal/main/json/guia_${idioma.slice(0, 2)}.json`)
            .then(response => response.json())
            .then(async dados => {
                
                const comando_alvo = dados.guia[indice]
                if(!comando_alvo) return interaction.reply(`:construction: | ${manutencao[8]["traducao_faltando"]}`)

                let aliases = comando_alvo.aliases.split(",")
                format_aliases = ""
                format_usos = ""

                for(let i = 0; i < aliases.length; i++){
                    format_aliases += `\`${aliases[i].replace(/ /g, "").replace(".a", prefix)}\``

                    if(typeof aliases[i + 1] !== "undefined")
                        format_aliases += ", "
                }
                
                let usos = comando_alvo.usos.split(",")

                for(let i = 0; i < usos.length; i++){

                    let uso = usos[i].split("|")[0]
                    uso = uso.slice(0, 1) == " " ? uso.substr(1) : uso // Removendo o primeiro espaço da string caso exista um

                    format_usos += `\`${aliases[0].replace(".a", prefix)} ${uso}\` - ${usos[i].split("|")[1]}\n`
                }

                embed = new EmbedBuilder()
                .setTitle(`> ${comando_alvo.emoji} ${comando_alvo.comando}`)
                .setColor(0x29BB8E)
                .setDescription(`:label: Aliases ( ${format_aliases} )\n:jigsaw: ${manutencao[8]["usos"]} //\n${format_usos.replaceAll("<mr>", "").replaceAll("</mr>", "")}\`\`\`fix\n${comando_alvo.funcao.replaceAll("<mr>", "").replaceAll("</mr>", "")}\`\`\``)

                interaction.reply({embeds: [embed], ephemeral: true})
            })
        }else
            return interaction.reply({ content: `:mag: | ${manutencao[8]["nao_encontrado"]}`, ephemeral: true })
    }
}