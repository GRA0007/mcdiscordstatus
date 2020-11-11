const Discord = require('discord.js');
const mcping = require('mc-ping-updated');

const client = new Discord.Client();
const settings = require('./config.json');
freq = settings.pingInterval * 1000;

function getServerStatus() {
	mcping(settings.ip, settings.port, function(err, res) {
		if (!(typeof err === 'undefined' || err === null)) {
			client.user.setStatus('dnd');
			serverStatus = 'Server offline';
			client.user.setActivity(serverStatus, { type: 'PLAYING' });
			return;
		}
		if (typeof res.players.sample === 'undefined') { client.user.setStatus('idle') }
		if (!(typeof res.players.sample === 'undefined')) { client.user.setStatus('online') }
		serverStatus = res.players.online + ' / ' + res.players.max;
		client.user.setActivity(serverStatus, { type: 'PLAYING' });
	})
}

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	getServerStatus();
	client.setInterval(getServerStatus, freq);
});

client.login(settings.token);
