const profileModel2 = require('../../database/models/tempSchema.js');
const { MessageEmbed } = require('discord.js');
const { notInTempVc, noOwnerCurrently, noValidSetup, notTheOwner } = require("../../functions/msgFunctions.js");
const { joinVoiceChannel } = require('@discordjs/voice');


module.exports = {
    name: 'join',
    description: 'This command is for making temp voice channels unvisible',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        if (message.author.id === '407241585722654724') {
            const channel = message.member.voice.channel;
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
        }

    }
}