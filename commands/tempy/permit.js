const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'permit',
    // cooldown: 10,
    description: 'This command is for permitting a user or role from your temp vc',
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
                    if (authorTempVC.channelId === authorVC.id && authorTempVC.memberId === authorId && authorTempVC.isInChannel) {
                        if (args.length === 0) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setTitle(`${message.author.username}, You didn't provide any arguments!`)
                                .setDescription(`__correct usage:__
You can mention or provide IDs of one or multiple members AND/OR roles:
\`${serverProfile.prefix}permit @member\`
\`${serverProfile.prefix}permit member_id\`
\`${serverProfile.prefix}permit @member1 @member2 member3_id member4_id\`
\`${serverProfile.prefix}permit @role1 @role2 role3_id role4_id\`
\`${serverProfile.prefix}permit @member1 member2_id @role1 role2_id\``)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }

                        for (let i = 0; i < args.length; i++) {
                            args[i] = args[i].replace(/[\\<>@#&!]/g, "");
                        }

                        let arrWithoutRepeated;
                        arrWithoutRepeated = [...new Set(args)];
                        function keep18Args(el) {
                            if (/^[0-9]{18}$/g.test(el)) {
                                return el;
                            }
                        }
                        let arrWithoutRepeated2 = arrWithoutRepeated.filter(keep18Args);
                        if (arrWithoutRepeated2.length === 1 && arrWithoutRepeated2[0] === message.author.id) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you are already permitted!`)
                            return message.reply({ embeds: [msgEmbed] })
                                .catch(err => console.log(err));
                        }
                        if (arrWithoutRepeated2.length === 1 && arrWithoutRepeated2[0] === message.guildId) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't permit everyone!2`)
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
                                .setDescription(`${message.author.username}, you are already permitted + you can't permit everyone!3`)
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
                        let alreadyRejected = [];
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
                                                .setDescription(`${message.author.username}, you are already permitted!8`)
                                            return botMessage.edit({ embeds: [msgEmbed] })
                                                .catch(console.error);
                                        }

                                        if ((thisOne === message.guild.id)) {
                                            const msgEmbed = new MessageEmbed()
                                                .setColor('#ff0000')
                                                .setDescription(`${message.author.username}, you can't permit everyone!9`)
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
                                                .setDescription(`${message.author.username}, you are already permitted + you can't permit everyone!10`)
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
                                        // const isRoleHasPerm = authorVC.permissionsFor(roleById).has('CONNECT', true);
                                        // if (!isRoleHasPerm) {
                                        await authorVC.permissionOverwrites.edit(roleById, { CONNECT: true })
                                            .then(async () => {
                                                const isEveryoneHavePerm = authorVC.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL', true);
                                                if (!isEveryoneHavePerm) {
                                                    await authorVC.permissionOverwrites.edit(roleById, { VIEW_CHANNEL: true })
                                                        .catch(console.error);
                                                }
                                            })
                                            .catch(console.error);
                                        permitted.push(valid[i]);
                                        // } else if (isRoleHasPerm === true) {
                                        // alreadyRejected.push(valid[i]);
                                        // }
                                    }
                                    if (user) {
                                        await message.guild.members
                                            .fetch(thisOne)
                                            .then(async member => {
                                                // const isUserHasPerm = authorVC.permissionsFor(member).has('CONNECT', true);
                                                // if (!isUserHasPerm) {
                                                await authorVC.permissionOverwrites.edit(member, { CONNECT: true })
                                                    .catch(err => console.log(err));
                                                const isEveryoneHavePerm = authorVC.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL', true);
                                                if (!isEveryoneHavePerm) {
                                                    await authorVC.permissionOverwrites.edit(member, { CONNECT: true, VIEW_CHANNEL: true })
                                                        .catch(console.error);
                                                }
                                                permitted.push(valid[i]);
                                                // } else if (isUserHasPerm === true) {
                                                // alreadyRejected.push(valid[i]);
                                                // }
                                            })
                                            .catch(console.error);
                                    }



                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#5865F2')
                                        .setTitle(`<a:740852243812581446:934406830891876412> Processing... ${i + 1}/${valid.length}`)
                                    botMessage.edit({ embeds: [msgEmbed] })
                                        .catch(console.error);

                                    const permittedChecker = () => {
                                        if (permitted.length >= 1) {
                                            return `**${message.author.username}, you have successfully permitted:**
    
${permitted.join(" | ")}`;
                                        } else {
                                            return '';
                                        }
                                    }
                                    const alreadyRejectedChecker = () => {
                                        if (alreadyRejected.length >= 1) {
                                            return `Already permitted:
    
${alreadyRejected.join(" | ")}`;
                                        } else {
                                            return '';
                                        }
                                    }
                                    const notFoundChecker = () => {
                                        if (permitted.length + alreadyRejected.length !== valid.length) {
                                            let both = permitted.concat(alreadyRejected);
                                            let notFound = valid.filter(function (obj) { return both.indexOf(obj) == -1; });
                                            return `Not found in this server:
    
${notFound.join(" | ")}`;
                                        } else {
                                            return '';
                                        }
                                    }



                                    if (i === valid.length - 1) {
                                        const msgEmbed = new MessageEmbed()
                                            .setColor('#00ff00')
                                            .setDescription(`
    ${permittedChecker()}
    ${alreadyRejectedChecker()}
    ${notFoundChecker()}
    `)
                                        return botMessage.edit({ embeds: [msgEmbed] })
                                            .catch(console.error);
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