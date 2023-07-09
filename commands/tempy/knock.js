const { MessageEmbed } = require('discord.js');
const tempVcProfileModel = require('../../database/models/tempSchema.js');
const { knockHandler } = require("../../functions/knockHandler.js");
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'knock',
    description: 'This command is for knocking a temp vc',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        const oneTap = message.guild.channels.cache.get(serverProfile.channelId);
        if (oneTap) {
            if (oneTap.parentId === serverProfile.categoryID) {
                const authorVC = message.member.voice.channel;
                const authorId = message.author.id;
                if (args.length === 0) {
                    const msgEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle(`${message.author.username}, you didn't provide any arguments.`)
                        .setDescription(`__correct usage:__
You can knock a temp VC by providing it's name or ID or mentioning a random connected member to that VC:
\`${serverProfile.prefix}knock codenames\` or : \`${serverProfile.prefix}knock 420699116664201337\`
**or :**
\`${serverProfile.prefix}knock @Random_Connected_Member\``)
                    return message.reply({ embeds: [msgEmbed] })
                        .catch(err => console.log(err));
                }
                const channels = client.channels.cache.filter(
                    c => c.name.replace(/\s/g, '').toLowerCase().includes(args.join('').toLowerCase())
                        && c.parentId === serverProfile.categoryID
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
                const channelByName = client.channels.cache.find(channel => channel.name.replace(/\s/g, '').toLowerCase().includes(args.join('').toLowerCase()) && channel.parentId === serverProfile.categoryID);
                const channelById = client.channels.cache.get(args[0]);
                if (channelByName) {
                    knockHandler(channelByName, serverProfile, authorVC, message, authorId);
                }
                if (channelById) {
                    knockHandler(channelById, serverProfile, authorVC, message, authorId);
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
                                if (member.voice.channel.parentId !== serverProfile.categoryID) {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#ff0000')
                                        .setDescription(`${message.author.username}, this user is not connected to a temp voice channel!`)
                                    return message.reply({ embeds: [msgEmbed] })
                                        .catch(err => console.log(err));
                                } else if (member.voice.channel.parentId === serverProfile.categoryID) {
                                    knockHandler(member.voice.channel, serverProfile, authorVC, message, authorId);
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
                } else if ((/^[0-9]{18}$/g.test(newArg) || /^[0-9]{19}$/g.test(newArg)) && !userId && !channelById) {
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
                noValidSetup(message, serverProfile.prefix);
            }
        } else {
            noValidSetup(message, serverProfile.prefix);
        }
    }
}