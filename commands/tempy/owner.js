const { MessageEmbed } = require('discord.js');
const tempVcProfileModel = require('../../database/models/tempSchema.js');
const { notInTempVc, noOwnerCurrently, noValidSetup } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'owner',
    description: 'This command is for getting the owner of a temp vc',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        const oneTap = message.guild.channels.cache.get(serverProfile.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfile.categoryID) {
                const authorVC = message.member.voice.channel;
                const authorId = message.author.id;
                notInTempVc(authorVC, authorTempVC, serverProfile, message);
                if (authorTempVC) {
                    if (authorVC.id === authorTempVC.channelId && authorTempVC.memberId === "") {
                        return noOwnerCurrently(authorTempVC, serverProfile, authorVC, message, authorId);
                    }
                    if (authorTempVC.channelId === authorVC.id && authorTempVC.serverID === message.guildId) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#5865F2')
                            .setDescription(`<#${authorVC.id}> channel is owned by <@${authorTempVC.memberId}>`)
                        return message.reply({ embeds: [msgEmbed] })
                            .catch(err => console.log(err));
                    }
                }
            } else {
                noValidSetup(message, serverProfile.prefix);
            }
        } else {
            noValidSetup(message, serverProfile.prefix);
        }
    }
}