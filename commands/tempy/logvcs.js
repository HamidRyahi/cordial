const serversModel = require('../../database/models/servers_schema.js');
module.exports = {
    name: 'logvcs',
    description: 'This command is for locking your temp vc',
    async execute(client, message, args, Discord, authorProfile, serverProfile, authorTempVC) {
        if (message.author.id === '407241585722654724') {
            if (args.length === 0) {
                let allCategories;
                try {
                    allCategories = await serversModel.find();
                } catch (err) { console.log(err); }
                if (allCategories.length !== 0) {
                    for (let i = 0; i < allCategories.length; i++) {
                        const category = client.channels.cache.get(allCategories[i].categoryID);
                        if (category) {
                            category.children.forEach(c => message.channel.send(`${c.guild.name}, ${c.name}`));
                        } else {
                            message.channel.send(`${allCategories[i].categoryID}, <= This category was deleted from ${allCategories[i].serverName}`);
                        }
                    }
                }
            }
            if (args.length === 1) {
                let targetServer;
                try {
                    targetServer = await serversModel.findOne({ serverID: args[0] });
                } catch (err) { console.log(err); }
                const category = client.channels.cache.get(targetServer.categoryID);
                if (category) {
                    category.children.forEach(c => message.channel.send(`${c.guild.name}, ${c.name}`));
                } else {
                    message.channel.send(`${targetServer.categoryID}, <= This category was deleted from ${targetServer.serverName}`);
                }
            }
        }
    }
}