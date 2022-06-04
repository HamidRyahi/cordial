const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'lang',
    description: 'This command is for changing the bots language',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {



        if (args.length === 0) {
            if (serverProfileByAuthorId.lang === 'EN')
                return message.reply(`The language set for this server is ENGLISH`)
            if (serverProfileByAuthorId.lang === 'FR')
                return message.reply(`La langue utilises pour ce serveur est FRANCAIS`)
        }









    }
}