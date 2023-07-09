const { MessageEmbed } = require('discord.js');
const tempVcProfileModel = require('../../database/models/tempSchema.js');
const { notInTempVc, noOwnerCurrently, noValidSetup } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'claim',
    description: 'This command is for claiming a temp vc',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        const oneTap = message.guild.channels.cache.get(serverProfile.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfile.categoryID) {
                const authorVC = message.member.voice.channel;
                const authorId = message.author.id;
                notInTempVc(authorVC, authorTempVC, serverProfile, message);
                if (authorTempVC) {
                    if (authorTempVC.channelId === authorVC.id && authorTempVC.serverID === message.guildId) {
                        if (authorTempVC.memberId === authorId && authorTempVC.isInChannel) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ffff00')
                                .setDescription(`**Reminder:** <#${authorVC.id}> is already owned by you!`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (authorTempVC.memberId !== authorId && authorTempVC.isInChannel) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`**<@${authorId}>, you can't claim <#${authorVC.id}> because the owner is still connected!**`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (authorTempVC.memberId !== authorId && !authorTempVC.isInChannel) {
                            await tempVcProfileModel.findOneAndUpdate(
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
                noValidSetup(message, serverProfile.prefix);
            }
        } else {
            noValidSetup(message, serverProfile.prefix);
        }
    }
}