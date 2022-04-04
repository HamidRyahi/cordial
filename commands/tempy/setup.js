const serverModel = require('../../database/models/serverSchema.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'setup',
    description: 'This command is for setting up the bot',
    async execute(client, message, args, Discord, recordProfileByAuthorId, prefixProfile, dataProfileByChannelId, serverProfileByAuthorId) {
        // check if message author doesn't have ADMINISTRATOR perm
        if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_SERVER")) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`You do not have sufficient permissions to use that command.`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);

        }
        const oneTap = message.guild.channels.cache.get(serverProfileByAuthorId.channelId);
        const category = message.guild.channels.cache.get(serverProfileByAuthorId.categoryID);
        const commandsChannel = message.guild.channels.cache.get(serverProfileByAuthorId.cmdId);
        // check if there is a valid existing setup 
        if (oneTap && category && commandsChannel) {
            if (oneTap.parentId === serverProfileByAuthorId.categoryID && commandsChannel.parentId === serverProfileByAuthorId.categoryID) {
                const msgEmbed = new MessageEmbed()
                    .setColor('#ffff00')
                    .setTitle(`Reminder: There is already an active setup on this server!`)
                    .setDescription(`
Category: ${category.name.toUpperCase()}
Commands text channel: <#${commandsChannel.id}>
VC generator: <#${oneTap.id}>               
`)
                return message.reply({ embeds: [msgEmbed] })
                    .catch(console.error);
            }
        }
        // check if the category is deleted or got renamed and the vc creator and cmd channel are deleted
        if (!category || (category.name !== 'CORDIAL' && !oneTap && !commandsChannel)) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`<a:740852243812581446:934406830891876412> Processing...`)
            message.reply({ embeds: [msgEmbed] })
                .then(async botMessage => {
                    // create a complete setup
                    message.guild.channels
                        .create(`CORDIAL`, {
                            type: 'GUILD_CATEGORY',
                            permissionOverwrites: [
                                {
                                    id: '922678523196489778',
                                    allow: ['VIEW_CHANNEL', 'CONNECT', 'MANAGE_CHANNELS', 'MOVE_MEMBERS']
                                },
                            ],
                        })
                        .then(async parent => {
                            message.guild.channels
                                .create('cordial-commands', {
                                    type: 'GUILD_TEXT',
                                    parent,
                                    permissionOverwrites: [
                                        {
                                            id: '922678523196489778',
                                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS']
                                        },
                                    ],
                                })
                                .then(async textChannel => {
                                    message.guild.channels
                                        .create('Click here!', {
                                            type: 'GUILD_VOICE',
                                            parent,
                                            position: 1,
                                            permissionOverwrites: [
                                                {
                                                    id: '922678523196489778',
                                                    allow: ['VIEW_CHANNEL', 'CONNECT', 'MANAGE_CHANNELS']
                                                },
                                            ],
                                        })
                                        .then(async voiceChannel => {
                                            await serverModel.findOneAndUpdate(
                                                { serverID: message.guild.id, },
                                                {
                                                    channelId: voiceChannel.id,
                                                    categoryID: parent.id,
                                                    cmdId: textChannel.id
                                                }
                                            )
                                                .then(() => {
                                                    message.guild.channels
                                                        .create('cordial-help', {
                                                            type: 'GUILD_TEXT',
                                                            parent,
                                                            position: 1,
                                                            permissionOverwrites: [
                                                                {
                                                                    id: '922678523196489778',
                                                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS']
                                                                },
                                                            ],
                                                        })
                                                        .then(async (ch) => {
                                                            await serverModel.findOneAndUpdate(
                                                                { serverID: message.guild.id, },
                                                                { helpId: ch.id }
                                                            )
                                                            const msgEmbed = new MessageEmbed()
                                                                .setColor('#5865F2')
                                                                .setTitle('Click here to invite Cordial to your server!')
                                                                .setURL('https://discord.com/api/oauth2/authorize?client_id=922678523196489778&permissions=285494352&scope=bot')
                                                                .setDescription(
                                                                    `**Cordial commands:**
                                                
> \`${prefixProfile.prefix}setup\` To set the bot up for the first time.
> \`${prefixProfile.prefix}delete\` To delete an existing setup on your server.
> \`${prefixProfile.prefix}prefix\` To get or change the bot's prefix for your server.
                                                
> \`${prefixProfile.prefix}lock\` To lock your VC.
> \`${prefixProfile.prefix}unlock\` To unlock your VC.
> \`${prefixProfile.prefix}hide\` To make your VC invisible to other members and roles.
> \`${prefixProfile.prefix}show\` To make your VC visible to all members and roles.
> \`${prefixProfile.prefix}rename\` To change the name of your VC.
> \`${prefixProfile.prefix}limit\` To change the limit of users who can join your VC.
> \`${prefixProfile.prefix}owner\` To get the owner of a VC you are connected to.
> \`${prefixProfile.prefix}claim\`To claim a VC your are connected to if the previous owner is not connected.
> \`${prefixProfile.prefix}transfer\` To transfer the ownership of your VC to another member.
> \`${prefixProfile.prefix}reject\` To reject a member or role from having access to your VC.
> \`${prefixProfile.prefix}kick\` To disconnect a member or members with a specific role from your VC.
> \`${prefixProfile.prefix}permit\` To permit a member or role to have access to your VC.
> \`${prefixProfile.prefix}knock\` To ask for connect permission from an owner of a locked VC.
                                                
> \`${prefixProfile.prefix}friends add\` To add a member or role to your friends list.
> \`${prefixProfile.prefix}friends remove\` To remove a member or role from your friends list.
> \`${prefixProfile.prefix}friends show\` To view your friends list.
> \`${prefixProfile.prefix}friends clear\` To clear your friends list.
> \`${prefixProfile.prefix}friends permit\` To permit all your friends list to have access to your VC at once.
                                                
> \`${prefixProfile.prefix}blacklist add\` To add a member or role to your blacklist.
> \`${prefixProfile.prefix}blacklist remove\` To remove a member or role from your blacklist.
> \`${prefixProfile.prefix}blacklist show\` To view your blacklist.
> \`${prefixProfile.prefix}blacklist clear\` To clear your blacklist.`)
                                                                .setThumbnail('https://cdn.discordapp.com/avatars/922678523196489778/f37a49c9da5eddcccf87a4a531741e95.png')
                                                                .setFooter({ text: 'Bot developed by Harry420#6911', iconURL: 'https://cdn.discordapp.com/avatars/922678523196489778/f37a49c9da5eddcccf87a4a531741e95.png' });
                                                            ch.send({ embeds: [msgEmbed] })
                                                                .then(() => {
                                                                    ch.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: false, CREATE_PUBLIC_THREADS: false, CREATE_PRIVATE_THREADS: false })
                                                                        .catch(console.error);
                                                                })
                                                                .catch(console.error);
                                                        })
                                                        .catch(console.error);
                                                    const msgEmbed = new MessageEmbed()
                                                        .setColor('#00ff00')
                                                        .setTitle(`Setup completed successfully!`)
                                                        .setDescription(`
Category: ${parent.name.toUpperCase()}
Commands text channel: <#${textChannel.id}>
VC generator: <#${voiceChannel.id}>               `)
                                                    botMessage.edit({ embeds: [msgEmbed] })
                                                        .catch(console.error);
                                                })
                                                .catch(console.error);
                                        })
                                        .catch(console.error)
                                })
                                .catch(console.error)
                        })
                        .catch(console.error)
                })
                .catch(console.error)
        }
        // check if only vc generator is unvalid
        if (category && !oneTap && commandsChannel) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`<a:740852243812581446:934406830891876412> Processing...`)
            message.reply({ embeds: [msgEmbed] })
                .then(async botMessage => {
                    // create a new vc generator
                    message.guild.channels
                        .create('Click here!', {
                            type: 'GUILD_VOICE',
                            parent: category,
                            position: 1,
                            permissionOverwrites: [
                                {
                                    id: '922678523196489778',
                                    allow: ['VIEW_CHANNEL', 'CONNECT', 'MANAGE_CHANNELS']
                                },
                            ],
                        })
                        .then(async voiceChannel => {
                            await serverModel.findOneAndUpdate(
                                { serverID: message.guild.id, },
                                { channelId: voiceChannel.id, }
                            )
                                .then(() => {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#00ff00')
                                        .setTitle(`Setup completed successfully!`)
                                        .setDescription(`
Category: ${category.name.toUpperCase()}
Commands text channel: <#${commandsChannel.id}>
VC generator: <#${voiceChannel.id}>               
`)
                                    return botMessage.edit({ embeds: [msgEmbed] })
                                        .catch(console.error);
                                })
                                .catch(console.error);
                        })
                        .catch(console.error)
                })
                .catch(console.error)
        }
        // check if only cmd channel is unvalid
        if (category && oneTap && !commandsChannel) {
            // create a new cmd channel
            const msgEmbed = new MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`<a:740852243812581446:934406830891876412> Processing...`)
            message.reply({ embeds: [msgEmbed] })
                .then(async botMessage => {
                    message.guild.channels
                        .create('cordial-commands', {
                            type: 'GUILD_TEXT',
                            parent: category,
                        })
                        .then(async textChannel => {
                            await serverModel.findOneAndUpdate(
                                { serverID: message.guild.id, },
                                { cmdId: textChannel.id, }
                            )
                                .then(() => {
                                    const msgEmbed = new MessageEmbed()
                                        .setColor('#00ff00')
                                        .setTitle(`Setup completed successfully!`)
                                        .setDescription(`
Category: ${category.name.toUpperCase()}
Commands text channel: <#${textChannel.id}>
VC generator: <#${oneTap.id}>               
`)
                                    return botMessage.edit({ embeds: [msgEmbed] })
                                        .catch(console.error);
                                })
                                .catch(console.error);
                        })
                        .catch(console.error)
                })
                .catch(console.error)
        }
        // check if only the category is valid and it should still has the "CORDIAL" name
        if (category && category.name === 'CORDIAL' && !oneTap && !commandsChannel) {
            // create a new vc generator and a new cmd channel
            const msgEmbed = new MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`<a:740852243812581446:934406830891876412> Processing...`)
            message.reply({ embeds: [msgEmbed] })
                .then(async botMessage => {
                    message.guild.channels
                        .create('cordial-commands', {
                            type: 'GUILD_TEXT',
                            parent: category,
                        })
                        .then(async textChannel => {
                            message.guild.channels
                                .create('Click here!', {
                                    type: 'GUILD_VOICE',
                                    parent: category,
                                    position: 1,
                                    permissionOverwrites: [
                                        {
                                            id: '922678523196489778',
                                            allow: ['VIEW_CHANNEL', 'CONNECT', 'MANAGE_CHANNELS']
                                        },
                                    ],
                                })
                                .then(async voiceChannel => {
                                    await serverModel.findOneAndUpdate(
                                        { serverID: message.guild.id, },
                                        {
                                            channelId: voiceChannel.id,
                                            cmdId: textChannel.id
                                        }
                                    )
                                        .then(() => {
                                            const msgEmbed = new MessageEmbed()
                                                .setColor('#00ff00')
                                                .setTitle(`Setup completed successfully!`)
                                                .setDescription(`
Category: ${category.name.toUpperCase()}
Commands text channel: <#${textChannel.id}>
VC generator: <#${voiceChannel.id}>               
`)
                                            return botMessage.edit({ embeds: [msgEmbed] })
                                                .catch(console.error);
                                        })
                                        .catch(console.error);
                                })
                                .catch(console.error)
                        })
                        .catch(console.error)
                })
                .catch(console.error)
        }
    }
}