const fs = require('fs');
const Discord = require("discord.js");
global.bot = new Discord.Client();
const { prefix, token } = require('./config.json');
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// get commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


console.log('------Running gonb------');
let botID;

bot.on("ready", () => {
    botID = bot.user.id;
    console.log('botID: ' + botID);
    bot.user.setStatus("online");
});

// message.channel.send("", { files: birbIMG });

bot.on('message', message => {

	// prevent responding to self
	if (message.author.bot) return;

	// reply whenever gonb is posted
	if(message.content.toLowerCase().includes("gonb")) {
		message.channel.send("gonb");
		message.react("740244770806300693")
		.catch(error => console.log('Reaction error :' + error));
	}

	// ignore anything that does not start with prefix
	if (!message.content.startsWith(prefix)) return;

	// get arguements
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// find command 
	const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// if the command requires arguements and none are provided display message
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// ---- set up for cooldowns below ----
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`you cannot use \`${command.name}\` for ${timeLeft.toFixed(1)} more second(s).`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// execute commands
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

bot.login(token);



