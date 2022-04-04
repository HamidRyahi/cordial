const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'blacklist',
    description: 'This commands is for showing the correct usage of the blacklist command',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const msgEmbed = new MessageEmbed()
            .setColor('#ffff00')
            .setTitle(`Correct usage:`)
            .setDescription(`
\`${prefixProfile.prefix}blacklist add\`
\`${prefixProfile.prefix}blacklist remove\`
\`${prefixProfile.prefix}blacklist show\`
\`${prefixProfile.prefix}blacklist clear\``)
            .setFooter(`For more help please type ${prefixProfile.prefix}help`)
        return message.reply({ embeds: [msgEmbed] })
            .catch(console.error);
    }
}