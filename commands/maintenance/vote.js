const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

const { getVotes } = require("../../core/database/schemas/Vote")

const idiomas = {
    "de": "alemão",
    "nl": "holândes",
    "se": "sueco",
    "tr": "turco",
    "jp": "japonês"
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setNameLocalizations({
            "pt-BR": 'votar',
            "es-ES": 'votar',
            "it": 'votazione',
            "ru": 'голосование'
        })
        .setDescription("⌠📡⌡ Vote for the new language!")
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Vote num novo idioma!',
            "es-ES": '⌠📡⌡ ¡Vota por un nuevo idioma!',
            "fr": '⌠📡⌡ Votez pour une nouvelle langue!',
            "it": '⌠📡⌡ Vota per la nuova lingua!',
            "ru": '⌠📡⌡ Голосуйте за новый язык!'
        }),
    async execute(client, user, interaction) {

        const votos = await getVotes()

        let maior = {
            qtd: 0,
            name: null
        }

        // Ajustando o idioma com maior número de votos
        Object.keys(votos).forEach(voto => {
            if (votos[voto] > maior.qtd && voto !== "qtd") {
                maior.qtd = votos[voto]
                maior.name = voto
            }
        })

        let escolha = maior.name

        const embed = new EmbedBuilder()
            .setTitle(`${client.tls.phrase(user, "inic.vote.titulo")} ${client.emoji("emojis_dancantes")} ${client.emoji("emojis_dancantes")} ${client.emoji("emojis_dancantes")}`)
            .setColor(0x29BB8E)
            .setDescription(`${client.replace(`${client.tls.phrase(user, "inic.vote.votacao_encerrada_1")}\n\n${client.tls.phrase(user, "inic.vote.votacao_encerrada_2")}`, [votos.qtd, client.emoji("aln_voter"), maior.qtd, idiomas[escolha], client.emoji("emojis_dancantes"), client.emoji("emojis_dancantes")])}\n\n:flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}:\n:flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}:\n:flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}:`)
            .setFooter({
                text: client.tls.phrase(user, "inic.vote.rodape_encerrado")
            })

        interaction.reply({
            embeds: [embed],
            ephemeral: client.decider(user?.conf.ghost_mode, 0)
        })
    }
}