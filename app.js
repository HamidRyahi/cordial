const Discord = require("discord.js");
const prefixModel = require('./database/models/prefixSchema.js');
const serverModel = require('./database/models/serverSchema.js');
const { Client, Intents, Collection } = require("discord.js");
const { MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS] });
require("dotenv").config();
const fs = require('fs');
const mongoose = require('./database/mongoose');
const config = require("./config.json");
client.config = config;
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

client.on("guildCreate", async guild => {
    let oldPrefixProfile;
    try {
        oldPrefixProfile = await prefixModel.findOne({ serverID: guild.id });
    } catch (err) { console.log(err); }
    if (oldPrefixProfile) {
        await prefixModel.findOneAndUpdate(
            { serverID: guild.id },
            {
                serverName: guild.name,
                prefix: '.v'
            }
        ).catch((err) => { console.log(err) });
    } else {
        let newPrefixProfile = await prefixModel.create({
            serverID: guild.id,
            serverName: guild.name,
            prefix: '.v',
        }).catch((err) => { console.log(err) });
        newPrefixProfile.save().catch((err) => { console.log(err) });
    }

    let oldServerProfile;
    try {
        oldServerProfile = await serverModel.findOne({ serverID: guild.id });
    } catch (err) { console.log(err); }
    if (oldServerProfile) {
        await serverModel.findOneAndUpdate(
            { serverID: guild.id },
            {
                serverName: guild.name,
                owner: guild.ownerId,
                members: guild.memberCount,
                updates: guild.systemChannelId
            }
        ).catch((err) => { console.log(err) });
    } else {
        let newServerProfile = await serverModel.create({
            serverID: guild.id,
            serverName: guild.name,
            owner: guild.ownerId,
            members: guild.memberCount,
            updates: guild.systemChannelId,
        }).catch((err) => { console.log(err) });
        newServerProfile.save().catch((err) => { console.log(err) });
    }
    let serverProfile;
    try {
        serverProfile = await serverModel.findOne({ serverID: guild.id });
    } catch (err) { console.log(err); }
    const updatesChannel = guild.channels.cache.get(serverProfile.updates);
    if (updatesChannel) {
        const msgEmbed = new MessageEmbed()
            .setColor('#5865F2')
            .setDescription(`**Thank you <@${serverProfile.owner}> for inviting Cordial to ${serverProfile.serverName}!**

My default prefix is \`.v\`
> You can change it with \`.vprefix new_prefix\`

> You can start using Cordial by typing \`.vsetup\`!

>for help please type \`.vhelp\``)
            .setThumbnail('https://cdn.discordapp.com/avatars/922678523196489778/f37a49c9da5eddcccf87a4a531741e95.png')
            .setFooter({ text: 'Bot developed by Harry420#6911', iconURL: 'https://cdn.discordapp.com/avatars/922678523196489778/f37a49c9da5eddcccf87a4a531741e95.png' });
        updatesChannel.send({ embeds: [msgEmbed] })
            .catch(err => console.log(err));
        // updatesChannel.send(`Thank you <@${serverProfile.owner}> for inviting Cordial to your server for more help please type \`.vhelp\``)
    }
});

mongoose.init();
client.login(process.env.TOKEN);