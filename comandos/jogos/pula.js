const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pula')
        .setDescription('⌠🎲⌡ The Pula Game!')
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ O Jogo do Pula!',
            "es-ES": '⌠🎲⌡ ¡El Juego de Pula!',
            "fr": '⌠🎲⌡ Le Jeu Pula!',
            "it": '⌠🎲⌡ Il gioco di Pola!'
        })
        .addUserOption(option =>
            option.setName('user')
                .setDescription('A discord user')
                .setDescriptionLocalizations({
                    "pt-BR": 'Um usuário do discord',
                    "es-ES": 'Un usuario de discord',
                    "fr": 'Un utilisateur de discord',
                    "it": 'Un utente della discordia'
                })),
    async execute(client, interaction) {

        alvo = interaction.options.getUser('user') || interaction.user
        const user = await client.getUser(alvo.id)

        if (!user.social.pula_predios)
            return client.tls.reply(client, interaction, "game.pula.vinculo", true)

        fetch(`${process.env.url_apisal}/pula?token=placholder&sync=1&token_user=${user.social.pula_predios}`)
            .then(res => res.json())
            .then(retorno => {

                if (retorno.status == 404)
                    return client.tls.reply(client, interaction, "game.pula.error_1", true, 0)

                const datas_pula = retorno.data

                const embed = new EmbedBuilder()
                    .setTitle(client.tls.phrase(client, interaction, "game.pula.estatisticas_pula"))
                    .setColor(client.embed_color(user.misc.color))
                    .addFields(
                        {
                            name: `${client.emoji(emojis.pula_2)} **${client.tls.phrase(client, interaction, "game.pula.gerais")}**`,
                            value: `:part_alternation_mark: **${client.tls.phrase(client, interaction, "game.pula.pulos")}:** \`${client.formata_num(datas_pula.pulos)}\`\n:rocket: **${client.tls.phrase(client, interaction, "game.pula.mods_ativos")}:** \`${client.formata_num(datas_pula.mods)}\`\n:skull_crossbones: **${client.tls.phrase(client, interaction, "game.pula.mortes")}:** \`${client.formata_num(datas_pula.mortes)}\``,
                            inline: true,
                        },
                        {
                            name: `:clock: ${client.tls.phrase(client, interaction, "game.pula.tempos")}`,
                            value: `:joystick: **${client.tls.phrase(client, interaction, "game.pula.jogado")}:** \`${datas_pula.tempo_jogado}s\`\n:flying_disc: **${client.tls.phrase(client, interaction, "game.pula.voando")}:** \`${datas_pula.tempo_voando}s\`\n:carousel_horse: **${client.tls.phrase(client, interaction, "game.pula.em_eventos")}:** \`${datas_pula.tempo_eventos}s\``,
                            inline: true
                        },
                        {
                            name: `${client.emoji(emojis.mc_esmeralda)} **${client.tls.phrase(client, interaction, "game.pula.moedas")}**`,
                            value: `:bank: **${client.tls.phrase(client, interaction, "game.pula.coletadas")}:** \`${client.formata_num(datas_pula.moedas_coletadas)}\`\n:money_with_wings: **${client.tls.phrase(client, interaction, "game.pula.gastas")}:** \`${client.formata_num(datas_pula.moedas_gastas)}\`\n:moneybag: **${client.tls.phrase(client, interaction, "game.pula.guardadas")}:** \`${client.formata_num(datas_pula.moedas)}\``,
                            inline: true
                        },
                    )
                    .addFields(
                        {
                            name: `:carousel_horse: **${client.tls.phrase(client, interaction, "game.pula.eventos")}**`,
                            value: `:man_playing_water_polo: **${client.tls.phrase(client, interaction, "game.pula.aquatico")}:** \`${client.formata_num(datas_pula.eventos[0])}\`\n:hotsprings: **${client.tls.phrase(client, interaction, "game.pula.lava")}:** \`${client.formata_num(datas_pula.eventos[1])}\`\n:checkered_flag: **${client.tls.phrase(client, interaction, "game.pula.concluidos")}:** \`${client.formata_num(datas_pula.eventos_concluidos)}\``,
                            inline: true
                        },
                        {
                            name: `⠀`,
                            value: `:city_dusk: **${client.tls.phrase(client, interaction, "game.pula.zona_densa")}:** \`${client.formata_num(datas_pula.eventos[2])}\`\n:park: **${client.tls.phrase(client, interaction, "game.pula.parque")}:** \`${client.formata_num(datas_pula.eventos[3])}\`\n:house_abandoned: **${client.tls.phrase(client, interaction, "game.pula.pisoes")}:** \`${client.formata_num(datas_pula.pisoes)}\``,
                            inline: true
                        },
                        {
                            name: `⠀`,
                            value: `:gem: **${client.tls.phrase(client, interaction, "util.steam.conquistas")}**\n:tropical_drink: **${client.tls.phrase(client, interaction, "game.pula.progresso")} ${datas_pula.conquistas} / ${datas_pula.consquistas_total}**`,
                            inline: true
                        }
                    )

                if (parseInt(datas_pula.recorde) > 0)
                    embed.setDescription(`\`\`\`${client.tls.phrase(client, interaction, "game.pula.recorde").replace("pontos_repl", client.formata_num(datas_pula.recorde)).replace("distancia_repl", (datas_pula.distancia_percorrida / 1000).toFixed(2))}\`\`\``)

                return interaction.reply({ embeds: [embed] })
            })
            .catch(() => {
                return client.tls.reply(client, interaction, "game.pula.error_2", true, 0)
            })
    }
}