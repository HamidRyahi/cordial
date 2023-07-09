const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'blacklist',
    description: 'This commands is for showing the correct usage of the blacklist command',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        const msgEmbed = new MessageEmbed()
            .setColor('#ffff00')
            .setTitle(`Correct usage:`)
            .setDescription(`
\`${serverProfile.prefix}blacklist add\`
\`${serverProfile.prefix}blacklist remove\`
\`${serverProfile.prefix}blacklist show\`
\`${serverProfile.prefix}blacklist clear\``)
            .setFooter(`For more help please type ${serverProfile.prefix}help`)
        return message.reply({ embeds: [msgEmbed] })
            .catch(console.error);
    }
}