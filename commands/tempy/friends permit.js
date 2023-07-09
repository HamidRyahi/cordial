const { MessageEmbed } = require('discord.js');
const tempVcProfileModel = require('../../database/models/tempSchema.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'friends permit',
    description: 'This command is for giving permission to your friends list to temp vc',
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
                    let friendsList = authorProfile.closeList;
                    if (friendsList.length === 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#808080')
                            .setTitle(`${message.author.username}, you friends list is empty!`)
                        return message.reply({ embeds: [msgEmbed] })
                            .catch(err => console.log(err));
                    }
                    if (authorTempVC.isFriendsPermit) {
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
                                    const voiceChannel = message.guild.channels.cache.get(authorTempVC.channelId);
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
                                            await tempVcProfileModel.findOneAndUpdate(
                                                { channelId: authorVC.id, },
                                                { isFriendsPermit: true }
                                            ).catch(console.error);
                                        }
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#00ff00')
                                            .setTitle(`Successfully permitted your friends list to have access to your VC!`)
                                            .setFooter(`To view your friends list you can type ${serverProfile.prefix}friends show`)
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
                noValidSetup(message, serverProfile.prefix);
            }
        } else {
            noValidSetup(message, serverProfile.prefix);
        }
    }
}