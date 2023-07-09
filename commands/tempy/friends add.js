const profileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'friends add',
    // cooldown: 60,
    aliases: ["favs add", "favorites add"],
    description: 'This command is for adding a member or role to your friends list',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const authorVC = message.member.voice.channel;
        if (args.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${message.author.username}, you didn't provide any arguments.`)
                .setDescription(`__correct usage:__
You can mention or provide IDs of one or multiple members AND/OR roles:
\`${prefixProfile.prefix}friends add @member\`
\`${prefixProfile.prefix}friends add member_id\`
\`${prefixProfile.prefix}friends add @member1 @member2 member3_id member4_id\`
\`${prefixProfile.prefix}friends add @role1 @role2 role3_id role4_id\`
\`${prefixProfile.prefix}friends add @member1 member2_id @role1 role2_id\``)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
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
                .setDescription(`${message.author.username}, you can't add yourself to your friends list!1`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        if (arrWithoutRepeated2.length === 1 && arrWithoutRepeated2[0] === message.guildId) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, you can't add everyone to your friends list!2`)
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
                .setDescription(`${message.author.username}, you can't add yourself or everyone to your friends list!3`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        if (args.length === 1 && arrWithoutRepeated2.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, I can't find **${message.content.substring(13)}**!4`)
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
                            .setDescription(`${message.author.username}, I can't find **${message.content.substring(13)}**!6`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }

                    if (args.length > 1 && arrWithoutRepeated2.length >= 1 && i === arrWithoutRepeated2.length - 1 && valid.length === 0) {
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
                                .setDescription(`${message.author.username}, you can't add yourself to your friends list!8`)
                            return botMessage.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }

                        if ((thisOne === message.guild.id)) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't add everyone to your friends list!9`)
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
                                .setDescription(`${message.author.username}, you can't add everyone or yourself to your friends list!10`)
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
                    if (!recordProfileByAuthorId.closeList.includes(valid[i])) {
                        permitted.push(valid[i]);
                        await profileModel.findOneAndUpdate(
                            { memberId: message.author.id, },
                            { $push: { closeList: valid[i] } }
                        ).catch(console.error);
                        await profileModel.findOneAndUpdate(
                            { memberId: message.author.id, },
                            { $pull: { blacklist: valid[i] } }
                        ).catch(console.error);

                        const msgEmbed = new MessageEmbed()
                            .setColor('#5865F2')
                            .setTitle(`<a:740852243812581446:934406830891876412> Processing... ${i + 1}/${valid.length}`)
                        botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }



                    if (authorVC && dataProfileByChannelId) {
                        if (authorVC.id === dataProfileByChannelId.channelId && message.author.id === dataProfileByChannelId.memberId) {
                            if (dataProfileByChannelId.isFriendsPermit) {
                                let thisOne = valid[i].replace(/[\\<>@#&!]/g, "");
                                const roleById = message.guild.roles.cache.find(r => r.id === thisOne);
                                const user = client.users.cache.find(user => user.id === thisOne);
                                if (roleById) {
                                    await authorVC.permissionOverwrites.edit(roleById, { CONNECT: true })
                                        .then(async () => {
                                            const isEveryoneHavePerm = authorVC.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL', true);
                                            if (!isEveryoneHavePerm) {
                                                await authorVC.permissionOverwrites.edit(roleById, { VIEW_CHANNEL: true })
                                                    .catch(console.error);
                                            }
                                        })
                                        .catch(console.error);
                                }
                                if (user) {
                                    await authorVC.permissionOverwrites.edit(user, { CONNECT: true })
                                        .then(async () => {
                                            await message.guild.members
                                                .fetch(thisOne)
                                                .then(async member => {
                                                    const isEveryoneHavePerm = authorVC.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL', true);
                                                    if (!isEveryoneHavePerm) {
                                                        await authorVC.permissionOverwrites.edit(member, { VIEW_CHANNEL: true })
                                                            .catch(console.error);
                                                    }
                                                })
                                                .catch(console.error);
                                        })
                                        .catch(console.error);
                                }
                            }
                        }
                    }



                    if (i === valid.length - 1 && permitted.length !== 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#00ff00')
                            .setTitle(`${message.author.username}, you have successfully added to your friends list:`)
                            .setDescription(`${permitted.join(" | ")}`)
                            .setFooter(`To view your friends you can type ${prefixProfile.prefix}friends show`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }


                    if (permitted.length === 0 && i === valid.length - 1) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setTitle(`Already added to your friends list:`)
                            .setDescription(`${valid.join(" | ")}`)
                            .setFooter(`To view your friends list you can type: ${prefixProfile.prefix}friends show`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }
                }


            })
            .catch(console.error);
    }
}