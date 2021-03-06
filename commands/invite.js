const Discord = require('discord.js');

module.exports = {
        name: 'invite',
        description: 'A link to invite the bot to your discord server',
        cooldown: 5,
        execute(message, args) {
                bot.generateInvite(['SEND_MESSAGES', 'MANAGE_MESSAGES', 'ADD_REACTIONS', 'VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES'])
                .then(link => {
                        const embed = new Discord.MessageEmbed()
                        .setColor('#00ff00')
                        .setTitle('Invite Gonb')
                        .setDescription('Invite Gonb bot to your own discord server.')
                        .addField('Link', `[Click Here](${link})`);
                        message.channel.send(embed);
                })
                .catch(console.error);
                
        },
};
