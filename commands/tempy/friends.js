const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'friends',
    description: 'This commands is for showing the correct usage of the friends command',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        const msgEmbed = new MessageEmbed()
            .setColor('#ffff00')
            .setTitle(`Correct usage:`)
            .setDescription(`
\`${serverProfile.prefix}friends add\`
\`${serverProfile.prefix}friends remove\`
\`${serverProfile.prefix}friends show\`
\`${serverProfile.prefix}friends clear\``)
            .setFooter(`For more help please type ${serverProfile.prefix}help`)
        return message.reply({ embeds: [msgEmbed] })
            .catch(console.error);
    }
}