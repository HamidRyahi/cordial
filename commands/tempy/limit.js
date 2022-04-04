const profileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'limit',
    description: 'This command is for setting a limit to your temp vc',
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
                    if (dataProfileByChannelId.channelId === authorVC.id && dataProfileByChannelId.memberId !== authorId) {
                        return notTheOwner(message, authorVC, serverProfileByAuthorId);
                    }
                    if (dataProfileByChannelId.channelId === authorVC.id && dataProfileByChannelId.memberId === authorId && dataProfileByChannelId.isInChannel && dataProfileByChannelId.serverID === message.guildId) {
                        if (args.length === 0) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setTitle(`${message.author.username}, you didn't provide any arguments!`)
                                .setDescription(`__correct usage:__
\`${prefixProfile.prefix}limit 69\``)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (authorVC.userLimit.toString() === args[0]) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ffff00')
                                .setDescription(`**Reminder:** The channel's limit is already set to ${args[0]}!`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (/^[0-9]*$/.test(args[0]) === false || (args[0] < 0) || (args[0] > 99)) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`**${message.author.username}, you should provide a valid number between **\`0\`** and **\`99\`**!**`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        authorVC.setUserLimit(args[0])
                            .then(async vc => {
                                if (vc.userLimit === 0) {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#00ff00')
                                        .setDescription(`${message.author.username}, you have successfuly removed the limit for <#${authorVC.id}>!`)
                                    message.reply({ embeds: [msgEmbed] })
                                        .catch(err => console.log(err));
                                } else {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#00ff00')
                                        .setDescription(`${message.author.username}, you have successfuly set the channel's limit to **\`${vc.userLimit}\`**!`)
                                    message.reply({ embeds: [msgEmbed] })
                                        .catch(err => console.log(err));
                                }
                                await profileModel.findOneAndUpdate(
                                    { memberId: message.author.id, },
                                    { limit: `${vc.userLimit}`, }
                                ).catch(err => console.log(err));
                            })
                            .catch(console.error);
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