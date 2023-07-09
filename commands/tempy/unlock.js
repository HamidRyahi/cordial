const tempVcProfileModel = require('../../database/models/tempSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'unlock',
    description: 'This command is for unlocking your temp vc',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        // if ( serverProfile) {
        const oneTap = message.guild.channels.cache.get(serverProfile.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfile.categoryID) {
                const authorVC = message.member.voice.channel;
                const authorId = message.author.id;
                const role = message.guild.roles.cache.find(r => r.name.includes('everyone'));
                notInTempVc(authorVC, authorTempVC, serverProfile, message);
                if (authorTempVC) {
                    if (authorVC.id === authorTempVC.channelId && authorTempVC.memberId === "") {
                        return noOwnerCurrently(authorTempVC, serverProfile, authorVC, message, authorId);
                    }
                    if (authorTempVC.channelId === authorVC.id && authorTempVC.memberId !== authorId) {
                        return notTheOwner(message, authorVC, serverProfile);
                    }
                    if (authorTempVC.channelId === authorVC.id && authorTempVC.memberId === authorId && authorTempVC.isInChannel && authorTempVC.serverID === message.guildId) {
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
                noValidSetup(message, serverProfile.prefix);
            }
        } else {
            noValidSetup(message, serverProfile.prefix);
        }
        // }
    }
}