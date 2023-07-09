const serversModel = require('../../database/models/servers_schema.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'setup',
    description: 'This command is for setting up the bot',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        // check if message author doesn't have ADMINISTRATOR perm
        if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.permissions.has("MANAGE_SERVER")) {
            const msgEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`You do not have sufficient permissions to use that command.`)
            return message.reply({ embeds: [msgEmbed] })
                .catch(console.error);

        }
        const oneTap = message.guild.channels.cache.get(serverProfile.channelId);
        const category = message.guild.channels.cache.get(serverProfile.categoryID);
        const commandsChannel = message.guild.channels.cache.get(serverProfile.cmdId);
        // check if there is a valid existing setup 
        if (oneTap && category && commandsChannel) {
            if (oneTap.parentId === serverProfile.categoryID && commandsChannel.parentId === serverProfile.categoryID) {
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
                                            await serversModel.findOneAndUpdate(
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
                                                            await serversModel.findOneAndUpdate(
                                                                { serverID: message.guild.id, },
                                                                { helpId: ch.id }
                                                            )
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
                            await serversModel.findOneAndUpdate(
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
                            await serversModel.findOneAndUpdate(
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
                                    await serversModel.findOneAndUpdate(
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