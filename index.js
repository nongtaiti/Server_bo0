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
    await channel.bulkDelete(2, true)
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

			client.user.setActivity(`👀 | ${state.players.length} Players.`, {type: "WATCHING"})

			PlayerList = state.players.length > 0? state.players.map((p) => p.name || "ConnectingPlayer").join("\n"): "No players"


			let embedSatus = new MessageEmbed()
				.setTitle(`<:6_:1139420011757309972> SERVER  :  \`\`\`${state.name}\`\`\``)
				.setURL('https://invite.teamspeak.com/103.212.181.193/?port=9012')
				.setColor('RANDOM')
				.addFields(
					{ name: 'Address', value: `\`\`\`${state.connect}\`\`\``, inline: true},
					{ name: 'Server Players', value: `\`\`\`${state.players.length} Players\`\`\``, inline: true},
					{ name: "Current Players Online:",value: `\`\`\`${PlayerList}\`\`\``},
				)
				.setFooter({ text: ' ♥ JUST A SIMPLE. HAPPY FAMILY. ' })
				.setImage('https://www.tsviewer.com/promotion/dynamic_sig/sig.php/clan468x60_all/1128765.png')
				.setTimestamp()

				status.edit({ content: null, embeds: [ embedSatus ], components: [ row ]})
				    
		}).catch((error) => {
			client.user.setActivity(`Server Offline `, {type: "WATCHING"});
				status.edit('offline')
		});
	}

	task();
	setInterval(task, 60000);
})

client.login(token);
