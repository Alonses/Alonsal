const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pula")
        .setDescription("⌠🎲⌡ The Pula Game!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠🎲⌡ O Jogo do Pula!',
            "es-ES": '⌠🎲⌡ ¡El Juego de Pula!',
            "fr": '⌠🎲⌡ Le Jeu Pula!',
            "it": '⌠🎲⌡ Il gioco di Pola!',
            "ru": '⌠🎲⌡ Игра от Pula!'
        })
        .addUserOption(option =>
            option.setName("user")
                .setDescription("A discord user")
                .setDescriptionLocalizations({
                    "pt-BR": 'Um usuário do discord',
                    "es-ES": 'Un usuario de discord',
                    "fr": 'Un utilisateur de discord',
                    "it": 'Un utente della discordia',
                    "ru": 'Дискорд-пользователь'
                })),
    async execute(client, user, interaction) {

        let alvo = interaction.options.getUser("user") || interaction.user
        const user_pula = await client.getUser(alvo.id)

        // user_pula -> Dados do usuário alvo
        // user -> Dados do usuário que disparou o comando

        if (!user_pula.social.pula_predios)
            return client.tls.reply(interaction, user, "game.pula.vinculo", true, 1)

        fetch(`${process.env.url_apisal}/pula?token=placholder&sync=1&token_user=${user_pula.social.pula_predios}`)
            .then(res => res.json())
            .then(retorno => {

                if (retorno.status === 404)
                    return client.tls.reply(interaction, user, "game.pula.error_1", true, 0)

                const datas_pula = retorno.data

                const embed = new EmbedBuilder()
                    .setTitle(client.tls.phrase(user, "game.pula.estatisticas_pula"))
                    .setColor(client.embed_color(user_pula.misc.color))
                    .addFields(
                        {
                            name: `${client.emoji(emojis.pula_2)} **${client.tls.phrase(user, "game.pula.gerais")}**`,
                            value: `:part_alternation_mark: **${client.tls.phrase(user, "game.pula.pulos")}:** \`${client.locale(datas_pula.pulos)}\`\n:rocket: **${client.tls.phrase(user, "game.pula.mods_ativos")}:** \`${client.locale(datas_pula.mods)}\`\n:skull_crossbones: **${client.tls.phrase(user, "game.pula.mortes")}:** \`${client.locale(datas_pula.mortes)}\``,
                            inline: true,
                        },
                        {
                            name: `${client.defaultEmoji("time")} ${client.tls.phrase(user, "game.pula.tempos")}`,
                            value: `:joystick: **${client.tls.phrase(user, "game.pula.jogado")}:** \`${datas_pula.tempo_jogado}s\`\n:flying_disc: **${client.tls.phrase(user, "game.pula.voando")}:** \`${datas_pula.tempo_voando}s\`\n:carousel_horse: **${client.tls.phrase(user, "game.pula.em_eventos")}:** \`${datas_pula.tempo_eventos}s\``,
                            inline: true
                        },
                        {
                            name: `${client.emoji(emojis.mc_esmeralda)} **${client.tls.phrase(user, "game.pula.moedas")}**`,
                            value: `:bank: **${client.tls.phrase(user, "game.pula.coletadas")}:** \`${client.locale(datas_pula.moedas_coletadas)}\`\n:money_with_wings: **${client.tls.phrase(user, "game.pula.gastas")}:** \`${client.locale(datas_pula.moedas_gastas)}\`\n:moneybag: **${client.tls.phrase(user, "game.pula.guardadas")}:** \`${client.locale(datas_pula.moedas)}\``,
                            inline: true
                        },
                    )
                    .addFields(
                        {
                            name: `:carousel_horse: **${client.tls.phrase(user, "game.pula.eventos")}**`,
                            value: `:man_playing_water_polo: **${client.tls.phrase(user, "game.pula.aquatico")}:** \`${client.locale(datas_pula.eventos[0])}\`\n:hotsprings: **${client.tls.phrase(user, "game.pula.lava")}:** \`${client.locale(datas_pula.eventos[1])}\`\n:checkered_flag: **${client.tls.phrase(user, "game.pula.concluidos")}:** \`${client.locale(datas_pula.eventos_concluidos)}\``,
                            inline: true
                        },
                        {
                            name: "⠀",
                            value: `:city_dusk: **${client.tls.phrase(user, "game.pula.zona_densa")}:** \`${client.locale(datas_pula.eventos[2])}\`\n:park: **${client.tls.phrase(user, "game.pula.parque")}:** \`${client.locale(datas_pula.eventos[3])}\`\n:house_abandoned: **${client.tls.phrase(user, "game.pula.pisoes")}:** \`${client.locale(datas_pula.pisoes)}\``,
                            inline: true
                        },
                        {
                            name: "⠀",
                            value: `:gem: **${client.tls.phrase(user, "util.steam.conquistas")}**\n:tropical_drink: **${client.tls.phrase(user, "game.pula.progresso")} ${datas_pula.conquistas} / ${datas_pula.consquistas_total}**`,
                            inline: true
                        }
                    )

                if (parseInt(datas_pula.recorde) > 0)
                    embed.setDescription(`\`\`\`${client.tls.phrase(user, "game.pula.recorde").replace("pontos_repl", client.locale(datas_pula.recorde)).replace("distancia_repl", (datas_pula.distancia_percorrida / 1000).toFixed(2))}\`\`\``)

                interaction.reply({ embeds: [embed], ephemeral: client.decider(user?.conf.ghost_mode, 0) })
            })
            .catch(() => client.tls.reply(interaction, user, "game.pula.error_2", true, 0))
    }
}