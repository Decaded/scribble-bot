require('dotenv-safe').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { ActivityType } = require('discord-api-types/v10');
const NyaDB = require('@decaded/nyadb');
const { startRssFeedCheck } = require('./modules/rss'); 
const rolesModule = require('./modules/roles');
const config = require('./bot-config.json');

// Initialize NyaDB
const nyadb = new NyaDB();

// Create or get database for RSS links
const rssDbName = 'rssLinks';
const dbList = nyadb.getList();
if (!dbList.includes(rssDbName)) {
	nyadb.create(rssDbName);
}

// Create a new Discord client
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers],
});

// Log in the bot
client.login(process.env.BOT_TOKEN);

// Event listener for when the bot is ready
client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}`);
	startRssFeedCheck(client, nyadb);
	rolesModule.setupRoles(client);

	// Set custom presence status
	client.user.setPresence({
		status: config.botStatus, // Bot status
		activities: [
			{
				name: config.botActivityText, // Custom status message
				type: ActivityType.Streaming, // Activity type (Playing, Streaming, Listening, Watching)
			},
		],
	});
});

// Event listener for button interactions
client.on(Events.InteractionCreate, interaction => {
	if (interaction.isButton()) {
		rolesModule.handleButtonInteraction(interaction, nyadb);
	}
});
