const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();
const settings = require('./config.json');
freq = settings.pingInterval * 1000;

const getServerStatus = () => {
	fetch(`https://api.mcsrvstat.us/2/${settings.ip}`)
		.then(res => res.json())
		.then(status => {
			if (!status.online) {
				client.user.setStatus('dnd');
				client.user.setActivity('Server offline', { type: 'WATCHING' });
				return;
			}

			if (status.players.online == 0) {
				client.user.setStatus('idle');
			} else {
				client.user.setStatus('online');
			}
			client.user.setActivity(`\n⛏️ ${status.players.online} / ${status.players.max}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\n👥 ${status.players.list.join(', ')}`, { type: 'WATCHING' });
		})
		.catch(e => {
			client.user.setStatus('dnd');
			client.user.setActivity('API error', { type: 'WATCHING' });
		});
};

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	getServerStatus();
	client.setInterval(getServerStatus, freq);
});

client.login(settings.token);
