const { MessageEmbed } = require('discord.js');
const profileModel2 = require('../../database/models/tempSchema.js');
const { knockHandler } = require("../../functions/knockHandler.js");
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'knock',
    description: 'This command is for knocking a temp vc',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const oneTap = message.guild.channels.cache.get(serverProfileByAuthorId.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfileByAuthorId.categoryID) {
                const authorVC = message.member.voice.channel;
                const authorId = message.author.id;
                if (args.length === 0) {
                    const msgEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle(`${message.author.username}, you didn't provide any arguments.`)
                        .setDescription(`__correct usage:__
You can knock a temp VC by providing it's name or ID or mentioning a random connected member to that VC:
\`${prefixProfile.prefix}knock codenames\` or : \`${prefixProfile.prefix}knock 420699116664201337\`
**or :**
\`${prefixProfile.prefix}knock @Random_Connected_Member\``)
                    return message.reply({ embeds: [msgEmbed] })
                        .catch(err => console.log(err));
                }
                const channels = client.channels.cache.filter(
                    c => c.name.replace(/\s/g, '').toLowerCase().includes(args.join('').toLowerCase())
                        && c.parentId === serverProfileByAuthorId.categoryID
                );
                if (channels.size > 1) {
                    let channelIDs = [];
                    channels.forEach(c => channelIDs.push(`\`${c.name}\`: ${c.id}`));
                    const msgEmbed = new MessageEmbed()
                        .setColor('#ffff00')
                        .setTitle(`${message.author.username}, I found multiple temp voice channels with that name:`)
                        .setDescription(`${channelIDs.join('\n')}`)
                        .setFooter('Please be more specific, or provide the ID of the channel!')
                    return message.reply({ embeds: [msgEmbed] })
                        .catch(err => console.log(err));
                }
                const channelByName = client.channels.cache.find(channel => channel.name.replace(/\s/g, '').toLowerCase().includes(args.join('').toLowerCase()) && channel.parentId === serverProfileByAuthorId.categoryID);
                const channelById = client.channels.cache.get(args[0]);
                if (channelByName) {
                    knockHandler(channelByName, serverProfileByAuthorId, authorVC, message, authorId);
                }
                if (channelById) {
                    knockHandler(channelById, serverProfileByAuthorId, authorVC, message, authorId);
                }
                let newArg;
                if (args.length !== 0)
                    newArg = args[0].replace(/[\\<>@#&!]/g, "");
                if (newArg === message.author.id) {
                    return message.reply(`<a:Corfused:935269742778912829>`)
                        .catch(err => console.log(err));
                }
                const userId = client.users.cache.get(newArg);
                if (userId) {
                    const memberId = message.guild.members.fetch(newArg)
                        .then(async member => {
                            if (member.voice.channel) {
                                if (member.voice.channel.parentId !== serverProfileByAuthorId.categoryID) {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#ff0000')
                                        .setDescription(`${message.author.username}, this user is not connected to a temp voice channel!`)
                                    return message.reply({ embeds: [msgEmbed] })
                                        .catch(err => console.log(err));
                                } else if (member.voice.channel.parentId === serverProfileByAuthorId.categoryID) {
                                    knockHandler(member.voice.channel, serverProfileByAuthorId, authorVC, message, authorId);
                                }
                            } else {
                                const msgEmbed = new MessageEmbed()
                                    .setColor('#ff0000')
                                    .setDescription(`${message.author.username}, this user is not connected to a temp voice channel!`)
                                return message.reply({ embeds: [msgEmbed] })
                                    .catch(err => console.log(err));
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else if (/^[0-9]{18}$/g.test(newArg) && !userId && !channelById) {
                    const msgEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription(`${message.author.username}, I can't find **${args[0]}**`)
                    return message.reply({ embeds: [msgEmbed] })
                        .catch(err => console.log(err));
                }
                if (!userId && !channelById && !channelByName) {
                    const msgEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription(`${message.author.username}, no temp voice channel was found!`)
                    return message.reply({ embeds: [msgEmbed] })
                        .catch(err => console.log(err));
                }
            } else {
                noValidSetup(message, prefixProfile);
            }
        } else {
            noValidSetup(message, prefixProfile);
        }
    }
}