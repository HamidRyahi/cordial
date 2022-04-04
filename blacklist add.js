const profileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'blacklist add2',
    description: 'This command is for adding a member or role to your blacklist list',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const authorVC = message.member.voice.channel;
        if (args.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${message.author.username}, you didn't provide any arguments.`)
                .setDescription(`__correct usage:__
You can mention or provide IDs of one or multiple members AND/OR roles:
\`${prefixProfile.prefix}blacklist add @member\`
\`${prefixProfile.prefix}blacklist add member_id\`
\`${prefixProfile.prefix}blacklist add @member1 @member2 member3_id member4_id\`
\`${prefixProfile.prefix}blacklist add @role1 @role2 role3_id role4_id\`
\`${prefixProfile.prefix}blacklist add @member1 member2_id @role1 role2_id\``)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        for (let i = 0; i < args.length; i++) {
            args[i] = args[i].replace(/[\\<>@#&!]/g, "");
        }
        if (args.length === 1 && args[0] === message.author.id) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, you can't blacklist yourself!`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        let arrWithoutRepeated;
        arrWithoutRepeated = [...new Set(args)];
        function keep18Args(el) {
            if (/^[0-9]{18}$/g.test(el)) {
                return el;
            }
        }
        let arrWithoutRepeated2 = arrWithoutRepeated.filter(keep18Args)
        if (args.length === 1 && arrWithoutRepeated2.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, I can't find **${message.content.substring(15)}**!`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        if (args.length > 1 && arrWithoutRepeated2.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, no valid members or roles were provided.`)
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
                    if (arrWithoutRepeated2[i] === message.author.id) continue;
                    const roleById = message.guild.roles.cache.find(r => r.id === arrWithoutRepeated2[i])
                    const user = client.users.cache.find(user => user.id === arrWithoutRepeated2[i])
                    if (roleById) {
                        valid.unshift(`<@&${arrWithoutRepeated2[i]}>`)
                    }
                    if (user) {
                        valid.push(`<@${arrWithoutRepeated2[i]}>`)
                    }
                    if (args.length === 1 && arrWithoutRepeated2.length === 1 && i === arrWithoutRepeated2.length - 1 && valid.length === 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setDescription(`${message.author.username}, I can't find **${message.content.substring(15)}**!`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }
                    if (i === arrWithoutRepeated2.length - 1 && valid.length === 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setDescription(`${message.author.username}, unknown members or roles were provided!`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }
                    if (i === arrWithoutRepeated2.length - 1 && valid.length === 1) {
                        let thisOne = valid[0].replace(/[\\<>@#&!]/g, "");
                        if (thisOne === message.author.id) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't blacklist yourself!`)
                            return botMessage.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    }
                    if (i === arrWithoutRepeated2.length - 1 && valid.length === 1) {
                        let thisOne = valid[0].replace(/[\\<>@#&!]/g, "");
                        if ((thisOne === message.guild.id) || (args.length === 1 && args[0] === "everyone")) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't add everyone to your blacklist!`)
                            return botMessage.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    }
                    if (i === arrWithoutRepeated2.length - 1 && valid.length === 1) {
                        let thisOne = valid[0].replace(/[\\<>@#&!]/g, "");
                        if (thisOne === message.guild.id) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't add everyone to your blacklist!`)
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
                                .setDescription(`${message.author.username}, you can't add everyone or yourself to your blacklist list!`)
                            return botMessage.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    }
                }
                for (let i = 0; i < valid.length; i++) {
                    if (!recordProfileByAuthorId.blacklist.includes(valid[i])) {
                        permitted.push(valid[i]);
                        await profileModel.findOneAndUpdate(
                            { memberId: message.author.id, },
                            { $push: { blacklist: valid[i] } }
                        ).catch(console.error);
                        await profileModel.findOneAndUpdate(
                            { memberId: message.author.id, },
                            { $pull: { closeList: valid[i] } }
                        ).catch(console.error);
                        const msgEmbed = new MessageEmbed()
                            .setColor('#5865F2')
                            .setTitle(`<a:740852243812581446:934406830891876412> Processing... ${i + 1}/${valid.length}`)
                        botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }
                    if (authorVC && dataProfileByChannelId) {
                        let thisOne = valid[i].replace(/[\\<>@#&!]/g, "");
                        if (dataProfileByChannelId.isblacklistPermit) {
                            if (authorVC.id === dataProfileByChannelId.channelId && message.author.id === dataProfileByChannelId.memberId) {
                                await authorVC.permissionOverwrites.edit(thisOne, { VIEW_CHANNEL: null, CONNECT: false })
                                    .then(async () => {
                                        let haha = authorVC.members.forEach(async (m) => {
                                            if (m._roles.includes(thisOne) && m.id !== message.author.id) {
                                                await authorVC.permissionOverwrites.edit(m, { VIEW_CHANNEL: true, CONNECT: true })
                                                    .catch(console.error);
                                            }
                                        })
                                    })
                                    .catch(console.error);
                                const memberId = await message.guild.members
                                    .fetch(thisOne)
                                    .then(async member => {
                                        await authorVC.permissionOverwrites.edit(member, { VIEW_CHANNEL: true, CONNECT: true })
                                            .catch(console.error);
                                    })
                                    .catch(console.error);
                            }
                        }
                    }
                    if (i === valid.length - 1 && permitted.length !== 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#00ff00')
                            .setTitle(`${message.author.username}, you have successfully added to your blacklist list:`)
                            .setDescription(`${permitted.join("\n")}`)
                            .setFooter(`To view your blacklist you can type ${prefixProfile.prefix}blacklist show`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }
                    if (permitted.length === 0 && i === valid.length - 1) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setTitle(`Already Added:`)
                            .setDescription(`${valid.join("\n")}`)
                            .setFooter(`To view your blacklist list you can type: ${prefixProfile.prefix}blacklist show`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }
                }
            })
            .catch(console.error);
    }
}