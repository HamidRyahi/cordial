const tempVcProfileModel = require('../../database/models/tempSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'help',
    description: 'This command is for making temp voice channels unvisible',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        const msgEmbed = new MessageEmbed()
            .setColor('#5865F2')
            .setTitle('Click here to invite Cordial to your server!')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=922678523196489778&permissions=285494352&scope=bot')
            .setDescription(`**Cordial commands:**`)
            .setThumbnail('https://cdn.discordapp.com/avatars/922678523196489778/f37a49c9da5eddcccf87a4a531741e95.png')
            .addFields(
                { name: `> \`${serverProfile.prefix}setup\``, value: `↳ To set the bot up for the first time.`, inline: false },
                { name: `> \`${serverProfile.prefix}delete\``, value: `↳ To delete an existing setup on your server.`, inline: false },
                { name: `> \`${serverProfile.prefix}prefix\``, value: `↳ To get or change the bot's prefix for your server.`, inline: false },
                { name: `> \`${serverProfile.prefix}lock\``, value: `↳ To lock your temp VC.`, inline: false },
                { name: `> \`${serverProfile.prefix}unlock\``, value: `↳ To unlock your temp VC.`, inline: false },
                { name: `> \`${serverProfile.prefix}hide\``, value: `↳ To make your temp VC invisible to other members and roles.`, inline: false },
                { name: `> \`${serverProfile.prefix}show\``, value: `↳ To make your temp VC visible to all members and roles.`, inline: false },
                { name: `> \`${serverProfile.prefix}rename\``, value: `↳ To change the name of your temp VC.`, inline: false },
                { name: `> \`${serverProfile.prefix}limit\``, value: `↳ To change the limit of users who can join your temp VC.`, inline: false },
                { name: `> \`${serverProfile.prefix}owner\``, value: `↳ To get the owner of a temp VC you are connected to.`, inline: false },
                { name: `> \`${serverProfile.prefix}claim\``, value: `↳ To claim a temp VC your are connected to if the previous owner is not connected.`, inline: false },
                { name: `> \`${serverProfile.prefix}transfer\``, value: `↳ To transfer the ownership of your temp VC to another member.`, inline: false },
                { name: `> \`${serverProfile.prefix}reject\``, value: `↳ To reject a member or role from having access to your temp VC.`, inline: false },
                { name: `> \`${serverProfile.prefix}permit\``, value: `↳ To permit a member or role to have access to your temp VC.`, inline: false },
                { name: `> \`${serverProfile.prefix}knock\``, value: `↳ To ask for connect permission from an owner of a locked temp VC.`, inline: false },
                { name: `> \`${serverProfile.prefix}kick\``, value: `↳ To disconnect a member or members with a specific role from your temp VC.`, inline: false },
                { name: `> \`${serverProfile.prefix}friends add\``, value: `↳ To add a member or role to your friends list.`, inline: false },
                { name: `> \`${serverProfile.prefix}friends remove\``, value: `↳ To remove a member or role from your friends list.`, inline: false },
                { name: `> \`${serverProfile.prefix}friends show\``, value: `↳ To view your friends list.`, inline: false },
                { name: `> \`${serverProfile.prefix}friends clear\``, value: `↳ To clear your friends list.`, inline: false },
                { name: `> \`${serverProfile.prefix}friends permit\``, value: `↳ To permit all your friends list to have access to your temp VC at once.`, inline: false },
                { name: `> \`${serverProfile.prefix}blacklist add\``, value: `↳ To add a member or role to your blacklist.`, inline: false },
                { name: `> \`${serverProfile.prefix}blacklist remove\``, value: `↳ To remove a member or role from your blacklist.`, inline: false },
                { name: `> \`${serverProfile.prefix}blacklist show\``, value: `↳ To view your blacklist.`, inline: false },
                { name: `> \`${serverProfile.prefix}blacklist clear\``, value: `↳ To clear your blacklist.`, inline: false })
            .setFooter({ text: 'Bot developed by Harry420#6911', iconURL: 'https://cdn.discordapp.com/avatars/922678523196489778/f37a49c9da5eddcccf87a4a531741e95.png' });
        return message.reply({ embeds: [msgEmbed] })
            .catch(err => console.log(err));
    }
}