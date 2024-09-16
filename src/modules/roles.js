const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../bot-config.json');

const rolesChannelId = config.rolesChannelId;
const roles = config.roles;

// Function to set up role buttons
async function setupRoles(client) {
	try {
		const channel = await client.channels.fetch(rolesChannelId);
		if (!channel) {
			console.error('Channel not found');
			return;
		}

		const row = new ActionRowBuilder();

		Object.keys(roles).forEach(roleId => {
			row.addComponents(new ButtonBuilder().setCustomId(`role-${roleId}`).setLabel(roles[roleId]).setStyle(ButtonStyle.Primary));
		});

		// Fetch messages from the channel
		const existingMessages = await channel.messages.fetch({ limit: 100 });

		// Check if an exact match exists
		const exactMatches = existingMessages.filter(msg => msg.content === config.rolesMessage);

		if (exactMatches.size > 0) {
			// If there is more than one exact match, delete all messages except the exact matches
			if (exactMatches.size > 1) {
				existingMessages.forEach(async message => {
					if (!exactMatches.has(message.id)) {
						// Exclude the exact matches
						try {
							await message.delete();
							console.log(`Deleted message: ${message.id} | ${message.author.tag} | ${message.content}`);
						} catch (error) {
							console.error(`Error deleting message ${message.id} | ${message.author.tag} | ${message.content}:`, error);
						}
					}
				});
				console.log('Preserved exact matches and deleted other messages.');
			}
		} else {
			console.log('No exact match found. Deleting all messages and posting a new one.');

			// Delete all messages if no exact match is found
			existingMessages.forEach(async message => {
				if (!message.author.bot) {
					// Optionally exclude bot messages
					try {
						await message.delete();
						console.log(`Deleted message: ${message.id} | ${message.author.tag} | ${message.content}`);
					} catch (error) {
						console.error(`Error deleting message ${message.id} | ${message.author.tag} | ${message.content}:`, error);
					}
				}
			});

			// Send a new message with the desired content
			await channel.send({
				content: config.rolesMessage,
				components: [row],
			});

			console.log('Posted new message with roles.');
		}
	} catch (error) {
		console.error('Error setting up roles:', error);
	}
}

// Function to handle button interactions
async function handleButtonInteraction(interaction) {
	if (!interaction.isButton() || !interaction.customId.startsWith('role-')) return;

	const roleId = interaction.customId.split('-')[1];
	const member = interaction.guild.members.cache.get(interaction.user.id);
	const role = interaction.guild.roles.cache.get(roleId);

	if (!role) {
		await interaction.reply({ content: 'Role not found.', ephemeral: true });
		return;
	}

	try {
		if (member.roles.cache.has(roleId)) {
			await member.roles.remove(role);
			await interaction.reply({ content: `Removed role: ${role.name}`, ephemeral: true });
		} else {
			await member.roles.add(role);
			await interaction.reply({ content: `Added role: ${role.name}`, ephemeral: true });
		}
	} catch (error) {
		console.error('Error handling button interaction:', error);
		await interaction.reply({ content: 'An error occurred while managing roles.', ephemeral: true });
	}
}

module.exports = { setupRoles, handleButtonInteraction };
