const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'delete',
    description: 'This command is for deteting an existing setup',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        const category = message.guild.channels.cache.get(serverProfile.categoryID);
        // check if message author doesn't have ADMINISTRATOR perm
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`You do not have sufficient permissions to use that command.`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);

        }
        if (category) {
            const time = 30000;
            const oneTap = message.guild.channels.cache.get(serverProfile.channelId);
            const cmdChannel = message.guild.channels.cache.get(serverProfile.cmdId);
            const helpChannel = message.guild.channels.cache.get(serverProfile.helpId);
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${message.author.username} <a:873012688077340672:934934933540073472> Are your sure you want to delete the setup?`)
                .setDescription(`You have 30 seconds to react with \`✅\`(Yes) or \`❌\`(No)`)
            message.reply({ embeds: [msgEmbed] })
                .then(function (m) {
                    m.react("✅")
                        .catch(console.error);
                    m.react("❌")
                        .catch(console.error);
                    const filter = (reaction, user) => (reaction.emoji.name === '✅'
                        || reaction.emoji.name === '❌')
                        && user.id === message.author.id;
                    const collector = m.createReactionCollector({ filter, time: time });
                    collector.on('collect', async (r, u) => {
                        if (r.emoji.name === '✅') {
                            if (oneTap && oneTap.parentId === category.id) {
                                oneTap.delete()
                                    .catch(console.error);
                            }
                            if (cmdChannel && cmdChannel.parentId === category.id) {
                                cmdChannel.delete()
                                    .catch(console.error);
                            }
                            if (helpChannel && helpChannel.parentId === category.id) {
                                helpChannel.delete()
                                    .catch(console.error);
                            }
                            category.delete()
                                .catch(console.error);
                            const msgEmbed = new MessageEmbed()
                                .setColor('#00ff00')
                                .setTitle(`${message.author.username}, you have successfully deleted the setup!`)
                            return m.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        } else if (r.emoji.name === '❌') {
                            collector.stop()
                            const msgEmbed = new MessageEmbed()
                                .setColor('#5865F2')
                                .setTitle(`${message.author.username}, you have canceled this operation.`)
                            m.edit(`<@${message.author.id}>`)
                                .catch(console.error);
                            return m.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    });
                    collector.on('end', collected => {
                        console.log(`Collected ${collected.size} items`);
                        if (collected.size === 0) {
                            m.delete()
                                .catch(error => console.error(':', error));
                            const msgEmbed = new MessageEmbed()
                                .setColor('#5865F2')
                                .setTitle(`${message.author.username}, Operation cancelled.`)
                                .setDescription(`Reason: You haven't reacted in time!`)
                            message.reply({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    })
                })
                .catch(console.error);


        } else {
            noValidSetup(message, serverProfile.prefix);
        }
    }
}