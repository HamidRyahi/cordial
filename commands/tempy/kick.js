const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'kick',
    // cooldown: 60,
    description: 'This command is for kicking users or roles from your temp vc',
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
                    if (dataProfileByChannelId.channelId === authorVC.id && dataProfileByChannelId.memberId === authorId && dataProfileByChannelId.isInChannel) {
                        if (args.length === 0) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setTitle(`${message.author.username}, You didn't provide any arguments!`)
                                .setDescription(`__correct usage:__
You can mention or provide IDs of one or multiple members AND/OR roles:
\`${prefixProfile.prefix}kick @member\`
\`${prefixProfile.prefix}kick member_id\`
\`${prefixProfile.prefix}kick @member1 @member2 member3_id member4_id\`
\`${prefixProfile.prefix}kick @role1 @role2 role3_id role4_id\`
\`${prefixProfile.prefix}kick @member1 member2_id @role1 role2_id\``)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }

                        for (let i = 0; i < args.length; i++) {
                            args[i] = args[i].replace(/[\\<>@#&!]/g, "");
                        }

                        let arrWithoutRepeated;
                        arrWithoutRepeated = [...new Set(args)];
                        function keep18Args(el) {
                            if (/^[0-9]{18}$/g.test(el) || /^[0-9]{19}$/g.test(el)) {
                                return el;
                            }
                        }
                        let arrWithoutRepeated2 = arrWithoutRepeated.filter(keep18Args);
                        if (arrWithoutRepeated2.length === 1 && arrWithoutRepeated2[0] === message.author.id) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't kick yourself!`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (arrWithoutRepeated2.length === 1 && arrWithoutRepeated2[0] === message.guildId) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't kick everyone!2`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                        if (arrWithoutRepeated2.length === 0 && args.length === 1 && args[0].length > 20) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, The argument you provided is invalid!`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (arrWithoutRepeated2.length === 2 && arrWithoutRepeated2.includes(message.guildId) && arrWithoutRepeated2.includes(message.author.id)) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't kick yourself or everyone!3`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                        if (args.length === 1 && arrWithoutRepeated2.length === 0) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, I can't find **${message.content.substring(8)}**!4`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                        if (args.length > 1 && arrWithoutRepeated2.length === 0) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, no valid members or roles were provided!5`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                        let permitted = [];
                        let valid = [];
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ffff00')
                            .setTitle(`<a:740852243812581446:934406830891876412> Processing...`)
                        message.reply({ embeds: [msgEmbed] })
                            .then(async botMessage => {
                                for (let i = 0; i < arrWithoutRepeated2.length; i++) {
                                    const roleById = message.guild.roles.cache.find(r => r.id === arrWithoutRepeated2[i]);
                                    const user = client.users.cache.find(user => user.id === arrWithoutRepeated2[i]);
                                    if (roleById) {
                                        valid.unshift(`<@&${arrWithoutRepeated2[i]}>`)
                                    }
                                    if (user) {
                                        valid.push(`<@${arrWithoutRepeated2[i]}>`)
                                    }

                                    if (args.length === 1 && arrWithoutRepeated2.length === 1 && i === arrWithoutRepeated2.length - 1 && valid.length === 0) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#ff0000')
                                            .setDescription(`${message.author.username}, I can't find **${message.content.substring(8)}**!6`)
                                        return botMessage.edit({ embeds: [msgEmbed] })
                                            .catch(console.error);
                                    }

                                    if (args.length > 1 && arrWithoutRepeated2.length > 1 && i === arrWithoutRepeated2.length - 1 && valid.length === 0) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#ff0000')
                                            .setDescription(`${message.author.username}, unknown members or roles were provided!7`)
                                        return botMessage.edit({ embeds: [msgEmbed] })
                                            .catch(console.error);
                                    }

                                    if (i === arrWithoutRepeated2.length - 1 && valid.length === 1) {
                                        let thisOne = valid[0].replace(/[\\<>@#&!]/g, "");
                                        if (thisOne === message.author.id) {
                                            const msgEmbed = new MessageEmbed()
                                                .setColor('#ff0000')
                                                .setDescription(`${message.author.username}, you can't kick yourself!8`)
                                            return botMessage.edit({ embeds: [msgEmbed] })
                                                .catch(console.error);
                                        }

                                        if ((thisOne === message.guild.id)) {
                                            const msgEmbed = new MessageEmbed()
                                                .setColor('#ff0000')
                                                .setDescription(`${message.author.username}, you can't kick everyone!9`)
                                            return botMessage.edit({ embeds: [msgEmbed] })
                                                .catch(console.error);
                                        }
                                    }
                                    if (i === arrWithoutRepeated2.length - 1 && valid.length === 2) {
                                        let thisOne = valid[0].replace(/[\\<>@#&!]/g, "");
                                        let thisOne1 = valid[1].replace(/[\\<>@#&!]/g, "");
                                        if ((thisOne === message.guild.id && thisOne1 === message.author.id) || (thisOne1 === message.guild.id && thisOne === message.author.id)) {
                                            const msgEmbed = new MessageEmbed()
                                                .setColor('#ff0000')
                                                .setDescription(`${message.author.username}, you can't kick everyone or yourself!10`)
                                            return botMessage.edit({ embeds: [msgEmbed] })
                                                .catch(console.error);
                                        }
                                    }
                                    if (i === arrWithoutRepeated2.length - 1 && valid.length > 1) {
                                        if (valid.includes(`<@&${message.guildId}>`)) {
                                            const index = valid.indexOf(`<@&${message.guildId}>`);
                                            if (index > -1) {
                                                valid.splice(index, 1);
                                            }
                                        }
                                        if (valid.includes(`<@${message.author.id}>`)) {
                                            const index = valid.indexOf(`<@${message.author.id}>`);
                                            if (index > -1) {
                                                valid.splice(index, 1);
                                            }
                                        }
                                    }
                                }




                                for (let i = 0; i < valid.length; i++) {
                                    let thisOne = valid[i].replace(/[\\<>@#&!]/g, "");
                                    const roleById = message.guild.roles.cache.find(r => r.id === thisOne);
                                    const user = client.users.cache.find(user => user.id === thisOne);
                                    if (roleById) {
                                        authorVC.members.forEach(async (m) => {
                                            if (m._roles.includes(thisOne) && m.id !== message.author.id) {
                                                m.voice.disconnect()
                                                    .catch(err => console.log(err));
                                                if (!permitted.includes(valid[i])) {
                                                    permitted.push(valid[i]);
                                                }
                                            }
                                        })
                                    }
                                    if (user) {
                                        await message.guild.members
                                            .fetch(thisOne)
                                            .then(async member => {
                                                if (member.voice.channel) {
                                                    if (member.voice.channel.id === authorVC.id) {
                                                        member.voice.disconnect()
                                                            .catch(err => console.log(err));
                                                        permitted.push(valid[i]);

                                                    }
                                                }
                                            })
                                            .catch(console.error);
                                    }




                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#5865F2')
                                        .setTitle(`<a:740852243812581446:934406830891876412> Processing... ${i + 1}/${valid.length}`)
                                    botMessage.edit({ embeds: [msgEmbed] })
                                        .catch(console.error);



                                    if (i === valid.length - 1 && permitted.length !== 0) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#00ff00')
                                            .setTitle(`${message.author.username}, you have successfully kicked:`)
                                            .setDescription(`${permitted.join(" | ")}`)
                                        return botMessage.edit({ embeds: [msgEmbed] })
                                            .catch(console.error);
                                    }
                                    if (permitted.length === 0 && i === valid.length - 1) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#ff0000')
                                            .setTitle(`Not connected to your temp VC:`)
                                            .setDescription(`${valid.join(" | ")}`)
                                        return botMessage.edit({ embeds: [msgEmbed] })
                                            .catch(console.error);
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