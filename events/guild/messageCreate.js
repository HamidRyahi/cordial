const userProfileModel = require('../../database/models/userSchema.js');
const tempVcProfileModel = require('../../database/models/tempSchema.js');
const serversProfilesModel = require('../../database/models/servers_schema.js');
const { MessageEmbed } = require('discord.js');

const cooldowns = new Map();

module.exports = async (client, Discord, message) => {

    // get server profile from db
    let serverProfile;
    try {
        serverProfile = await serversProfilesModel.findOne({ serverID: message.guild.id })
    } catch (err) { console.log(err); }

    // set profile prefix
    let prefix;
    if (serverProfile) {
        prefix = serverProfile.prefix;
    } else {
        prefix = '.v';
    }

    // if server profile didn't found in db and user typed a valid command
    if (message.content.startsWith('.v') && !serverProfile) {
        let serverProfile = await serversProfilesModel.create({
            serverID: message.guild.id,
            serverName: message.guild.name,
            prefix: '.v',
            owner: message.guild.ownerId,
            members: message.guild.memberCount,
            updates: message.guild.systemChannelId,
            preferredLocale: message.guild.preferredLocale
        }).catch((err) => { console.log(err); });

        // save new profile data in db
        serverProfile.save().catch(console.error);
    }

    // fetch db latest updates
    try {
        serverProfile = await serversProfilesModel.findOne({ serverID: message.guild.id });
    } catch (err) { console.log(err); }


    // if any member tagged bot reply with prefix info
    if (message.content === '<@!922678523196489778>' || message.content === '<@922678523196489778>') {
        const msgEmbed = new MessageEmbed()
            .setColor('#5865F2')
            .setTitle(`My prefix in this server is **\`${prefix}\`**`)
            .setDescription(`For more help please type \`${prefix}help\``)
        return message.reply({ embeds: [msgEmbed] })
            .catch(console.error);
    }

    // if random message or bot => return
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // set command author voice channel
    const authorVC = message.member.voice.channel;
    let authorTempVC;

    // if command author is connected to a voice channel
    if (authorVC) {
        try {
            authorTempVC = await tempVcProfileModel.findOne({ channelId: authorVC.id });
        } catch (err) { console.log(err); }
    }

    //
    let authorProfile;
    try {
        authorProfile = await userProfileModel.findOne({ memberId: message.author.id });
    } catch (err) { console.log(err); }
    //
    if (!authorProfile) {
        let authorProfile = await userProfileModel.create({
            memberId: authorId,
            blacklist: [],
            closeList: [],
            name: `${message.author.username}'s VC`
        }).catch(console.error);
        authorProfile.save()
            .catch(console.error);
    }
    try {
        authorProfile = await userProfileModel.findOne({ memberId: message.author.id });
    } catch (err) { console.log(err); }






    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if (cmd === 'rename' && args.length === 0) {
        const msgEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`${message.author.username}, you didn't provide any arguments!`)
            .setDescription(`__correct usage:__
                \`${serverProfile.prefix}rename new name\``)
        return message.reply({ embeds: [msgEmbed] })
            .catch(err => console.log(err));
    }
    let valid = ['add', 'remove', 'show', 'clear'];
    if ((cmd === "blacklist" || cmd === "bl") && args.length !== 0) {
        if (valid.includes(args[0].toLowerCase())) {
            cmd = cmd + ' ' + args.shift().toLowerCase();
        }
    }
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
    if (command) {
        const log = client.channels.cache.get('956991095210913852');
        log.send(`${message.author.username}: **${message.content}** in ${message.guild.name}`)
            .catch(console.error);
    }


    if (command) command.execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC);
}