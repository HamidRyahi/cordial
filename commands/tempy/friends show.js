const { MessageEmbed } = require('discord.js');
const { showSender } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'friends show',
    // cooldown: 60,
    description: 'This command is for showing the friends list',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        if (authorProfile) {
            let permitted = [];
            if (authorProfile.closeList.length === 0) {
                const msgEmbed = new MessageEmbed()
                    .setColor('#808080')
                    .setTitle(`${message.author.username}, your friends list is empty!`)
                return message.reply({ embeds: [msgEmbed] })
                    .catch(console.error);
            }
            let kolchi = authorProfile.closeList;
            const msgEmbed = new MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`<a:740852243812581446:934406830891876412> Loading...`)
            message.reply({ embeds: [msgEmbed] })
                .then(async botMessage => {
                    for (let i = 0; i < authorProfile.closeList.length; i++) {
                        for (let i = 0; i < kolchi.length; i++) {
                            kolchi[i] = kolchi[i].replace(/[\\<>@#&!]/g, "");
                        }
                        const roleById = message.guild.roles.cache.find(r => r.id === kolchi[i]);
                        const user = client.users.cache.find(user => user.id === kolchi[i]);
                        if (roleById) {
                            permitted.unshift(`<@&${kolchi[i]}>`);
                            showSender(kolchi, permitted, message, 'friends ', botMessage, i);
                        } else if (user) {
                            permitted.unshift(`<@${kolchi[i]}>`);
                            showSender(kolchi, permitted, message, 'friends ', botMessage, i);
                        } else if (!roleById && !user) {
                            permitted.push(`${kolchi[i]}*`);
                            showSender(kolchi, permitted, message, 'friends ', botMessage, i);
                        }
                    }
                })
                .catch(console.error);
        }
    }
}