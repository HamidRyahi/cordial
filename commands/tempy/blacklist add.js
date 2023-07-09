const userProfileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'blacklist add',
    aliases: ["bl add"],
    // cooldown: 60,
    description: 'This command is for adding a member or role to your blacklist',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        const authorVC = message.member.voice.channel;
        if (args.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${message.author.username}, you didn't provide any arguments.`)
                .setDescription(`__correct usage:__
You can mention or provide IDs of one or multiple members AND/OR roles:
\`${serverProfile.prefix}blacklist add @member\`
\`${serverProfile.prefix}blacklist add member_id\`
\`${serverProfile.prefix}blacklist add @member1 @member2 member3_id member4_id\`
\`${serverProfile.prefix}blacklist add @role1 @role2 role3_id role4_id\`
\`${serverProfile.prefix}blacklist add @member1 member2_id @role1 role2_id\``)
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
        let arrWithOnlyIds = arrWithoutRepeated.filter(keep18Args);



        if (arrWithOnlyIds.length === 1 && arrWithOnlyIds[0] === message.author.id) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, you can't blacklist yourself!1`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        if (arrWithOnlyIds.length === 1 && arrWithOnlyIds[0] === message.guildId) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, you can't blacklist everyone!2`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        //
        if (arrWithOnlyIds.length === 0 && args.length === 1 && args[0].length > 20) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, The argument you provided is invalid!`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(err => console.log(err));
        }
        //
        if (arrWithOnlyIds.length === 2 && arrWithOnlyIds.includes(message.guildId) && arrWithOnlyIds.includes(message.author.id)) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, you can't blacklist yourself or everyone!3`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        if (args.length === 1 && arrWithOnlyIds.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, I can't find **${message.content.substring(15)}**!4`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        if (args.length > 1 && arrWithOnlyIds.length === 0) {
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



                for (let i = 0; i < arrWithOnlyIds.length; i++) {
                    const roleById = message.guild.roles.cache.find(r => r.id === arrWithOnlyIds[i]);
                    const user = client.users.cache.find(user => user.id === arrWithOnlyIds[i]);
                    if (roleById) {
                        valid.unshift(`<@&${arrWithOnlyIds[i]}>`)
                    }
                    if (user) {
                        valid.push(`<@${arrWithOnlyIds[i]}>`)
                    }

                    if (args.length === 1 && arrWithOnlyIds.length === 1 && i === arrWithOnlyIds.length - 1 && valid.length === 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setDescription(`${message.author.username}, I can't find **${message.content.substring(15)}**!6`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }

                    if (args.length > 1 && arrWithOnlyIds.length >= 1 && i === arrWithOnlyIds.length - 1 && valid.length === 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setDescription(`${message.author.username}, unknown members or roles were provided!7`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }

                    if (i === arrWithOnlyIds.length - 1 && valid.length === 1) {
                        let thisOne = valid[0].replace(/[\\<>@#&!]/g, "");
                        if (thisOne === message.author.id) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't blacklist yourself!8`)
                            return botMessage.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }

                        if ((thisOne === message.guild.id)) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't add everyone to your blacklist!9`)
                            return botMessage.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    }

                    if (i === arrWithOnlyIds.length - 1 && valid.length === 2) {
                        let thisOne = valid[0].replace(/[\\<>@#&!]/g, "");
                        let thisOne1 = valid[1].replace(/[\\<>@#&!]/g, "");
                        if ((thisOne === message.guild.id && thisOne1 === message.author.id) || (thisOne1 === message.guild.id && thisOne === message.author.id)) {
                            const msgEmbed = new MessageEmbed()
                                .setColor('#ff0000')
                                .setDescription(`${message.author.username}, you can't add everyone or yourself to your blacklist!10`)
                            return botMessage.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    }

                    if (i === arrWithOnlyIds.length - 1 && valid.length > 1) {
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
                    if (!authorProfile.blacklist.includes(valid[i])) {
                        permitted.push(valid[i]);
                        await userProfileModel.findOneAndUpdate(
                            { memberId: message.author.id, },
                            { $push: { blacklist: valid[i] } }
                        ).catch(console.error);
                        await userProfileModel.findOneAndUpdate(
                            { memberId: message.author.id, },
                            { $pull: { closeList: valid[i] } }
                        ).catch(console.error);

                        const msgEmbed = new MessageEmbed()
                            .setColor('#5865F2')
                            .setTitle(`<a:740852243812581446:934406830891876412> Processing... ${i + 1}/${valid.length}`)
                        botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);

                    }



                    if (authorVC && authorTempVC) {
                        if (authorVC.id === authorTempVC.channelId && message.author.id === authorTempVC.memberId) {
                            let thisOne = valid[i].replace(/[\\<>@#&!]/g, "");
                            const roleById = message.guild.roles.cache.find(r => r.id === thisOne);
                            const user = client.users.cache.find(user => user.id === thisOne);
                            if (roleById) {
                                await authorVC.permissionOverwrites.edit(roleById, { CONNECT: false, VIEW_CHANNEL: null })
                                    .then(async () => {
                                        authorVC.members.forEach(async (m) => {
                                            if (m._roles.includes(thisOne) && m.id !== message.author.id) {
                                                m.voice.disconnect()
                                                    .catch(err => console.log(err));
                                            }
                                        })
                                    })
                                    .catch(console.error);
                            }
                            if (user) {
                                await authorVC.permissionOverwrites.edit(user, { CONNECT: false, VIEW_CHANNEL: null })
                                    .then(async () => {
                                        await message.guild.members
                                            .fetch(thisOne)
                                            .then(async member => {
                                                if (member.voice.channel) {
                                                    if (member.voice.channel.id === authorVC.id) {
                                                        member.voice.disconnect()
                                                            .catch(err => console.log(err));
                                                    }
                                                }
                                            })
                                            .catch(console.error);
                                    })
                                    .catch(console.error);
                            }
                        }
                    }



                    if (i === valid.length - 1 && permitted.length !== 0) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#00ff00')
                            .setTitle(`${message.author.username}, you have successfully added to your blacklist:`)
                            .setDescription(`${permitted.join(" | ")}`)
                            .setFooter(`To view your blacklist you can type ${serverProfile.prefix}blacklist show`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }


                    if (permitted.length === 0 && i === valid.length - 1) {
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setTitle(`Already blacklisted:`)
                            .setDescription(`${valid.join(" | ")}`)
                            .setFooter(`To view your blacklist you can type: ${serverProfile.prefix}blacklist show`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }
                }


            })
            .catch(console.error);
    }
}