const { decryptMedia } = require('@open-wa/wa-automate');
const moment = require('moment');
const set = require('../settings');

// Library
const _function = require('../lib/function');
const _txt = require('../lib/text');
const color = require('../util/colors');

module.exports = async (client, message) => {
  try {
    const msgAmount = await client.getAmountOfLoadedMessages();
    if (msgAmount > 3000) await client.cutMsgCache();

    const { id, body, mimetype, type, t, from, sender, content, caption, author, isGroupMsg, chat, quotedMsg, quotedMsgObj, mentionedJidList } = message;
    const { name, shortName, pushname, formattedName } = sender;
    const { formattedTitle, isGroup, contact, groupMetadata } = chat;

    const botOwner = set.owner;
    const botGroup = set.support;
    const botPrefix = set.prefix;
    const botNumber = (await client.getHostNumber()) + '@c.us';

    const isAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender.id).isAdmin : undefined;
    const isOwner = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender.id).isSuperAdmin : undefined;
    const isBotAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === botNumber).isAdmin : undefined;

    const validMessage = caption ? caption : body;
    if (!validMessage || validMessage[0] != botPrefix) return;

    const command = validMessage.trim().split(' ')[0].slice(1);
    const arguments = validMessage.trim().split(' ').slice(1);
    const senderId = sender.id.split('@')[0] || from.split('@')[0];
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    // debug
    console.debug(color('green', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `!${command} | ${sender.id} ${isGroup ? 'FROM ' + formattedTitle : ''}`, color('yellow', moment().format()));

    if (isGroup) {
      if (groupMetadata.participants.length < 5 && !botOwner.includes(groupMetadata.owner)) {
        await client.reply(from, `_⚠️ Ooops... sorry to avoid SPAM groups, bots can only be used in groups with more than 10 members, while your group only has *${groupMetadata.participants.length}*_\n\n_For more information please ask me on Telegram *@Team_SD*_`, id);
        return client.leaveGroup(from);
      }
    }

    const allChats = await client.getAllChats();
    switch (command) {
      case 'resetlimit':
        break;

      case 'unblock':
        if (senderId !== botOwner) return await client.reply(from, '_⛔ The command you are referring to can only be used by Owner bot!_', id);
        await client.contactUnblock(arguments[0] + 'c.us');
        return await client.reply(from, '_🟢 Succeeded *Unblock* user!_', id);
        break;

      case 'leaveall':
        if (senderId !== botOwner) return await client.reply(from, '_⛔ The command you are referring to can only be used by Owner bot!_', id);
        const allGroups = await client.getAllGroups();
        allGroups.forEach(async (group) => {
          if (!group.id !== botGroup) {
            await client.leaveGroup(group.id);
          }
        });
        return await client.reply(from, '_🟢 Bot Successfully exited all existing groups!_', id);
        break;

      case 'resetrank':
        break;

      case 'owner':
      case 'contact':
      case 'ownerbot':
        return await client.reply(from, '_👋 Hi, Let us communicate with the owner, Telegram : *@Team_SD*_', id);
        break;

      case 'clearall':
        if (senderId !== botOwner) return await client.reply(from, '_⛔ The command you are referring to can only be used by Owner bot!_', id);
        allChats.forEach(async (chat) => {
          await client.clearChat(chat.id);
        });
        return await client.reply(from, '_🟢 Successfully Cleared History Message Bot!_', id);
        break;

      case 'bc':
        if (senderId !== botOwner) return await client.reply(from, '_⛔ The command you are referring to can only be used by Owner bot!_', id);
        if (arguments.length < 1) return;
        await allChats.forEach(async (chat) => {
          await client.sendText(chat.id, arguments.join(' '));
        });
        return await client.reply(from, '_🟢 Successfully Broadcast all Chat List Bot!_', id);
        break;

      case 'kickall':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isOwner) return await client.reply(from, '_⛔ This command can only be used by *Owner* group only!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Bot *Must* be *Admin* to use this command!_', id);
        await client.reply(from, '_😏 Command executed! Hope you know what you are doing!_', id);
        await groupMetadata.participants.forEach(async (participant) => {
          if (!participant.isSuperAdmin) await client.removeParticipant(from, participant.id);
        });
        break;

      case 'start':
        
        break;

      case 'add':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (arguments.length !== 1) client.reply(from, '_⚠️ Example of command use : !add 249....._', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isNumberValid = await client.checkNumberStatus(arguments[0] + '@c.us');
        if (isNumberValid.status === 200)
          await client
            .addParticipant(from, isNumberValid.id._serialized)
            .then(async () => await client.reply(from, '_🎉 Successfully added Member, Welcome!_', id))
            .catch(async (error) => await client.reply(from, '_🥺 Failed to add member! Possibly member has been blocked by bot! For unblocking please DM to *@Team_SD* on Telegram_', id));
        break;

      case 'kick':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (mentionedJidList.length !== 1) client.reply(from, '_⚠️ Example of command use : !kick @mention_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isKicked = await client.removeParticipant(from, mentionedJidList[0]);
        if (isKicked) return await client.reply(from, '_🎉 Successfully Kick member Say Goodbye!_', id);
        break;

      case 'promote':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (mentionedJidList.length !== 1) client.reply(from, '_⚠️ Example of command use : !promote @mention_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isPromoted = await client.promoteParticipant(from, mentionedJidList[0]);
        if (isPromoted) return await client.reply(from, '_🎉 Successfully promoted member to Admin/Group Administrator! Congratulations_', id);
        break;

      case 'demote':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from,'_⛔ This command can only be used by Admin group only!_' , id);
        if (mentionedJidList.length !== 1) client.reply(from, '_⚠️ Example of command use : !demote @mention_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isDemoted = await client.demoteParticipant(from, mentionedJidList[0]);
        if (isDemoted) return await client.reply(from, '_🎉 Successfully demote Admin to Member! Say Pity!_', id);
        break;

      case 'revoke':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        await client
          .revokeGroupInviteLink(from)
          .then(async (res) => await client.reply(from, '_🎉 Successfully Reset Group Invite Link! use !link to get Group invite Link_', id))
          .catch((error) => console.log('revoke link error!'));
        break;

      case 'link':
      case 'invitelink':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        await client
          .getGroupInviteLink(from)
          .then(async (inviteLink) => await client.reply(from, `_🔗 Group Invite Link : *${inviteLink}*_`, id))
          .catch((error) => console.log('Invite link error'));
        break;

      case 'disconnect':
      case 'kickbot':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        client
          .reply(from, '_👋 Thank you, for the memories we had so far, if you miss it, do not add me to your group again! I will always be there for you!_', id)
          .then(async() => await client.leaveGroup(from))
          .catch((error) => console.log('kickbot error'));
        break;

      case 'adminmode':
      case 'silent':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ This command can only be used by *Admin* group only!_', id);
        if (arguments.length !== 1) return await client.reply(from, '_⚠️ Example of using Command : !silent on|off_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ This command can only be used when *Bot is Admin* in this group!_', id);
        const isSilent = await client.setGroupToAdminsOnly(from, arguments[0].toLowerCase() === 'on');
        if (isSilent) return await client.reply(from, `_🎉 Successfully set to-group *${arguments[0].toLowerCase() === 'on' ? 'Admin Mode' : 'Everyone Mode'}*_ `, id);
        break;

      case 'p':
      case 'ping':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        const allMembers = groupMetadata.participants.map((member) => `@${member.id.split('@')[0]}`);
        await client.sendTextWithMentions(from, `_😏 Summoning Technique!_\n\n${allMembers.join('\n')}\n\n_🧒🏻 Follow Developer Telegram *@Team_SD*, to get more information about Bots!_`);
        break;

      case 'groupstats':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        let { owner, creation, participants, desc } = groupMetadata;
        const creationTime = moment.unix(creation);
        await client.sendTextWithMentions(from, `_📃 Group Information_\n\n_Name : ${formattedTitle}_\n_Owner : @${owner.split('@')[0]}_\n_Total Member : ${participants.length }_\n_Date Created : ${creationTime.format('DD MMMM YYYY')}_\n_Created Hour : ${creationTime.format('HH:mm:ss')}_\n_Description : ${desc ? desc : ' '}_`, id);
        break;

      case 'kickme':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        if (isOwner) return await client.reply(from, '_⛔ Owner group/Handsome people can not be kicked!_', id);
        await client.reply(from, '_😏 I hope you know what you are doing!_', id);
        await client.removeParticipant(from, sender.id);
        break;

      case 'mystats':
        if (!isGroup) return await client.reply(from, '_⛔ This command can only be used in groups!_', id);
        const senderPicture = sender.profilePicThumbObj.eurl ? sender.profilePicThumbObj.eurl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        await client.sendImage(from, senderPicture, formattedName, `_🎉 Group Member [ *${formattedTitle}* ]_\n\n_Name : ${pushname ? pushname : 'Unknown'}_\n_Owner Status : ${isOwner ? 'Yes' : 'No'}_\n_Admin Status : ${isAdmin ? 'Yes' : 'No'}_`, id);
        break;

      case 'support':
        await client.addParticipant(botGroup, sender.id);
        return await client.reply(from, 'You have been added to this Official Bot Group!');
        break;

      case 'join':
        if (arguments.length < 1) return await client.reply(from, '_⚠️ Example of Command Usage : !join <group link>_', id);
        const joinStatus = await client.joinGroupViaLink(arguments[0]);
        if (joinStatus === 406) return await client.reply(from, '_⚠️ Make sure you enter the correct group URL!_', id);
        if (joinStatus === 401) return await client.reply(from, '_⚠️ Bot Can not Join, because recently bot just kicked from the group!_', id);
        await client.reply(from, '_🚀 Launch! Bot successfully entered group!_', id);
        break;

       default:
         return console.debug(color('red', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `!${command} | ${sender.id} ${isGroup ? 'FROM ' + formattedTitle : ''}`, color('yellow', moment().format()));
     }

     return;
   } catch(err) {
     console.log(err);
   }
};
