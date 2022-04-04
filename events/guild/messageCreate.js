const profileModel = require('../../database/models/userSchema.js');
const profileModel2 = require('../../database/models/tempSchema.js');
const prefixModel = require('../../database/models/prefixSchema.js');
const serverModel = require('../../database/models/serverSchema.js');
const { MessageEmbed } = require('discord.js');


const cooldowns = new Map();

module.exports = async (client, Discord, message) => {
    //
    let prefixProfile;
    try {
        prefixProfile = await prefixModel.findOne({ serverID: message.guild.id })
    } catch (err) { console.log(err); }
    //
    let prefix;
    if (prefixProfile) {
        prefix = prefixProfile.prefix;
    } else {
        prefix = '.v';
    }
    //
    if (message.content.startsWith('.v') && !prefixProfile) {
        let prefixProfile = await prefixModel.create({
            serverID: message.guild.id,
            serverName: message.guild.name,
            prefix: '.v'
        }).catch((err) => { console.log(err); });
        prefixProfile.save().catch(console.error);
    }
    //
    try {
        prefixProfile = await prefixModel.findOne({ serverID: message.guild.id });
    } catch (err) { console.log(err); }
    //
    if (message.content === '<@!922678523196489778>' || message.content === '<@922678523196489778>') {
        const msgEmbed = new MessageEmbed()
            .setColor('#5865F2')
            .setTitle(`My prefix in this server is **\`${prefix}\`**`)
            .setDescription(`For more help please type \`${prefix}help\``)
        return message.reply({ embeds: [msgEmbed] })
            .catch(console.error);
    }
    //
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const authorVC = message.member.voice.channel;
    let dataProfileByChannelId;
    //
    if (authorVC) {
        try {
            dataProfileByChannelId = await profileModel2.findOne({ channelId: authorVC.id });
        } catch (err) { console.log(err); }
    }
    //
    const authorId = message.author.id;
    let serverProfileByAuthorId;
    try {
        serverProfileByAuthorId = await serverModel.findOne({ serverID: message.guild.id });
    } catch (err) { console.log(err); }
    //
    if (!serverProfileByAuthorId) {
        let newServerProfile = await serverModel.create({
            serverID: message.guild.id,
            serverName: message.guild.name,
            owner: message.guild.ownerId,
            members: message.guild.memberCount,
            updates: message.guild.publicUpdatesChannelId,
        }).catch((err) => { console.log(err) });
        newServerProfile.save().catch((err) => { console.log(err) });
        try {
            serverProfileByAuthorId = await serverModel.findOne({ serverID: message.guild.id });
        } catch (err) { console.log(err); }
    }
    //
    let recordProfileByAuthorId;
    try {
        recordProfileByAuthorId = await profileModel.findOne({ memberId: message.author.id });
    } catch (err) { console.log(err); }
    //
    if (!recordProfileByAuthorId) {
        let recordProfileByAuthorId = await profileModel.create({
            memberId: authorId,
            blacklist: [],
            closeList: [],
            name: `${message.author.username}'s VC`
        }).catch(console.error);
        recordProfileByAuthorId.save()
            .catch(console.error);
    }
    //
    try {
        recordProfileByAuthorId = await profileModel.findOne({ memberId: message.author.id });
    } catch (err) { console.log(err); }
    //
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    //
    if (cmd === 'rename' && args.length === 0) {
        const msgEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`${message.author.username}, you didn't provide any arguments!`)
            .setDescription(`__correct usage:__
                \`${prefixProfile.prefix}rename new name\``)
        return message.reply({ embeds: [msgEmbed] })
            .catch(err => console.log(err));
    }
    //
    let valid = ['add', 'remove', 'show', 'clear'];
    if ((cmd === "blacklist" || cmd === "bl") && args.length !== 0) {
        if (valid.includes(args[0].toLowerCase())) {
            cmd = cmd + ' ' + args.shift().toLowerCase();
        }
    }
    //
    let valid2 = ['add', 'remove', 'show', 'clear', 'permit'];
    if ((cmd === "friends" || cmd === "favorites" || cmd === "favs") && args.length !== 0) {
        if (valid2.includes(args[0].toLowerCase())) {
            cmd = cmd + ' ' + args.shift().toLowerCase();
        }
    }
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (!command) return;
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if (time_stamps.has(message.author.id)) {
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

        if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;
            return message.reply(`Please wait ${time_left.toFixed(0)} more seconds before using ${command.name}`)
        }
    }


    time_stamps.set(message.author.id, current_time);

    if (command) command.execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId);
}