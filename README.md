# ScribbleBot

**ScribbleBot** is a simple Discord bot that offers role management and RSS feed notifications tailored for the ScribbleHub website.

## Features

- **Role Management**: Users can manage their roles via interactive buttons. Admins can configure the roles and their descriptions.
- **RSS Feed Notifications**: Automatically checks for updates from ScribbleHub RSS feeds and posts them in a specific channel, tagging a role to let users know about the update.
- **Manual Configuration**: All settings (e.g., channel IDs, roles, RSS feed details) are configured via a JSON file.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Decaded/Scribble-Bot.git
```

```bash
cd Scribble-Bot
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

Fill in the `.env` file with your bot token.

4. Configure the bot settings by editing `bot-config.json`. You can refer to `bot-configuration.example.json` for an example.

## Usage

1. Start the bot:

```bash
npm start
```

2. The bot will log in and automatically handle:
   - Role management in the specified roles channel.
   - RSS feed updates, checking the feed at the interval set in the configuration.

## Configuration

All bot settings are stored in `bot-config.json`. Here's an overview of the important fields:

- **rolesChannelId**: The ID of the channel where role management message with buttons will appear.
- **roles**: An object mapping role IDs to their descriptions.
- **rssFeedUrl**: The RSS feed URL to monitor for updates.
- **rssTargetCategory**: The category of RSS items the bot will monitor.
- **rssChannelId**: The ID of the channel where RSS updates will be posted.
- **rssRoleToPingId**: The role ID to ping when a new RSS item is posted.
- **rssCheckInterval**: How frequently the RSS feed is checked (in milliseconds).

## Example Configuration

```json
{
	"botStatus": "online",
	"botActivityText": "Handling roles and story updates",
	"rolesChannelId": "123456789",
	"roles": {
		"1123456789": "Role #1",
		"1987654321": "Role #2"
	},
	"rolesMessage": "Select your roles below!",
	"rssFeedUrl": "https://www.rssscribblehub.com/rssfeed.php?type=author&uid=106835",
	"rssTargetCategory": "Discord Bot Shenanigans",
	"rssChannelId": "83734627129",
	"rssRoleToPingId": "1123456789",
	"rssCheckInterval": 300000,
	"rssThumbnail": "https://example.com/image.png",
	"rssDescription": "New chapter alert!",
	"rssAuthorName": "ScribbleHub",
	"rssIconURL": "https://example.com/icon.png"
}
```

## TODO

- **Move Configuration to Commands**: Currently, the bot's configuration (roles, RSS feed, etc.) is stored manually in files. The goal is to add commands that will allow server
  admins to configure roles, RSS feeds, and other settings directly through Discord commands, making the bot more user-friendly and flexible.

## Contributing

Contributions are welcome! If you have suggestions or found a bug, please [open an issue](https://github.com/Decaded/Scribble-Bot/issues).

## License

This project is licensed under the [MIT License](LICENSE).

---

## Enjoying the Project?

If you find this project helpful or fun to use, consider supporting me on Ko-fi! Your support helps me keep creating and improving.

<div align="center">
  <a href="https://ko-fi.com/decaded" target="_blank">
    <img src="https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0" alt="Support me on Ko-fi" style="height: 40px; border: 0px;">
  </a>
</div>
