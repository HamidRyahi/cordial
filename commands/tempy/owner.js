const { MessageEmbed } = require('discord.js');
const profileModel2 = require('../../database/models/tempSchema.js');
const { notInTempVc, noOwnerCurrently, noValidSetup } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'owner',
    description: 'This command is for getting the owner of a temp vc',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const oneTap = message.guild.channels.cache.get(serverProfileByAuthorId.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfileByAuthorId.categoryID) {
                const authorVC = message.member.voice.channel;
                const authorId = message.author.id;
                notInTempVc(authorVC, dataProfileByChannelId, serverProfileByAuthorId, message);
                if (dataProfileByChannelId) {
                    if (authorVC.id === dataProfileByChannelId.channelId && dataProfileByChannelId.memberId === "") {
                        return noOwnerCurrently(dataProfileByChannelId, serverProfileByAuthorId, prefixProfile, authorVC, message, authorId);
                    }
                    if (dataProfileByChannelId.channelId === authorVC.id && dataProfileByChannelId.serverID === message.guildId) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#5865F2')
                            .setDescription(`<#${authorVC.id}> channel is owned by <@${dataProfileByChannelId.memberId}>`)
                        return message.reply({ embeds: [msgEmbed] })
                            .catch(err => console.log(err));
                    }
                }
            } else {
                noValidSetup(message, prefixProfile);
            }
        } else {
            noValidSetup(message, prefixProfile);
        }
    }
}