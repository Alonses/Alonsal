const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, UserFlagsBitField } = require("discord.js")

const getDateDiff = require('../../adm/funcoes/diff_datas.js')
const busca_emoji = require('../../adm/funcoes/busca_emoji.js')
const formata_data = require('../../adm/funcoes/formata_data.js')

const { emojis } = require('../../arquivos/json/text/emojis.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('⌠💡⌡ Veja detalhes de algum usuario')
        .addUserOption(option => option.setName('usuario').setDescription('Marque outro usuário como alvo')),
	async execute(client, interaction) {
        
        const idioma_definido = client.idioma.getLang(interaction) 
        
        const { utilitarios } = require(`../../arquivos/idiomas/${idioma_definido}.json`)
        const emojis_busto = ["🧙‍♂️", "🧙‍♀️", "👮‍♀️", "🦹‍♂️ ", "👩‍🚀", "💂‍♂️", "👨‍🎓", "🧟", "👨‍🏭", "🧛‍♂️", "🧛‍♀️", "👨‍✈️", "👩‍✈️", "👨‍🌾", "💃", "🕺"]

        const ids_enceirados = ["597926883069394996", "665002572926681128", "610525028076748800", "678061682991562763", "813149555553468438", "434089428160348170", "735644852385087529"]

        let user = interaction.options.getUser('usuario')
        let nota_rodape = ""

        if (!user)
            user = interaction.user

        let avatar_user = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=512`
        const data_atual = new Date()

        const membro_sv = interaction.guild.members.cache.get(user.id) // Coleta dados como membro
        let data_entrada = formata_data(new Date(membro_sv.joinedTimestamp), idioma_definido == "al-br" ? "pt-br" : idioma_definido)
        let diferenca_entrada = getDateDiff(new Date(membro_sv.joinedTimestamp), data_atual, utilitarios)

        let data_criacao = formata_data(new Date(user.createdAt), idioma_definido == "al-br" ? "pt-br" : idioma_definido) // Cadastro do user
        let diferenca_criacao = getDateDiff(new Date(user.createdAt), data_atual, utilitarios)

        if (avatar_user !== null) {
            avatar_user = avatar_user.replace(".webp", ".gif")

            await fetch(avatar_user)
                .then(res => {
                    if (res.status !== 200)
                        avatar_user = avatar_user.replace('.gif', '.webp')
                })
        } else
            avatar_user = ""

        let apelido = user.username, tipo_user = "🤖"

        if (membro_sv.nickname !== null)
            apelido = membro_sv.nickname

        if (membro_sv.permissions.has(PermissionsBitField.Flags.Administrator)) {
            tipo_user = "🛡️"
            nota_rodape = utilitarios[13]["moderador"]
        }

        if (!tipo_user.includes("🛡️") && !user.bot)
            tipo_user = emojis_busto[Math.round((emojis_busto.length - 1 ) * Math.random())]

        if (user.id === client.user.id)
            nota_rodape = utilitarios[13]["alonsal"]

        if (ids_enceirados.includes(user.id)) {
            if (nota_rodape !== "")
                nota_rodape += ", "

            nota_rodape += utilitarios[13]["enceirado"]
        }
        
        const permissoes_user = membro_sv.permissions.toArray()
        let permissoes_fn = ""

        for (let i = 0; i < permissoes_user.length; i++) {
            if (typeof permissoes_user[i + 1] === "undefined")
                permissoes_fn += " & "

            permissoes_fn += `\`${permissoes_user[i]}\``

            if (typeof permissoes_user[i + 2] !== "undefined")
                permissoes_fn += ", "
        }

        permissoes_fn = permissoes_fn.slice(0, 2000)
        let emoji_hypesquad = "⠀", discord_premium = "⠀"
        const flags_user = user.flags.toArray()
        
        if (!user.bot) {
            if (flags_user.includes('HypeSquadOnlineHouse1')) // HypeSquad
                emoji_hypesquad = busca_emoji(client, emojis.squad_bravery)

            if (flags_user.includes('HypeSquadOnlineHouse2'))
                emoji_hypesquad = busca_emoji(client, emojis.squad_brilliance)

            if (flags_user.includes('HypeSquadOnlineHouse3'))
                emoji_hypesquad = busca_emoji(client, emojis.squad_balance)
            
            if (flags_user.includes('PremiumEarlySupporter'))
                discord_premium = busca_emoji(client, emojis.early_supporter)
            
            if (membro_sv.premiumSinceTimestamp) // Impulsionadores do servidor
                discord_premium += ` ${busca_emoji(client, emojis.boost)}`
        }

        const infos_user = new EmbedBuilder()
            .setTitle(`${apelido} ${emoji_hypesquad} ${discord_premium}`)
            .setColor(0x29BB8E)
            .setThumbnail(avatar_user)
            .addFields(
                {
                    name: ':globe_with_meridians: **Discord**',
                    value: `\`${user.username.replace(/ /g, "")}#${user.discriminator}\``,
                    inline: true
                },
                {
                    name: `:label: **Discord ID**`,
                    value: `\`${user.id}\``,
                    inline: true
                }
            )
            .addFields(
                {
                    name: `:birthday: **${utilitarios[13]["conta_criada"]}**`,
                    value: `${data_criacao}\n[ \`${diferenca_criacao}\` ]`,
                    inline: false
                },
                {
                    name: `:parachute: **${utilitarios[13]["entrada"]}**`,
                    value: `${data_entrada}\n[ \`${diferenca_entrada}\` ]`,
                    inline: false
                }
            )
            .setFooter({ text: `${tipo_user} ${nota_rodape}` })
        
        return interaction.reply({ embeds: [infos_user], ephemeral: true })
    }
}