const axios = require('axios');
const xml2js = require('xml2js');
const { EmbedBuilder } = require('discord.js');
const config = require('../bot-config.json');

// Function to check RSS Feed
async function checkRssFeed(client, nyadb) {
	try {
		const response = await axios.get(config.rssFeedUrl);
		const parser = new xml2js.Parser();
		const result = await parser.parseStringPromise(response.data);

		// console.log('Parsed RSS Feed Response:', result);

		const items = result.rss && result.rss.channel && result.rss.channel[0].item;
		if (!items || items.length === 0) {
			console.error('No items found in RSS feed.');
			return;
		}

		const newestItem = items[0];
		const newestLink = newestItem.link[0];

		// Check the category of the newest item
		let category = newestItem.category && newestItem.category[0];

		if (category !== config.rssTargetCategory) {
			// console.log(`Skipping item with category: ${category}`);
			return; // Skip items with a different category
		}

		// Retrieve the stored data (link and message ID) from the database
		let storedData = await nyadb.get('rssLinks');

		// Check if the stored link is different from the newest link
		if (storedData.link !== newestLink) {
			const channel = await client.channels.fetch(config.rssChannelId);
			const embed = new EmbedBuilder()
				.setTitle(newestItem.title[0])
				.setAuthor({ name: config.rssAuthorName, iconURL: rssIconURL })
				.setThumbnail(config.rssThumbnail)
				.setDescription(config.rssDescription)
				.setURL(newestItem.link[0])
				.setTimestamp();

			// Fetch the role to ping
			const roleToPing = await client.guilds.cache.first().roles.fetch(config.rssRoleToPingId);

			// Send the new message with role mention
			await channel.send({
				content: `<@&${roleToPing.id}>`, // Ping the role
				embeds: [embed],
			});

			// Store the newest link and message ID in the database
			await nyadb.set('rssLinks', {
				link: newestLink,
			});

			console.log(`Posted new RSS item: ${newestItem.title[0]}`);
		}
	} catch (error) {
		console.error('Error checking RSS feed:', error);
	}
}

// Set up the interval to check the RSS feed
function startRssFeedCheck(client, nyadb) {
	setInterval(() => {
		// console.log('Running RSS Feed check');
		checkRssFeed(client, nyadb);
	}, config.rssCheckInterval);
}

module.exports = { startRssFeedCheck };
