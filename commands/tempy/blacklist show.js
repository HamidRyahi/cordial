const profileModel = require('../../database/models/userSchema.js');
const { MessageEmbed } = require('discord.js');
const { showSender } = require("../../functions/msgFunctions.js");
module.exports = {
    name: 'blacklist show',
    aliases: ["bl show"],

    // cooldown: 10,
    description: 'This command is for showing the blacklist list',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        if (recordProfileByAuthorId) {
            let permitted = [];
            if (recordProfileByAuthorId.blacklist.length === 0) {
                const msgEmbed = new MessageEmbed()
                    .setColor('#808080')
                    .setTitle(`${message.author.username}, your blacklist is empty!`)
                return message.reply({ embeds: [msgEmbed] })
                    .catch(console.error);
            }
            let kolchi = recordProfileByAuthorId.blacklist;
            const msgEmbed = new MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`<a:740852243812581446:934406830891876412> Loading...`)
            message.reply({ embeds: [msgEmbed] })
                .then(async botMessage => {
                    for (let i = 0; i < recordProfileByAuthorId.blacklist.length; i++) {
                        for (let i = 0; i < kolchi.length; i++) {
                            kolchi[i] = kolchi[i].replace(/[\\<>@#&!]/g, "");
                        }
                        const roleById = message.guild.roles.cache.find(r => r.id === kolchi[i]);
                        const user = client.users.cache.find(user => user.id === kolchi[i]);
                        if (roleById) {
                            permitted.unshift(`<@&${kolchi[i]}> (role)`);
                            showSender(kolchi, permitted, message, 'black', botMessage, i);
                        } else if (user) {
                            permitted.unshift(`<@${kolchi[i]}>`);
                            showSender(kolchi, permitted, message, 'black', botMessage, i);
                        } else if (!roleById && !user) {
                            permitted.push(`${kolchi[i]}*`);
                            showSender(kolchi, permitted, message, 'black', botMessage, i);
                        }
                    }
                })
                .catch(console.error);
        }
    }
}