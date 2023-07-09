const userProfileModel = require('../../database/models/userSchema.js');
const tempVcProfileModel = require('../../database/models/tempSchema.js');
const serversModel = require('../../database/models/servers_schema.js');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, message, args, Discord) => {
    client.once("voiceStateUpdate", async (oldVoiceState, newVoiceState) => {
        if (!oldVoiceState.streaming && newVoiceState.streaming) return;
        if (oldVoiceState.streaming && !newVoiceState.streaming) return;
        // if (!oldVoiceState.serverDeaf && newVoiceState.serverDeaf) return;
        if (oldVoiceState.serverDeaf && !newVoiceState.serverDeaf) return;
        if (!oldVoiceState.serverMute && newVoiceState.serverMute) return;
        if (oldVoiceState.serverMute && !newVoiceState.serverMute) return;
        if (!oldVoiceState.selfDeaf && newVoiceState.selfDeaf) return;
        if (oldVoiceState.selfDeaf && !newVoiceState.selfDeaf) return;
        // if (!oldVoiceState.selfMute && newVoiceState.selfMute) return;
        if (oldVoiceState.selfMute && !newVoiceState.selfMute) return;
        if (oldVoiceState.sessionID != newVoiceState.sessionID) return;
        if (!oldVoiceState.selfVideo && newVoiceState.selfVideo) return;
        if (oldVoiceState.selfVideo && !newVoiceState.selfVideo) return;
        const guild = oldVoiceState.guild;
        if (guild.id === '1019697365558505583') {
            const inVoiceRole = guild.roles.cache.find(r => r.id === "1032345813608845442")
            if (!oldVoiceState.channel && newVoiceState.channelId && inVoiceRole) {
                newVoiceState.member.roles.add(inVoiceRole);
                // console.log('joined vc')
            }
            if (oldVoiceState.channel !== null && !newVoiceState.channel && inVoiceRole) {
                newVoiceState.member.roles.remove(inVoiceRole);
                console.log('left vc')
            }
            if (oldVoiceState.channel && newVoiceState.channelId && inVoiceRole) {
                newVoiceState.member.roles.add(inVoiceRole);
                console.log('switched vc')
            }
        }
        let serverProfileByServerId;
        try {
            serverProfileByServerId = await serversModel.findOne({ serverID: guild.id });
        } catch (err) { console.log(err); }
        // console.log(serverProfileByServerId);
        if (serverProfileByServerId === null) return;
        // joined or moved to one tap creator
        if (newVoiceState.channelId === serverProfileByServerId.channelId) {
            if (newVoiceState.member.user.bot) return newVoiceState.member.voice.disconnect().catch(console.error);;
            // set default settings for new members
            let name = `${newVoiceState.member.user.username}'s VC`;
            let userLimit = 0;
            // get record of voiceStateMember
            let recordProfileByMemberId;
            try {
                recordProfileByMemberId = await userProfileModel.findOne({ memberId: newVoiceState.member.user.id, });
            } catch (err) { console.log(err); }
            // check if member already had a temp VC and get personlized settings
            if (recordProfileByMemberId) {
                name = recordProfileByMemberId.name;
                userLimit = recordProfileByMemberId.limit;
            }
            // get data of voiceStateMember
            let dataProfileByMemberId;
            try {
                dataProfileByMemberId = await tempVcProfileModel.findOne({
                    memberId: oldVoiceState.id,
                    serverID: guild.id
                });
            } catch (err) { console.log(err); }
            // check if member ditched his old temp vc
            if (dataProfileByMemberId) {
                await tempVcProfileModel.findOneAndUpdate(
                    {
                        memberId: newVoiceState.member.user.id,
                        serverID: guild.id
                    },
                    {
                        memberId: '',
                        isInChannel: false,
                        isFriendsPermit: false
                    }
                ).catch(console.error);
            }


            const category = guild.channels.cache.get(serverProfileByServerId.categoryID);

            const isEveryoneHavePerm = category.permissionsFor(guild.roles.everyone).has('VIEW_CHANNEL', true);
            console.log('isEveryoneHavePerm: ', isEveryoneHavePerm)


            // create temp vc
            guild.channels
                .create(name, {
                    type: 'GUILD_VOICE',
                    parent: serverProfileByServerId.categoryID,
                    userLimit: userLimit,
                    permissionOverwrites: [
                        {
                            id: newVoiceState.member.user.id,
                            allow: ['VIEW_CHANNEL', 'CONNECT']
                        },
                        {
                            id: '922678523196489778',
                            allow: ['VIEW_CHANNEL', 'CONNECT', 'MANAGE_CHANNELS']
                        },
                        // !isEveryoneHavePerm && {
                        //     id: guild.id,
                        //     deny: ['VIEW_CHANNEL', 'CONNECT']
                        // },

                    ],
                })
                .then(async (channel) => {
                    channel.lockPermissions()
                        .then(() => console.log('Successfully synchronized permissions with parent channel'))
                        .catch(console.error);
                    const log = client.channels.cache.get('956991095210913852');
                    log.send(`A new channel called ${name}, was created by ${newVoiceState.member.user.username}#${newVoiceState.member.user.discriminator} in ${guild.name}`)
                        .catch(console.error);
                    ////////////////
                    let newDataProfile = await tempVcProfileModel.create({
                        memberId: newVoiceState.member.user.id,
                        serverID: guild.id,
                        serverName: guild.name,
                        channelId: channel.id,
                        isInChannel: true,
                        isFriendsPermit: false
                    }).catch(console.error);
                    // add temp channel data to dataArray
                    newDataProfile.save();
                    // Move new member to his temp VC
                    newVoiceState.member.voice.setChannel(channel.id)
                        .catch(async (err) => {
                            await tempVcProfileModel.findOneAndUpdate(
                                { channelId: channel.id, },
                                { isFriendsPermit: false }
                            ).catch(console.error);
                            // if member go back delete the newely created channel
                            channel.delete()
                                .catch(console.error);
                            // remove dataArray of deleted temp vc
                            const test = await tempVcProfileModel.findOne(
                                {
                                    channelId: channel.id,
                                    serverID: guild.id
                                }
                            ).catch(console.error);
                            if (test) {
                                test.delete()
                                    .catch(console.error);
                            }
                        })

                    ////////////////////
                    if (!recordProfileByMemberId) {
                        let recordProfileByMemberId = await userProfileModel.create({
                            memberId: newVoiceState.member.user.id,
                            blacklist: [],
                            closeList: [],
                            name: name,
                            limit: 0
                        })
                            .catch(console.error);
                        // add channel settings to record array for new members
                        recordProfileByMemberId.save()
                            .catch(console.error);
                    }
                    // remove connect perm from blacklisted members
                    if (recordProfileByMemberId) {
                        for (let i = 0; i < recordProfileByMemberId.blacklist.length; i++) {
                            const targetChannelId = await newVoiceState.guild.channels.cache.get(channel.id);
                            if (!targetChannelId) {
                                break;
                            } else {
                                let thisOne = recordProfileByMemberId.blacklist[i].replace(/[\\<>@#&!]/g, "");
                                if (thisOne === '922678523196489778') continue;
                                const roleById = newVoiceState.guild.roles.cache.find(r => r.id === thisOne);
                                const user = client.users.cache.find(user => user.id === thisOne);
                                if (roleById) {
                                    await channel.permissionOverwrites.edit(roleById, { CONNECT: false })
                                        .catch(console.error);
                                }
                                if (user) {
                                    const memberId = newVoiceState.guild.members
                                        .fetch(thisOne)
                                        .then(async member => {
                                            await channel.permissionOverwrites.edit(member, { CONNECT: false })
                                                .catch(console.error);
                                        })
                                        .catch(console.error);
                                }
                            }
                        }
                    }
                })
                .catch(console.error);
        }

        // left temp voice channel
        if (oldVoiceState.channel !== null) {
            if (oldVoiceState.channel.parentId === serverProfileByServerId.categoryID && !newVoiceState.channel && oldVoiceState.channelId !== serverProfileByServerId.channelId) {
                // check if no member connected to temp vc
                if (oldVoiceState.channel.members.size < 1) {
                    // remove dataArray of deleted temp vc
                    await tempVcProfileModel.findOneAndDelete(
                        {
                            serverID: guild.id,
                            channelId: oldVoiceState.channel.id
                        }
                    ).catch(console.error);
                    await tempVcProfileModel.findOneAndUpdate(
                        { channelId: oldVoiceState?.channel?.id, },
                        { isFriendsPermit: false }
                    ).catch(console.error);
                    // delete the temp vc
                    await oldVoiceState?.channel?.delete()
                        .catch(console.error);
                }
                // set presence boolean to false if member left temp vc
                await tempVcProfileModel.findOneAndUpdate(
                    {
                        memberId: oldVoiceState.member.user.id,
                        serverID: guild.id,
                        channelId: oldVoiceState.channelId
                    },
                    { isInChannel: false }
                ).catch(console.error);
            }
        }

        // switched to temp voice channel
        if (oldVoiceState.channel !== null) {
            if (newVoiceState.channel && oldVoiceState.channel.parentId === serverProfileByServerId.categoryID && oldVoiceState.channelId !== serverProfileByServerId.channelId) {
                // check if no member connected to temp vc
                if (oldVoiceState.channel.members.size < 1) {
                    // remove dataArray of deleted temp vc
                    await tempVcProfileModel.findOneAndDelete(
                        {
                            serverID: guild.id,
                            channelId: oldVoiceState.channel.id
                        }
                    ).catch(console.error);
                    await tempVcProfileModel.findOneAndUpdate(
                        { channelId: oldVoiceState?.channel?.id, },
                        { isFriendsPermit: false }
                    ).catch(console.error);
                    // delete the temp vc
                    await oldVoiceState?.channel?.delete()
                        .catch(console.error);
                }
                // set presence boolean to false if member left temp vc
                await tempVcProfileModel.findOneAndUpdate(
                    {
                        memberId: oldVoiceState.member.user.id,
                        serverID: guild.id,
                        channelId: oldVoiceState.channelId
                    },
                    { isInChannel: false }
                ).catch(console.error);
            }
        }

        // set presence boolean to true if member joins back to his unclaimed yet voice channel
        if ((!oldVoiceState.channel && newVoiceState.channel) || (oldVoiceState.channel && newVoiceState.channel)) {
            // check if voice state member have a temp vc
            await tempVcProfileModel.findOneAndUpdate(
                {
                    memberId: newVoiceState.member.user.id,
                    serverID: guild.id,
                    channelId: newVoiceState.channelId
                },
                { isInChannel: true }
            ).catch(console.error);
        }
    });
}