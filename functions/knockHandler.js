const { MessageEmbed } = require('discord.js');
const tempVcProfileModel = require('../database/models/tempSchema.js');

const knockHandler = async (theChannel, serverProfile, authorVC, message, authorId) => {
    if (theChannel.parentId === serverProfile.categoryID) {

        let tempProfileByChannelId;
        try {
            tempProfileByChannelId = await tempVcProfileModel.findOne({ channelId: theChannel.id });
        } catch (err) { console.log(err); }

        if (authorVC) {
            if (authorVC.id === theChannel.id) {
                const msgEmbed = new MessageEmbed()
                    .setColor('#ffff00')
                    .setDescription(`**Reminder:** ${message.author.username}, you are already connected to <#${authorVC.id}>!`)
                return message.reply({ embeds: [msgEmbed] })
                    .catch(err => console.log(err));
            }
        }

        const isKnockerHasPerm = theChannel.permissionsFor(message.member).has('CONNECT', true);
        if (isKnockerHasPerm) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ffff00')
                .setDescription(`**Reminder:** ${message.author.username}, you already have access to <#${theChannel.id}>!`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(err => console.log(err));

        } else {
            const time = 120000;
            const msgEmbed = new MessageEmbed()
                .setColor('#ffff00')
                .setDescription(`<@${authorId}> **would like to have access your VC.**
You have two minutes to react with \`✅\`(Yes) or \`❌\`(No)`)
            message.reply({ embeds: [msgEmbed] })
                .then(function (m) {
                    m.edit(`<@${tempProfileByChannelId.memberId}>`)
                        .catch(console.error);
                    m.react("✅")
                        .catch(console.error);
                    m.react("❌")
                        .catch(console.error);
                    const filter = (reaction, user) => (reaction.emoji.name === '✅'
                        || reaction.emoji.name === '❌')
                        && user.id === tempProfileByChannelId.memberId;
                    const collector = m.createReactionCollector({ filter, time: time });
                    collector.on('collect', async (r, u) => {
                        if (r.emoji.name === '✅') {
                            theChannel.permissionOverwrites.edit(message.member, { CONNECT: true })
                                .catch(err => console.log('err0', err));
                            const msgEmbed = new MessageEmbed()
                                .setColor('#00ff00')
                                .setDescription(`<@${message.author.id}>, your request to join <#${theChannel.id}> has been approved!`)
                            return m.edit({ embeds: [msgEmbed] })
                                .catch(console.error);
                        } else if (r.emoji.name === '❌') {
                            collector.stop()
                            setTimeout(() => {
                                m.delete()
                                    .catch(console.error);

                            }, 500)
                            const msgEmbed = new MessageEmbed()
                                .setColor('#5865F2')
                                .setDescription(`${message.author.username}, the channel's owner rejected your request! 🙄`)
                            return message.reply({ embeds: [msgEmbed] })
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
                                .setDescription(`Reason: <@${tempProfileByChannelId.memberId}> haven't reacted in time!`)
                            message.reply({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    })
                })
                .catch(console.error);
        }
    }
}

module.exports = {
    knockHandler: knockHandler
};