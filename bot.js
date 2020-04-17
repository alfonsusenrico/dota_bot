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
			receivedMessage.channel.send("Silahkan gunakan command '.help'")
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
			receivedMessage.channel.send("Command yang tersedia:\n1. recent\n2. help")
			break;
		default:

			if(isNaN(primaryCommand) == false) {
			console.log('Input = '+primaryCommand)
			let player_id = primaryCommand
			let player_url = "https://api.opendota.com/api/players/"+player_id
			let match_url = "https://api.opendota.com/api/players/"+player_id+"/recentMatches"
 			let hero_url = "https://api.opendota.com/api/heroes"
 			process(receivedMessage,player_url,match_url,hero_url,player_id,settings)	
 			}
 			else {
 				receivedMessage.channel.send("Command tidak dikenali, silahkan gunakan command '.help'")
 			}
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
							if(obj1['players'][i]['win'] == 1) {
								var win = 'Win'
							}
							else {
								var win = 'Lose'
							}
							if(obj1['players'][i]['isRadiant'] == true) {
								var team = 'Radiant'
							}
							else {
								var team = 'Dire'
							}
							receivedMessage.channel.send("Recent Match Id: "+obj1['match_id']+"\nTeam: "+team+"\nCondition: "+win+"\nKill: "+obj1['players'][i]['kills']+"\nDeaths: "+obj1['players'][i]['deaths']+"\nAssists: "+obj1['players'][i]['assists']+"\nLast hits: "+obj1['players'][i]['last_hits']+"\nDenies: "+obj1['players'][i]['denies']+"\nGPM: "+obj1['players'][i]['gold_per_min']+"\nXPM: "+obj1['players'][i]['benchmarks']['xp_per_min']['raw'])

							var party_size = obj1['players'][i]['party_size']
							var party_id = obj1['players'][i]['party_id']

							if(party_size > 1) { 
								if(i < 5) {
									for(var j = 0;j<5;j++) {
										if(obj1['players'][j]['party_id'] == party_id) {
											receivedMessage.channel.send("Party: "+obj1['players'][j]['personaname'])
										}
									}
								}
								else {
									for(var j = 5;j<10;j++) {
										if(obj1['players'][j]['party_id'] == party_id) {
											receivedMessage.channel.send("Party: "+obj1['players'][j]['personaname'])
										}
									}
								}
							}
							else {
								receivedMessage.channel.send("Solo Match")
							}
							break;
						}
					}
					fs.readFile('items.json', (err, data) => {
						if(err) throw err
						let item = JSON.parse(data)
						var co = 0;
						var i = 0;
						while (co != 9) {
							switch(item['items'][i]['id']) {
								case (item1):
									item1 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								case (item2):
									item2 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								case (item3):
									item3 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								case (item4):
									item4 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								case (item5):
									item5 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								case (item6):
									item6 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								case (bp1):
									bp1 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								case (bp2):
									bp2 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								case (bp3):
									bp3 = item['items'][i]['localized_name']
									co++
									i = 0;
									break
								default:
									i++
									break;
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
			console.log("hero_id = "+hero_id)
		})
	req(hero_url, settings)
		.then(res => res.json())
		.then((json) => {
			var string = JSON.stringify(json)
			var obj = JSON.parse(string)
			var i = 0;
			while(true) {
				if(obj[i]['id'] == undefined) {
					i++
				}
				else {
					var id = obj[i]['id']
				}
				if (id == hero_id) {
					console.log("id: "+id)
					hero_name = obj[i]['localized_name']
					break
				}
				else {
					i++
				}
			}
			receivedMessage.channel.send("Hero: "+hero_name)
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
