const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cantada')
    .setDescription('⌠😂|🇧🇷⌡ Uma cantada aleatória do Vai dar namoro™️'),
  async execute(client, interaction) {

    await interaction.deferReply()

    fetch('https://apisal.herokuapp.com/random?cantadas')
      .then(response => response.json())
      .then(async res => {

        const embed = new EmbedBuilder()
          .setTitle(res.nome)
          .setThumbnail(res.foto)
          .setColor(0x29BB8E)
          .setDescription(`> "${res.texto}"`)

        interaction.editReply({ embeds: [embed] })
      })
  }
}