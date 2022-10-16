const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'lock',
    description: 'This command is for locking your temp vc',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        // if (serverProfileByAuthorId) {
        const oneTap = message.guild.channels.cache.get(serverProfileByAuthorId.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfileByAuthorId.categoryID) {
                const authorVC = message.member.voice.channel;
                const authorId = message.author.id;
                const role = message.guild.roles.cache.find(r => r.name.includes('everyone'));
                notInTempVc(authorVC, dataProfileByChannelId, serverProfileByAuthorId, message);
                if (dataProfileByChannelId) {
                    if (authorVC.id === dataProfileByChannelId.channelId && dataProfileByChannelId.memberId === "") {
                        return noOwnerCurrently(dataProfileByChannelId, serverProfileByAuthorId, prefixProfile, authorVC, message, authorId);
                    }
                    if (dataProfileByChannelId.channelId === authorVC.id && dataProfileByChannelId.memberId !== authorId) {
                        return notTheOwner(message, authorVC, serverProfileByAuthorId);
                    }
                    if (dataProfileByChannelId.channelId === authorVC.id && dataProfileByChannelId.memberId === authorId && dataProfileByChannelId.isInChannel) {
                        const isEveryoneHavePerm = authorVC.permissionsFor(message.guild.roles.everyone).has('CONNECT', false);
                        console.log(isEveryoneHavePerm)
                        if (isEveryoneHavePerm) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ffff00')
                                .setDescription(`**Reminder:** <#${authorVC.id}> is already locked! :lock:`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        } else {
                            return authorVC.permissionOverwrites.edit(message.guild.roles.everyone, { CONNECT: false })
                                .then(() => {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#00ff00')
                                        .setDescription(`<#${authorVC.id}> locked :lock: successfully!`)
                                    return message.reply({ embeds: [msgEmbed] })
                                        .catch(err => console.log(err));
                                })
                                .catch(console.error);
                        }
                    }
                }
            } else {
                noValidSetup(message, prefixProfile);
            }
        } else {
            noValidSetup(message, prefixProfile);
        }
        // }
    }
}