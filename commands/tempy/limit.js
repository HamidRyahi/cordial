const userProfileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'limit',
    description: 'This command is for setting a limit to your temp vc',
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
                    if (authorTempVC.channelId === authorVC.id && authorTempVC.memberId !== authorId) {
                        return notTheOwner(message, authorVC, serverProfile);
                    }
                    if (authorTempVC.channelId === authorVC.id && authorTempVC.memberId === authorId && authorTempVC.isInChannel && authorTempVC.serverID === message.guildId) {
                        if (args.length === 0) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setTitle(`${message.author.username}, you didn't provide any arguments!`)
                                .setDescription(`__correct usage:__
\`${serverProfile.prefix}limit 69\``)
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
                                await userProfileModel.findOneAndUpdate(
                                    { memberId: message.author.id, },
                                    { limit: `${vc.userLimit}`, }
                                ).catch(err => console.log(err));
                            })
                            .catch(console.error);
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