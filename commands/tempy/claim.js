const { MessageEmbed } = require('discord.js');
const profileModel2 = require('../../database/models/tempSchema.js');
const { notInTempVc, noOwnerCurrently, noValidSetup } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'claim',
    description: 'This command is for claiming a temp vc',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const oneTap = message.guild.channels.cache.get(serverProfileByAuthorId.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfileByAuthorId.categoryID) {
                const authorVC = message.member.voice.channel;
                const authorId = message.author.id;
                notInTempVc(authorVC, dataProfileByChannelId, serverProfileByAuthorId, message);
                if (dataProfileByChannelId) {
                    if (dataProfileByChannelId.channelId === authorVC.id && dataProfileByChannelId.serverID === message.guildId) {
                        if (dataProfileByChannelId.memberId === authorId && dataProfileByChannelId.isInChannel) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ffff00')
                                .setDescription(`**Reminder:** <#${authorVC.id}> is already owned by you!`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (dataProfileByChannelId.memberId !== authorId && dataProfileByChannelId.isInChannel) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`**<@${authorId}>, you can't claim <#${authorVC.id}> because the owner is still connected!**`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (dataProfileByChannelId.memberId !== authorId && !dataProfileByChannelId.isInChannel) {
                            await profileModel2.findOneAndUpdate(
                                {
                                    channelId: authorVC.id,
                                    serverID: message.guildId,
                                },
                                {
                                    memberId: authorId,
                                    isInChannel: true,
                                    isFriendsPermit: false
                                }
                            ).catch(console.error);
                            const msgEmbed = new MessageEmbed()
                                .setColor('#00ff00')
                                .setDescription(`**Congrats** <@${authorId}>, you have claimed <#${authorVC.id}> successfully!`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
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