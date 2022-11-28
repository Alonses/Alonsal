const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getUser } = require("../../adm/database/schemas/User.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('curiosidade')
    .setDescription('⌠😂|🇧🇷⌡ Uma curiosidade aleatória'),
  async execute(client, interaction) {

    const user = await getUser(interaction.user.id)

    fetch('https://apisal.herokuapp.com/curiosidades')
      .then(response => response.json())
      .then(async res => {

        const embed = new EmbedBuilder()
          .setColor(client.embed_color(user.misc.color))
          .setAuthor({ name: res.nome, iconURL: res.foto })
          .setDescription(res.texto)

        if (res.img_curio) // Imagem da curiosidade
          embed.setImage(res.img_curio)

        return interaction.reply({ embeds: [embed] })
      })
  }
}