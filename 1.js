const { Client, Intents, MessageEmbed , MessageButton , MessageActionRow} = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
	]
});

const Gamedig = require('gamedig');
const { token, channelID, ip, port, type } = require('./config.json');


client.on('ready', async () => {

	console.log(`[${client.user.tag}] Start Now <3`);


    channel = client.channels.cache.get(channelID)
    await channel.bulkDelete(1, true)
	status = await channel.send('Loading...*')
		

	let row = new MessageActionRow()
			.addComponents(
			new MessageButton()
			.setLabel('Connecting')
			.setStyle('LINK')
			.setURL('https://invite.teamspeak.com/103.212.181.193/?port=9012'))


task = () => {
		Gamedig.query({
			type: type,
			host: ip,
			port: port,
		}).then((state) => {

			client.user.setActivity(` ${state.players.length} 𝑃𝑙𝑎𝑦𝑒𝑟𝑠 𝑂𝑛𝑙𝑖𝑛𝑒.`, {type: "WATCHING"})

			function uptimeString(seconds) {
				let days = Math.floor(seconds / (3600*24));
				seconds -= days*3600*24;
				let hours = Math.floor(seconds / 3600);
				seconds -= hours*3600;
				let minutes = Math.floor(seconds / 60);
				seconds -= minutes*60;
				return `${days} Day ${hours} Hours ${minutes} Minutes `;
			}


			PlayerList = state.players.length > 0? state.players.map((p) => p.name || "ConnectingPlayer").join("\n"): "No players"


			let embedSatus = new MessageEmbed()
				.setTitle(state.name)
				.setURL('https://invite.teamspeak.com/103.212.181.193/?port=9012')
				.setColor('RANDOM')
				.addFields(
					{ name: 'Name', value: `\`${state.name}\``, inline: true},
					{ name: 'Address', value: `\`${state.connect}\``, inline: true},
					{ name: 'Server Players', value: `\`${state.players.length} Players\``, inline: true},
					{ name: "Current Players Online:",value: `\`\`\`${PlayerList}\`\`\``},
				)
				.setFooter({ text: ' JUST A SIMPLE. HAPPY FAMILY. | '+ uptimeString(Math.floor(process.uptime()))})
				.setTimestamp()

				status.edit({ content: null, embeds: [ embedSatus ], components: [ row ]})
				    
		}).catch((error) => {
			let embedSatusOff = new MessageEmbed()
				.setTitle("🔴 Serveur offline")
				.setColor("#d65a5a")
				.setFooter({ text: ' JUST A SIMPLE. HAPPY FAMILY. ' })
				.setTimestamp()

				status.edit({ content: null, embeds: [ embedSatusOff ] , components: [ row ]})
		});
	}

	task();
	setInterval(task, 60000);
})

client.login(token);
