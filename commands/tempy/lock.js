const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'lock',
    description: 'This command is for locking your temp vc',
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
                    if (authorTempVC.channelId === authorVC.id && authorTempVC.memberId === authorId && authorTempVC.isInChannel) {
                        const isEveryoneHavePerm = authorVC.permissionsFor(message.guild.roles.everyone).has('CONNECT', true);
                        console.log(isEveryoneHavePerm)
                        if (isEveryoneHavePerm === false) {
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
                noValidSetup(message, serverProfile.prefix);
            }
        } else {
            noValidSetup(message, serverProfile.prefix);
        }
        // }
    }
}