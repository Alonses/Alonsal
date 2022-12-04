const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('c_apisal')
        .setDescription('⌠🤖⌡ Verificar o status da APISAL')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator),
    async execute(client, interaction) {

        fetch(`${process.env.url_apisal}/status`)
            .then(res => res.json())
            .then(retorno => {

                let text = 'Processamento atual\n', used = retorno.process
                let texto_apisal = "🛑 | A Apisal se encontra Offline"
                if (retorno.status)
                    texto_apisal = "✅ | A Apisal se encontra Online"

                for (let key in used)
                    text += `${key}: ${used[key]} MB\n`

                interaction.reply({ content: `\`\`\`${texto_apisal}\n\n${text}\`\`\``, ephemeral: true })
            })
    }
}