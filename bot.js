const Discord = require('discord.js')
const client = new Discord.Client()
const req = require('node-fetch')
const sleep = require('sleep')

let settings = { method: "Get" }

client.on('ready', () => {
	console.log("Connected ass " + client.user.tag)
})

client.on('message', (receivedMessage) => {
	if (receivedMessage.author == client.user) {
		return
	}
	if (receivedMessage.content.startsWith(".")) {
		processCommand(receivedMessage)
	}
})

function processCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(1)
	let splitCommand = fullCommand.split(" ")
	let primaryCommand = splitCommand[0]
	let arguments = splitCommand.slice(1)
	primaryCommand = primaryCommand.toLowerCase()

	switch(primaryCommand) {
		case 'recent':
			console.log('Input = '+primaryCommand)
			receivedMessage.channel.send("Input player id")
			break;
		default:
			console.log('Input = '+primaryCommand)
			let player_id = primaryCommand
			let player_url = "https://api.opendota.com/api/players/"+player_id
			let match_url = "https://api.opendota.com/api/players/"+player_id+"/recentMatches"
 			let hero_url = "https://api.opendota.com/api/heroes"
 			process(receivedMessage,player_url,match_url,hero_url,settings)
			break;	
	}
}

function process(receivedMessage,player_url,match_url,hero_url,settings) {

	req(player_url, settings)
		.then(res => res.json())
		.then((json) => {
			var string = JSON.stringify(json)
			var obj = JSON.parse(string)
			receivedMessage.channel.send("Account Name: "+obj['profile']['personaname']+"\nMMR Estimate: "+obj['mmr_estimate']['estimate'])
		})

	req(match_url, settings)
		.then(res => res.json())
		.then((json) => {
			var string = JSON.stringify(json)
			var obj = JSON.parse(string)
			receivedMessage.channel.send("Recent Match Id: "+obj['0']['match_id']+"\nKill: "+obj['0']['kills']+"\nDeaths: "+obj['0']['deaths']+"\nAssists: "+obj['0']['assists']+"\nLast hits: "+obj['0']['last_hits'])
		})

	getHero(receivedMessage,match_url,hero_url,settings)
}

function getHero(receivedMessage,match_url,hero_url,settings) {

	var hero_id
	let hero_name
	req(match_url, settings)
		.then(res => res.json())
		.then((json) => {
			var string = JSON.stringify(json)
			var obj = JSON.parse(string)
			hero_id = obj['0']['hero_id']
		})
	req(hero_url, settings)
		.then(res => res.json())
		.then((json) => {
			var string = JSON.stringify(json)
			var obj = JSON.parse(string)
			for(var i = 0;i<=118;i++) {
				var id = obj[i]['id']
				if (id+1 == hero_id) {
					hero_name = obj[i+1]['localized_name']
					console.log(hero_name)
					receivedMessage.channel.send("Hero: "+hero_name)
					break
				}
			}
		})

}

client.login("ISI_TOKEN_BOT_DISCORD")
