const profileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'blacklist clear',
    description: 'This command is for clearing the blacklist',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        if (recordProfileByAuthorId) {
            const time = 30000;
            if (recordProfileByAuthorId.blacklist.length === 0) {
                const msgEmbed = new MessageEmbed()
                    .setColor('#808080')
                    .setTitle(`${message.author.username}, your blacklist is already empty.`)
                return message.reply({ embeds: [msgEmbed] })
                    .catch(console.error);
            }
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${message.author.username} <a:873012688077340672:934934933540073472> Are your sure you want to clear your blacklist?`)
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
                            await profileModel.findOneAndUpdate(
                                { memberId: message.author.id, },
                                { blacklist: [] }
                            ).catch(console.error);
                            const msgEmbed = new MessageEmbed()
                                .setColor('#00ff00')
                                .setTitle(`${message.author.username}, you have successfully cleared your blacklist!`)
                            m.edit(`<@${message.author.id}>`)
                                .catch(console.error);
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
                                .setDescription(`Reason: You hasn't reacted in time!`)
                            message.reply({ embeds: [msgEmbed] })
                                .catch(console.error);
                        }
                    })
                })
                .catch(console.error);
        }
    }
}