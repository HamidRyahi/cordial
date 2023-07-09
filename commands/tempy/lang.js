const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'lang',
    description: 'This command is for changing the bots language',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {



        if (args.length === 0) {
            if (serverProfile.lang === 'EN')
                return message.reply(`The language set for this server is ENGLISH`)
            if (serverProfile.lang === 'FR')
                return message.reply(`La langue utilises pour ce serveur est FRANCAIS`)
        }









    }
}