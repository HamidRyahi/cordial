const profileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'blacklist remove',
    // cooldown: 60,
    description: 'This command is for removing a member or role from your blacklist',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const authorVC = message.member.voice.channel;
        if (args.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${message.author.username}, you didn't provide any arguments.`)
                .setDescription(`__correct usage:__
You can mention or provide IDs of one or multiple members AND/OR roles:
\`${prefixProfile.prefix}blacklist remove @member\`
\`${prefixProfile.prefix}blacklist remove member_id\`
\`${prefixProfile.prefix}blacklist remove @member1 @member2 member3_id member4_id\`
\`${prefixProfile.prefix}blacklist remove @role1 @role2 role3_id role4_id\`
\`${prefixProfile.prefix}blacklist remove @member1 member2_id @role1 role2_id\``)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
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
        if (arrWithoutRepeated2.length === 0 && args.length === 1 && args[0].length > 20) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, The argument you provided is invalid!`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(err => console.log(err));
        }
        if (args.length === 1 && arrWithoutRepeated2.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, I can't find **${message.content.substring(18)}**!`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);
        }
        if (args.length > 1 && arrWithoutRepeated2.length === 0) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${message.author.username}, no valid members or roles were provided!2`)
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
                    if (recordProfileByAuthorId.blacklist.includes(`<@${arrWithoutRepeated2[i]}>`) || recordProfileByAuthorId.blacklist.includes(`<@&${arrWithoutRepeated2[i]}>`)) {
                        permitted.push(arrWithoutRepeated2[i]);
                        if (recordProfileByAuthorId.blacklist.includes(`<@&${arrWithoutRepeated2[i]}>`)) {
                            await profileModel.findOneAndUpdate(
                                { memberId: message.author.id, },
                                { $pull: { blacklist: `<@&${arrWithoutRepeated2[i]}>` } }
                            ).catch(console.error);
                        } else if (recordProfileByAuthorId.blacklist.includes(`<@${arrWithoutRepeated2[i]}>`)) {
                            await profileModel.findOneAndUpdate(
                                { memberId: message.author.id, },
                                { $pull: { blacklist: `<@${arrWithoutRepeated2[i]}>` } }
                            ).catch(console.error);
                        }
                        const msgEmbed = new MessageEmbed()
                            .setColor('#5865F2')
                            .setTitle(`<a:740852243812581446:934406830891876412> Processing... ${i + 1}/${arrWithoutRepeated2.length}`)
                        botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }


                    if (authorVC && dataProfileByChannelId) {
                        if (authorVC.id === dataProfileByChannelId.channelId && message.author.id === dataProfileByChannelId.memberId) {
                            let thisOne = arrWithoutRepeated2[i].replace(/[\\<>@#&!]/g, "");
                            const roleById = message.guild.roles.cache.find(r => r.id === thisOne);
                            const user = client.users.cache.find(user => user.id === thisOne);
                            if (roleById) {
                                await authorVC.permissionOverwrites.edit(roleById, { VIEW_CHANNEL: null, CONNECT: null })
                                    .catch(console.error);
                            }
                            if (user) {
                                await authorVC.permissionOverwrites.edit(user, { VIEW_CHANNEL: null, CONNECT: null })
                                    .catch(console.error);
                            }
                        }
                    }


                    if (i === arrWithoutRepeated2.length - 1 && permitted.length !== 0) {
                        for (let i = 0; i < permitted.length; i++) {
                            const roleById = message.guild.roles.cache.find(r => r.id === permitted[i]);
                            const user = client.users.cache.find(user => user.id === permitted[i]);
                            if (roleById) {
                                permitted[i] = `<@&${permitted[i]}>`;
                            }
                            if (user) {
                                permitted[i] = `<@${permitted[i]}>`;
                            }
                        }
                        const msgEmbed = new MessageEmbed()
                            .setColor('#00ff00')
                            .setTitle(`${message.author.username}, you have successfully removed from your blacklist:`)
                            .setDescription(`${permitted.join(" | ")}`)
                            .setFooter(`To view your blacklist you can type ${prefixProfile.prefix}blacklist show`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }


                    if (permitted.length === 0 && i === arrWithoutRepeated2.length - 1) {
                        for (let i = 0; i < arrWithoutRepeated2.length; i++) {
                            const roleById = message.guild.roles.cache.find(r => r.id === arrWithoutRepeated2[i]);
                            const user = client.users.cache.find(user => user.id === arrWithoutRepeated2[i]);
                            if (roleById) {
                                arrWithoutRepeated2[i] = `<@&${arrWithoutRepeated2[i]}>`;
                            }
                            if (user) {
                                arrWithoutRepeated2[i] = `<@${arrWithoutRepeated2[i]}>`;
                            }
                        }
                        const msgEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setTitle(`Not found in your blacklist:`)
                            .setDescription(`${arrWithoutRepeated2.join(" | ")}`)
                            .setFooter(`To view your blacklist you can type: ${prefixProfile.prefix}blacklist show`)
                        return botMessage.edit({ embeds: [msgEmbed] })
                            .catch(console.error);
                    }
                }


            })
            .catch(console.error);

    }
}
