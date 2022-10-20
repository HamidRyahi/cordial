const profileModel2 = require('../../database/models/tempSchema.js');
const serverModel = require('../../database/models/serverSchema.js');
module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);
    client.user.setActivity(`.vhelp | ${client.users.cache.size} users`, { type: "WATCHING" });
    // log all guilds that the bot is in
    // client.guilds.cache.forEach(g => console.log(g.name));
    // When going back online, check if a channel is empty then delete it
    // let allTempVCs;
    // try {
    //     allTempVCs = await profileModel2.find();
    // } catch (err) { console.log(err); }
    // if (allTempVCs.length !== 0) {
    //     for (let i = 0; i < allTempVCs.length; i++) {
    //         const mega = client.channels.cache.get(allTempVCs[i].channelId);
    //         if (mega) {
    //             if (mega.members.size < 1) {
    //                 mega.delete()
    //                     .then(async () => {
    //                         await profileModel2.findOneAndDelete(
    //                             { channelId: allTempVCs[i].channelId }
    //                         ).catch(console.error);
    //                     })
    //                     .catch((err) => { console.log(err) });
    //             }
    //         } else {
    //             // When going back online check if a channel is already deleted then delete temporary data from database
    //             await profileModel2.findOneAndDelete(
    //                 { channelId: allTempVCs[i].channelId }
    //             ).catch(console.error);
    //         }
    //     }
    // }
    // // log all categories and their children channels
    // let allServerProfiles;
    // try {
    //     allServerProfiles = await serverModel.find();
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