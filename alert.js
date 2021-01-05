class bot{
	constructor(client){
		this.client = client;
		this.sqlite3 = require("sqlite3").verbose();
		this.db = new this.sqlite3.Database("alert.sqlite",err=>{
			if (err) {
				console.log("Can't open database",err);
			} else {
				console.log("connected to db");;
			}
		});   
		this.discord = require("discord.js");
		this.command = "!alert";
		this.fuzzy = require("fuzzy");
		this.filters = {};
}

	start(){
		this.client.on("message",msg=>{
			console.log(msg.content);

			//if (msg.author.tag == "Elora#4431") msg.react("778934956625887243");
			//if (msg.author.tag == "jukisu#3394") msg.react("778934956625887243");

			if (msg.content.startsWith(this.command)){
				//if (!msg.member.roles.cache.some(r=>this.roles.includes(r.name)) ) return;
				var serverId = (msg.hasOwnProperty('guild')) ? msg.guild.id : 0;
				var command = msg.content.split(" ");

				switch (command[1]){
					case "add":
						// add new alert command: !alert add @user query,words,serperated,by,comma
						if (command.length != 4) {
							msg.reply("syntax: `!alert add @user query,serperated,by,commas`");
							return;
						}
						var i = 0;
						msg.mentions.members.forEach(u=>{
							if (i) return;
							var userId = u.user.id;
							this.db.run("INSERT INTO `data`(server,query,answer,pinguser) VALUES (?,?,'',?)",[serverId,command[3],userId],(err,res)=>{
								if (err) {
									msg.reply("error inserting data");
									return;
								} else msg.reply("erfolg mein sohn. das läuft ja wie am schnürchen!");
							});
							i++;
						});
						this.initFilter(msg);
						break;

					case "del":
						if (command.length != 3) {
							msg.reply("syntax: `!alert id`");
							return;
						}
						var id = command[2];
						this.db.run("DELETE FROM `data` WHERE `id` = ? AND `server` = ?",[id,serverId],(err,res)=>{
							if (err) {
								msg.reply("error deleting data");
								return;
							} else msg.reply("erfolg mein sohn. das läuft ja wie am schnürchen!");
						});
						this.initFilter(msg);
						break;

					case "list":
						this.db.all("SELECT * FROM `data` WHERE `server` = ? AND `pinguser` != ''",[serverId],(err,res)=>{
							if (err) {
								msg.reply("error getting data");
								return;
							} else {
								var ret = [];
								res.forEach(e=>{
									ret.push(`${e.id} - <@!${e.pinguser}> - ${e.query}`);
								});
								if (ret.length == 0) ret = ["keine Einträge"];
								msg.channel.send(ret.join("\n"));
							}
						});
						this.db.all("SELECT * FROM `data` WHERE `server` = ? AND `answer` != ''",[serverId],(err,res)=>{
							if (err) {
								msg.reply("error getting data");
								return;
							} else {
								var ret = [];
								res.forEach(e=>{
									ret.push(`${e.id} - ${e.answer} - ${e.query}`);
								});
								if (ret.length == 0) ret = ["keine Einträge"];
								msg.channel.send(ret.join("\n"));
							}
						});
						break;

					case "answer":
						if (command.length < 4) {
							msg.reply("syntax: `!alert add query,serperated,by,commas answer with spaces`");
							return;
						}
						var i = 0;
						var q = command[2];
						command.splice(0,3);
						var text = command.join(" ");
						this.db.run("INSERT INTO `data`(server,query,answer,pinguser) VALUES (?,?,?,'')",[serverId,q,text],(err,res)=>{
							if (err) {
								msg.reply("error inserting data");
								return;
							} else msg.reply("erfolg mein sohn. das läuft ja wie am schnürchen!");
						});
						this.initFilter(msg);
						break;
						

					case "init":
						this.initFilter(msg);
						break;

					default:
						this.getHelp(msg);
						break;
							

						
						
							

				}


			} else this.filterMessage(msg);
		})

	}


	filterMessage(msg){

		if (msg.author.id == this.client.user.id) return;

		var serverId = (msg.hasOwnProperty('guild')) ? msg.guild.id : 0;

		var message = msg.content.toLowerCase();
		
		if (!this.filters.hasOwnProperty(serverId)) return;
	
		var skip = false;
		
		this.filters[serverId].forEach(e => {
			if (skip) return;
			console.log("filter:",e);
			var q = e.query.split(",");
			console.log("q;",q);
			console.log("text:",message);
			var res = this.filter(message,q);
			console.log("filter:",res);
			if (res){
				if (e.pinguser != "") msg.channel.send(`<@!${e.pinguser}> ping`);
				else msg.channel.send(e.answer);

			}		
		})



	} 

	filter(msg,q){
		for (var qu of q) {
			console.log("qu:",qu);
			if (!msg.includes(qu)) return false;
		}
		return true;

	}
	
	initFilter(msg){
		var serverId = (msg.hasOwnProperty('guild')) ? msg.guild.id : 0;
		this.filters[serverId] = [];
		this.db.all("SELECT * FROM `data` WHERE `server` = ?",[serverId],(err,res)=>{
			if (err) {
				msg.reply("error getting data");
				return;
			} else {
				var ret = [];
				res.forEach(e=>{
					this.filters[serverId].push(e);
				});
				msg.reply("done");
			}
		});

	}

	getHelp(msg){
		
		var reply = new this.discord.MessageEmbed().setColor("#0099ff")
		  .setTitle("Alert-Bot Hilfe")
		  .setFooter("Alert-Bot von Julian Ullrich");

		reply.addFields({name:"Beschreibung",value:"Dieser Bot untersucht jede gesendete Nachricht mittels einer Volltextsuche um bestimmte Suchqueries zu finden."},
		  {name:"Befehle",value:"```!alert list -> Zeigt alle aktiven Alerts mit deren ID an.\n\n!alert init -> Initialisiert den Bot. Das ist nur einmal nach dem Neustarten des Bots notwendig.\n\n!alert add @user kewords,serparated,by,comma -> Erstellt einen neuen Alert und initialisiert diesen. Der User wird mit @ angesprochen, der Suchstring wird mit Komma statt Leerzeichen getrennt.\n\n!alert answer keywords,separated,by,comma Antwort als text -> Erstellt eine neue automatische Antwort für den Server.\n\n!alert del id -> Löscht den Alert/die automatische Antwort mit der angegebenen ID (aus !alert list).\n\n!alert -> zeigt diese Hilfe an.```"});

		msg.channel.send(reply);
	}


}

module.exports = bot;
