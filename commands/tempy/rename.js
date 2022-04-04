const profileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'rename',
    aliases: ['name'],
    cooldown: 300,
    description: 'This command is for renaming temp voice channels',
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
                        // if (args.length === 0) {
                        //     const msgEmbed = new MessageEmbed()
                        //         .setColor('#ff0000')
                        //         .setTitle(`${message.author.username}, you didn't provide any arguments!`)
                        //         .setDescription(`__correct usage:__
                        //             \`${prefixProfile.prefix}rename Name of Channel\``)
                        //     return message.reply({ embeds: [msgEmbed] })
                        //         .catch(err => console.log(err));
                        // }
                        message.member.voice.channel
                            .setName(args.join(' '))
                            .then(async newChannel => {
                                await profileModel.findOneAndUpdate(
                                    { memberId: message.author.id, },
                                    { name: `${newChannel.name}`, }
                                ).catch(console.error);
                                const msgEmbed = new MessageEmbed()
                                    .setColor('#00ff00')
                                    .setDescription(`**${message.author.username}, you have successfully changed the channel's name to:** **\`${newChannel.name}\`**!`)
                                    .setFooter('Note: You can only use this command 1 times every 5 minutes.');
                                return message.reply({ embeds: [msgEmbed] })
                                    .catch(console.error);
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