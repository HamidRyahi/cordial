const tempVcProfileModel = require('../../database/models/tempSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'hide',
    description: 'This command is for making temp voice channels unvisible',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
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
                noValidSetup(message, serverProfile.prefix);
            }
        } else {
            noValidSetup(message, serverProfile.prefix);
        }
    }
}