const userProfileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'rename',
    aliases: ['name'],
    cooldown: 300,
    description: 'This command is for renaming temp voice channels',
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
                        // if (args.length === 0) {
                        //     const msgEmbed = new MessageEmbed()
                        //         .setColor('#ff0000')
                        //         .setTitle(`${message.author.username}, you didn't provide any arguments!`)
                        //         .setDescription(`__correct usage:__
                        //             \`${serverProfile.prefix}rename Name of Channel\``)
                        //     return message.reply({ embeds: [msgEmbed] })
                        //         .catch(err => console.log(err));
                        // }
                        message.member.voice.channel
                            .setName(args.join(' '))
                            .then(async newChannel => {
                                await userProfileModel.findOneAndUpdate(
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
                noValidSetup(message, serverProfile.prefix);
            }
        } else {
            noValidSetup(message, serverProfile.prefix);
        }
    }
}