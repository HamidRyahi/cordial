const { MessageEmbed } = require('discord.js');
const profileModel2 = require('../../database/models/tempSchema.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'friends permit',
    description: 'This command is for giving permission to your friends list to temp vc',
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
                    let friendsList = recordProfileByAuthorId.closeList;
                    if (friendsList.length === 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#808080')
                            .setTitle(`${message.author.username}, you friends list is empty!`)
                        return message.reply({ embeds: [msgEmbed] })
                            .catch(err => console.log(err));
                    }
                    if (dataProfileByChannelId.isFriendsPermit) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ffff00')
                            .setDescription(`**Notice:** You have already permitted your friends list!`)
                        return message.reply({ embeds: [msgEmbed] })
                            .catch(err => console.log(err));

                    } else {
                        let valid = [];
                        let notFound = [];
                        const msgEmbed = new MessageEmbed()
                            .setColor('#5865F2')
                            .setTitle(`<a:740852243812581446:934406830891876412> Processing...`)
                        message.reply({ embeds: [msgEmbed] })
                            .then(async botMessage => {
                                for (let i = 0; i < friendsList.length; i++) {
                                    const voiceChannel = message.guild.channels.cache.get(dataProfileByChannelId.channelId);
                                    if (!voiceChannel) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#ff0000')
                                            .setTitle(`Operation canceled!`)
                                            .setDescription('Reason: Channel deleted before operation completed.')
                                        return botMessage.edit({ embeds: [msgEmbed] })
                                            .catch(console.error);
                                    }
                                    let thisOne = friendsList[i].replace(/[\\<>@#&!]/g, "");
                                    const roleById = message.guild.roles.cache.find(r => r.id === thisOne);
                                    const user = await message.guild.members.fetch(thisOne)
                                        .catch(console.error);
                                    if (roleById) {
                                        valid.push(thisOne);
                                    }
                                    if (user) {
                                        valid.push(thisOne);
                                    }
                                    if (!roleById && !user) {
                                        notFound.push(thisOne);
                                    }
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#5865F2')
                                        .setTitle(`<a:740852243812581446:934406830891876412> Processing... ${i + 1}/${friendsList.length}`)
                                    botMessage.edit({ embeds: [msgEmbed] })
                                        .catch(console.error);
                                    if (i === friendsList.length - 1 && valid.length >= 0) {
                                        for (let i = 0; i < valid.length; i++) {
                                            await authorVC.permissionOverwrites.edit(valid[i], { VIEW_CHANNEL: true, CONNECT: true })
                                                .catch(console.error);
                                            const msgEmbed = new MessageEmbed()
                                                .setColor('#5865F2')
                                                .setTitle(`<a:740852243812581446:934406830891876412> Giving Permission... ${i + 1}/${valid.length}`)
                                            botMessage.edit({ embeds: [msgEmbed] })
                                                .catch(console.error);
                                            await profileModel2.findOneAndUpdate(
                                                { channelId: authorVC.id, },
                                                { isFriendsPermit: true }
                                            ).catch(console.error);
                                        }
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#00ff00')
                                            .setTitle(`Successfully permitted your friends list to have access to your VC!`)
                                            .setFooter(`To view your friends list you can type ${prefixProfile.prefix}friends show`)
                                        return botMessage.edit({ embeds: [msgEmbed] })
                                            .catch(err => console.log(err));

                                    }
                                    if (i === friendsList.length - 1 && notFound.length >= 1 && valid.length === 0) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#ff0000')
                                            .setTitle(`I couldn't find any user or role from your friends list in this server.`)
                                        return botMessage.edit({ embeds: [msgEmbed] })
                                            .catch(err => console.log(err));

                                    }
                                }
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