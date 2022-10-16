const profileModel2 = require('../../database/models/tempSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'hide',
    description: 'This command is for making temp voice channels unvisible',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
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


                        if (!message.member.roles.cache.find(r => r.id === "1005997227010953308") && message.guild.id === '969646088254541894') {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ffff00')
                                .setDescription(`You must have the <@&1005997227010953308> role to use this command!`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }









                        const isEveryoneHavePerm = authorVC.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL', true);
                        if (!isEveryoneHavePerm) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ffff00')
                                .setDescription(`**Reminder:** <#${authorVC.id}> is already hidden. 🙈`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        } else {
                            return authorVC.permissionOverwrites.edit(role, { VIEW_CHANNEL: false })
                                .then(() => {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#00ff00')
                                        .setDescription(`
                                        
**${message.author.username}, <#${authorVC.id}> is now hidden!**`)
                                        .setThumbnail('https://cdn.discordapp.com/emojis/935592651258990692.gif')
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
    }
}