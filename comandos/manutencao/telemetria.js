const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { getUser } = require("../../adm/database/schemas/User.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('telemetry')
        .setNameLocalizations({
            "pt-BR": 'telemetria',
            "es-ES": 'telemetria',
            "fr": 'telemetrie',
            "it": 'telemetria'
        })
        .setDescription('⌠📡⌡ Data we collect')
        .setDescriptionLocalizations({
            "pt-BR": '⌠📡⌡ Dados que coletamos',
            "es-ES": '⌠📡⌡ Datos que recopilamos',
            "fr": '⌠📡⌡ Données que nous collectons',
            "it": '⌠📡⌡ Dati che raccogliamo'
        }),
    async execute(client, interaction) {

        const user = await getUser(interaction.user.id)

        const embed = new EmbedBuilder()
            .setColor(client.embed_color(user.misc.color))
            .setTitle(`> Dados de telemetria`)
            .setDescription(`Para um melhor funcionamento do Alonsal utilizamos de vários dados anonimizados para decidir em quais recursos prover mais atenção e melhorar no futuro.\n\nDados esses podem vir de todas as funções do bot, o mais destacado deles é o de comandos, ao usar um comando, como este do /telemetria, o bot registra a interação em seu histórico de comandos disparados e exibe um pequeno resumo de qual servidor o comando foi usado, como na print em anexo abaixo.\n\nOutros dados que também coletamos estão listados abaixo:\n\`Entrada e saída (do bot) de servidores\`, \`Total de servidores, canais e usuários que o bot consegue visualizar\`, \`Erros que ocorrerem durante um comando\`, \`Mensagens de texto para as experiências/nível\`, \`Movimentações de Bufunfas\`, \`Canais que recebem atualizações de jogos gratuitos\`, e por fim estes últimos que são atualizados diariamente:\n\n\`Comandos disparados, erros, experiência concedida, mensagens válidas para xp, bufunfas distribuídas e movimentadas, e servidores, canais e usuários "conhecidos".\``)
            .setImage("https://cdn.discordapp.com/attachments/987852330064039988/1049109914120884224/image.png")
            .setFooter({ text: "🔰 | Vale ressaltar que entradas de texto são escondidas também, tornando o conteúdo digitado não visível para sua privacidade." })

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}