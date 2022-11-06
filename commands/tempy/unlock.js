const profileModel2 = require('../../database/models/tempSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'unlock',
    description: 'This command is for unlocking your temp vc',
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
                    if (dataProfileByChannelId.channelId === authorVC.id && dataProfileByChannelId.memberId === authorId && dataProfileByChannelId.isInChannel && dataProfileByChannelId.serverID === message.guildId) {
                        const isEveryoneHavePerm = authorVC.permissionsFor(message.guild.roles.everyone).has('CONNECT', true);
                        if (isEveryoneHavePerm === true) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ffff00')
                                .setDescription(`**Reminder:** <#${authorVC.id}> is already unlocked! :unlock:`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        } else {
                            return authorVC.permissionOverwrites.edit(role, { CONNECT: null })
                                .then(() => {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#00ff00')
                                        .setDescription(`<#${authorVC.id}> unlocked :unlock: successfully!`)
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