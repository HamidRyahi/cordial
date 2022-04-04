const profileModel2 = require('../../database/models/tempSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'transfer',
    description: 'This command is for transfering a temp vc to another member',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const oneTap = message.guild.channels.cache.get(serverProfileByAuthorId.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfileByAuthorId.categoryID) {
                let newArg;
                if (args.length !== 0)
                    newArg = args[0].replace(/[\\<>@#&!]/g, "");
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
                        if (args.length === 0) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setTitle(`${message.author.username}, you didn't provide any arguments!`)
                                .setDescription(`__correct usage:__
\`${prefixProfile.prefix}transfer @UserName\`
or:
\`${prefixProfile.prefix}transfer id_of_member\``)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (/^[0-9]{18}$/g.test(newArg)) {
                            const roleById = message.guild.roles.cache.find(r => r.id === newArg);
                            if (roleById) {
                                const msgEmbed = new MessageEmbed()
                                    .setColor('#ff0000')
                                    .setDescription(`**Notice:** You can't transfer temp voice channels to roles!`)
                                return message.reply({ embeds: [msgEmbed] })
                                    .catch(err => console.log(err));
                            }
                            const memberId = message.guild.members.fetch(newArg)
                                .then(async member => {
                                    if (member.user.bot) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#ff0000')
                                            .setDescription(`**Notice:** You can't transfer temp voice channels to bots!`)
                                        return message.reply({ embeds: [msgEmbed] })
                                            .catch(err => console.log(err));
                                    }
                                    if (member.user.id === authorId) {
                                        return message.reply(`<a:865271503862759454:935269742778912829>`)
                                            .catch(err => console.log(err));
                                    }
                                    if (member.voice.channel === null || dataProfileByChannelId.channelId !== member.voice.channel.id) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#ff0000')
                                            .setDescription(`**Notice:** <@${member.user.id}> is not connected to your voice channel!`)
                                        return message.reply({ embeds: [msgEmbed] })
                                            .catch(err => console.log(err));
                                    }
                                    if (dataProfileByChannelId.channelId === member.voice.channel.id) {
                                        await profileModel2.findOneAndUpdate(
                                            { channelId: authorVC.id },
                                            {
                                                memberId: member.user.id,
                                                isInChannel: true,
                                                isFriendsPermit: false
                                            }
                                        ).catch((err) => { console.log(err) });
                                        authorVC.permissionOverwrites.edit(member, { CONNECT: true, VIEW_CHANNEL: true })
                                            .catch(err => console.log('err0', err));
                                        authorVC.permissionOverwrites.edit(message.member, { CONNECT: null, VIEW_CHANNEL: null })
                                            .catch(err => console.log('err0', err));
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#00ff00')
                                            .setDescription(`<#${member.voice.channel.id}> **is successuflly transfered to <@${member.user.id}>!**`)
                                        return message.reply({ embeds: [msgEmbed] })
                                            .catch(err => console.log(err));
                                    }
                                })
                                .catch((err) => {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#ff0000')
                                        .setDescription(`${message.author.username}, I can't find **${args[0]}**!`)
                                    message.reply({ embeds: [msgEmbed] })
                                        .catch(err => console.log(err));
                                    console.log(err);
                                });
                        } else {
                            if (newArg.length > 20) {
                                const msgEmbed = new MessageEmbed()
                                    .setColor('#ff0000')
                                    .setDescription(`${message.author.username}, The argument you provided is invalid!`)
                                return message.reply({ embeds: [msgEmbed] })
                                    .catch(err => console.log(err));
                            }
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, I can't find **\`${args[0]}\`**!`)
                            message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
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