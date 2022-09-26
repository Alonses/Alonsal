const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { emojis } = require('../../arquivos/json/text/emojis.json')

const busca_emoji = require('../../adm/discord/busca_emoji')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pula')
        .setDescription('⌠🎲⌡ The Pula Game!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ O Jogo do Pula!',
            "es-ES": '⌠🎲⌡ ¡El Juego de Pula!',
            "fr": '⌠🎲⌡ Le Jeu Pula!'
        })
        .addUserOption(option =>
            option.setName('user')
                .setDescription('A discord user')
                .setDescriptionLocalizations({
                    "pt-BR": 'Um usuário do discord',
                    "es-ES": 'Un usuario de discord',
                    "fr": 'Un utilisateur de discord'
                })),
    async execute(client, interaction) {

        alvo = interaction.options.getUser('user') || interaction.user
        const user = client.usuarios.getUser(alvo.id)

        if (!user.pula_predios)
            return interaction.reply({ content: "Este usuário não vinculou sua conta Discord ao Pula Prédios:tm: ainda!", ephemeral: true })

        await interaction.deferReply()

        fetch(`http://apisal.herokuapp.com/pula?token=placholder&sync=1&token_user=${user.pula_predios}`)
            .then(res => res.json())
            .then(retorno => {

                if (retorno.status == 404)
                    return interaction.edit({ content: ":warning: | Houve um erro com o Token, estamos enceirando para descobrir qual foi o problema, tente novamente mais tarde", ephemeral: true })

                const datas_pula = retorno.data

                const embed = new EmbedBuilder()
                    .setTitle("> Suas estatísticas no Pula")
                    .setColor(user.color)
                    .addFields(
                        {
                            name: `${busca_emoji(client, emojis.pula_2)} **Gerais**`,
                            value: `:part_alternation_mark: **Pulos:** \`${datas_pula.pulos}\`\n:fireworks: **Mods Ativos:** \`${datas_pula.mods}\`\n:skull_crossbones: **Mortes:** \`${datas_pula.mortes}\``,
                            inline: true,
                        },
                        {
                            name: `:clock: Tempos`,
                            value: `:joystick: **Jogado:** \`${datas_pula.tempo_jogado}s\`\n:flying_disc: **Voando:** \`${datas_pula.tempo_voando}s\`\n:carousel_horse: **Em eventos:** \`${datas_pula.tempo_eventos}s\``,
                            inline: true
                        },
                        {
                            name: `${busca_emoji(client, emojis.mc_esmeralda)} **Moedas**`,
                            value: `:bank: **Coletadas:** \`${datas_pula.moedas_coletadas}\`\n:money_with_wings: **Gastas:** \`${datas_pula.moedas_gastas}\`\n:moneybag: **Guardadas:** \`${datas_pula.moedas}\``,
                            inline: true
                        },
                    )
                    .addFields(
                        {
                            name: `:carousel_horse: **Eventos**`,
                            value: `:man_playing_water_polo: **Áquatico:** \`${datas_pula.eventos[0]}\`\n:hotsprings: **Lava:** \`${datas_pula.eventos[1]}\`\n:checkered_flag: **Concluídos:** \`${datas_pula.eventos_concluidos}\``,
                            inline: true
                        },
                        {
                            name: `⠀`,
                            value: `:city_dusk: **Zona Densa:** \`${datas_pula.eventos[2]}\`\n:park: **Parque:** \`${datas_pula.eventos[3]}\`\n:house_abandoned: **Pisões:** \`${datas_pula.pisoes}\``,
                            inline: true
                        },
                        {
                            name: `⠀`,
                            value: `:gem: **Conquistas**\n:tropical_drink: **Progresso ${datas_pula.conquistas} / ${datas_pula.consquistas_total}**`,
                            inline: true
                        }
                    )

                if (parseInt(datas_pula.recorde) > 0)
                    embed.setDescription(`\`\`\`🏆 Recorde de ${datas_pula.recorde} pontos numa partida!\n🚀 ${datas_pula.distancia_percorrida} metros percorridos no total\`\`\``)

                return interaction.edit({ embeds: [embed] })
            })
            .catch(err => {

                console.log(err)

                return interaction.edit({ content: "Houve um erro com a APISAL, não sendo foi possível realizar essa função no momento, tente novamente mais tarde", ephemeral: true })
            })
    }
}