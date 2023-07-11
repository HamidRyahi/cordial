const tempVcProfileModel = require('../../database/models/tempSchema.js');
const serversModel = require('../../database/models/servers_schema.js');
module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);
    client.user.setActivity(`.vhelp | ${client.users.cache.size} users`, { type: "WATCHING" });
    // log all guilds that the bot is in
    client.guilds.cache.forEach(async g => {
        const userId = g.ownerId;
        try {
            const user = await client.users.fetch(userId);
            console.log(`ServerName: ${g.name} - MemberSize:               ${g.members.cache.size}                  - Username: ${user.username}`);
        } catch (error) {
            console.log('Unable to fetch user.');
        }

    })
    // When going back online, check if a channel is empty then delete it
    // let allTempVCs;
    // try {
    //     allTempVCs = await tempVcProfileModel.find();
    // } catch (err) { console.log(err); }
    // if (allTempVCs.length !== 0) {
    //     for (let i = 0; i < allTempVCs.length; i++) {
    //         const mega = client.channels.cache.get(allTempVCs[i].channelId);
    //         if (mega) {
    //             if (mega.members.size < 1) {
    //                 mega.delete()
    //                     .then(async () => {
    //                         await tempVcProfileModel.findOneAndDelete(
    //                             { channelId: allTempVCs[i].channelId }
    //                         ).catch(console.error);
    //                     })
    //                     .catch((err) => { console.log(err) });
    //             }
    //         } else {
    //             // When going back online check if a channel is already deleted then delete temporary data from database
    //             await tempVcProfileModel.findOneAndDelete(
    //                 { channelId: allTempVCs[i].channelId }
    //             ).catch(console.error);
    //         }
    //     }
    // }
    // // log all categories and their children channels
    // let allServerProfiles;
    // try {
    //     allServerProfiles = await serversModel.find();
    // } catch (err) { console.log(err); }
    // if (allServerProfiles.length !== 0) {
    //     for (let i = 0; i < allServerProfiles.length; i++) {
    //         const category = client.channels.cache.get(allServerProfiles[i].categoryID);
    //         if (category) {
    //             category.children.forEach(c => console.log(`${i + 1}: ${category.guild.name}, ${category.name}, ${c.guild.name}, ${c.name}`));
    //         }
    //     }
    // }

    // const ch = client.channels.cache.get('968855365259239494');
    // console.log(ch.members.size);
}