const { MessageEmbed } = require('discord.js');



const noSufficientPerms = (message) => {
    const msgEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`You do not have sufficient permissions to use this command.`)
    return message.reply({ embeds: [msgEmbed] })
        .catch(console.error);
}



const notInTempVc = (authorVC, authorTempVC, serverProfile, message) => {
    const msgEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`${message.author.username}, you are not in a temporary voice channel.`)
        .setDescription(`To create one, please join <#${serverProfile.channelId}>`)
    if (!authorVC || !authorTempVC) {
        return message.reply({ embeds: [msgEmbed] })
            .catch(err => console.log(err));
    } else if (authorVC && authorTempVC) {
        if (authorVC.id !== authorTempVC.channelId) {
            return message.reply({ embeds: [msgEmbed] })
                .catch(err => console.log(err));
        }
    }
}



const noOwnerCurrently = (authorTempVC, serverProfile, authorVC, message, authorId) => {
    const msgEmbed = new MessageEmbed()
        .setColor('#00ffff')
        .setDescription(`<#${authorVC.id}> **has no owner currently.**
You can claim this channel by typing \`${serverProfile.prefix}claim\` in the chat!`)
    return message.reply({ embeds: [msgEmbed] })
        .catch(err => console.log(err));
}



const notTheOwner = (message, authorVC, serverProfile) => {
    const msgEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`**${message.author.username}, you are not the owner of <#${authorVC.id}> channel.**

To create yours, please join <#${serverProfile.channelId}>!`)
    return message.reply({ embeds: [msgEmbed] })
        .catch(err => console.log(err));
}



const noValidSetup = (message, prefix) => {
    const msgEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`No valid setup was found on this server.`)
        .setDescription(`If you have sufficient permissions you can set the bot up by typing \`${prefix}setup\``)
    return message.reply({ embeds: [msgEmbed] })
        .catch(err => console.log(err));
}



const showSender = (kolchi, permitted, message, type, botMessage, i) => {
    if (i === kolchi.length - 1) {
        let total;
        let descFooter;
        let footer;
        if (permitted.length === 1) {
            total = "1 item";
        } else if (permitted.length > 1) {
            total = "a total of " + kolchi.length + " items";
        }
        if (permitted[permitted.length - 1].endsWith('*')) {
            descFooter = '\n*not present in this server';
        } else {
            descFooter = '';
        }
        if (type === 'black') {
            color = '#000000'
            footer = "Note: Members with blacklisted roles can't join your temporary voice channels.";
        } else {
            color = 'ffffff'
            footer = '';
        }
        const msgEmbed = new MessageEmbed()
            .setColor(`${color}`)
            .setTitle(`${message.author.username}, you have ${total} in your ${type}list:`)
            .setDescription(`${permitted.join(' | ')}
${descFooter}`)
            .setFooter(`${footer}`)
        return botMessage.edit({ embeds: [msgEmbed] })
    }
}




module.exports = {
    notInTempVc: notInTempVc,
    noOwnerCurrently: noOwnerCurrently,
    noValidSetup: noValidSetup,
    showSender: showSender,
    notTheOwner: notTheOwner,
    noSufficientPerms: noSufficientPerms
};