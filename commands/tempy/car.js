const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
    name: 'car',
    description: '',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {


        fetch('https://api.popcat.xyz/car')
            .then((response) => response.json())
            .then((data) => {
                const msgEmbed = new MessageEmbed()
                    .setColor('#000000')
                    .setTitle(`${data?.title}`)
                    .setImage(`${data?.image}`)
                return message.reply({ embeds: [msgEmbed] })
                    .catch(console.error);
            }

            );




    }
}