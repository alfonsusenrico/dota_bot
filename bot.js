const Discord = require('discord.js')
const client = new Discord.Client()
const req = require('node-fetch')
const fs = require('fs')

let settings = { method: "Get" }

client.on('ready', () => {
	console.log("Connected as " + client.user.tag)
})

client.on('message', (receivedMessage) => {
	if (receivedMessage.author == client.user) {
		return
	}
	if (receivedMessage.content.startsWith(".")) {
		if(receivedMessage.content === ".") {
			receivedMessage.channel.send("Command tidak dikenali, silahkan gunakan command '.help'")
		}
		else {
		processCommand(receivedMessage)
		}
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
		case 'help':
			receivedMessage.channel.send("Command yang tersedia:\n1. recent")
			break;
		default:
			console.log('Input = '+primaryCommand)
			let player_id = primaryCommand
			let player_url = "https://api.opendota.com/api/players/"+player_id
			let match_url = "https://api.opendota.com/api/players/"+player_id+"/recentMatches"
 			let hero_url = "https://api.opendota.com/api/heroes"
 			process(receivedMessage,player_url,match_url,hero_url,player_id,settings)
 			break;	
	}
}

function process(receivedMessage,player_url,match_url,hero_url,player_id,settings) {

	getPlayer(receivedMessage,player_url,settings)

	getHero(receivedMessage,match_url,hero_url,settings)

	getMatch(receivedMessage,match_url,player_id,settings)


}

function getPlayer(receivedMessage,player_url,settings) {

	req(player_url, settings)
		.then(res => res.json())
		.then((json) => {
			var string = JSON.stringify(json)
			var obj = JSON.parse(string)
			receivedMessage.channel.send("Account Name: "+obj['profile']['personaname']+"\nMMR Estimate: "+obj['mmr_estimate']['estimate'])
		
		})
}

function getMatch(receivedMessage,match_url,player_id,settings) {
	var m_id
	req(match_url, settings)
		.then(res => res.json())
		.then((json) => {
			var string = JSON.stringify(json)
			var obj = JSON.parse(string)
			m_id = obj['0']['match_id']
			receivedMessage.channel.send("Recent Match Id: "+obj['0']['match_id']+"\nKill: "+obj['0']['kills']+"\nDeaths: "+obj['0']['deaths']+"\nAssists: "+obj['0']['assists']+"\nLast hits: "+obj['0']['last_hits'])

			let item_url = "https://api.opendota.com/api/matches/"+m_id
			let name_url = "http://jsonviewer.stack.hu/#https://raw.githubusercontent.com/joshuaduffy/dota2api/master/dota2api/ref/items.json"

			req(item_url, settings)
				.then(rs => rs.json())
				.then((jsn) => {
					var item1
					var item2
					var item3
					var item4
					var item5
					var item6
					var bp1
					var bp2
					var bp3
					var string1 = JSON.stringify(jsn)
					var obj1 = JSON.parse(string1)
					for(var i = 0;i<10;i++) {
						if(obj1['players'][i]['account_id'] == player_id) {
							item1 = obj1['players'][i]['item_0']
							item2 = obj1['players'][i]['item_1']
							item3 = obj1['players'][i]['item_2']
							item4 = obj1['players'][i]['item_3']
							item5 = obj1['players'][i]['item_4']
							item6 = obj1['players'][i]['item_5']
							bp1 = obj1['players'][i]['backpack_0']
							bp2 = obj1['players'][i]['backpack_1']
							bp3 = obj1['players'][i]['backpack_2']
							break;
						}
					}
					fs.readFile('items.json', (err, data) => {
						if(err) throw err
						let item = JSON.parse(data)
						var co = 0;
						for(var i = 0;i<268;i++) {
							switch(item['items'][i]['id']) {
								case (item1):
									item1 = item['items'][i]['localized_name']
									co++
									break
								case (item2):
									item2 = item['items'][i]['localized_name']
									co++
									break
								case (item3):
									item3 = item['items'][i]['localized_name']
									co++
									break
								case (item4):
									item4 = item['items'][i]['localized_name']
									co++
									break
								case (item5):
									item5 = item['items'][i]['localized_name']
									co++
									break
								case (item6):
									item6 = item['items'][i]['localized_name']
									co++
									break
								case (bp1):
									bp1 = item['items'][i]['localized_name']
									co++
									break
								case (bp2):
									bp2 = item['items'][i]['localized_name']
									co++
									break
								case (bp3):
									bp3 = item['items'][i]['localized_name']
									co++
									break
							}
							if(co == 9) {
								break
							}
						}
						receivedMessage.channel.send("Item 1: "+item1+"\nItem 2: "+item2+"\nItem 3: "+item3+"\nItem 4: "+item4+"\nItem 5: "+item5+"\nItem 6: "+item6)
						receivedMessage.channel.send("Backpack Item 1: "+bp1+"\nBackpack Item 2: "+bp2+"\nBackpack Item 3: "+bp3)
					})
				})
			})
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
					receivedMessage.channel.send("Hero: "+hero_name)
					break
				}
			}
		})

}


function sleep(milliseconds) { 
    let timeStart = new Date().getTime(); 
    while (true) { 
      let elapsedTime = new Date().getTime() - timeStart; 
      if (elapsedTime > milliseconds) { 
        break; 
      } 
    } 
} 


client.login("")
