const { SlashCommandBuilder } = require("discord.js")

const { getVotes } = require("../../core/database/schemas/User_votes")

const { idiomas } = require("../../core/formatters/patterns/user")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setNameLocalizations({
            "de": 'umfrage',
            "es-ES": 'votar',
            "it": 'votazione',
            "pt-BR": 'votar',
            "ru": 'голосование'
        })
        .setDescription("⌠📡⌡ Vote for the new language!")
        .setDescriptionLocalizations({
            "de": '⌠📡⌡ Stimmen Sie für eine neue Sprache!',
            "es-ES": '⌠📡⌡ ¡Vota por un nuevo idioma!',
            "fr": '⌠📡⌡ Votez pour une nouvelle langue!',
            "it": '⌠📡⌡ Vota per la nuova lingua!',
            "pt-BR": '⌠📡⌡ Vote num novo idioma!',
            "ru": '⌠📡⌡ Голосуйте за новый язык!'
        }),
    async execute({ client, user, interaction }) {

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

        const embed = client.create_embed({
            title: `${client.tls.phrase(user, "inic.vote.titulo")} ${client.emoji("emojis_dancantes")} ${client.emoji("emojis_dancantes")} ${client.emoji("emojis_dancantes")}`,
            color: "turquesa",
            description: `${client.execute("replace", { string: `${client.tls.phrase(user, "inic.vote.votacao_encerrada_1")}\n\n${client.tls.phrase(user, "inic.vote.votacao_encerrada_2")}`, valores: [votos.qtd, client.emoji("aln_voter"), maior.qtd, idiomas[escolha], client.emoji("emojis_dancantes"), client.emoji("emojis_dancantes")] })}\n\n:flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}:\n:flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}:\n:flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}: :flag_${escolha}:`,
            footer: {
                text: { tls: "inic.vote.rodape_encerrado" }
            }
        }, user)

        interaction.reply({
            embeds: [embed],
            flags: "Ephemeral"
        })
    }
}