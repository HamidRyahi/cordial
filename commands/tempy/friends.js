const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'friends',
    description: 'This commands is for showing the correct usage of the friends command',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        const msgEmbed = new MessageEmbed()
            .setColor('#ffff00')
            .setTitle(`Correct usage:`)
            .setDescription(`
\`${prefixProfile.prefix}friends add\`
\`${prefixProfile.prefix}friends remove\`
\`${prefixProfile.prefix}friends show\`
\`${prefixProfile.prefix}friends clear\``)
            .setFooter(`For more help please type ${prefixProfile.prefix}help`)
        return message.reply({ embeds: [msgEmbed] })
            .catch(console.error);
    }
}