const Discord = require("discord.js");
class Bot{
  constructor(client){
    this.client = client;
    this.command = "!cute";
    this.altCommand = "!niedlich";
    this.resetRoles = ["Moderator","CEO"];
    this.maxCuteness = 100;
    this.currentCuteness = 0;
    this.barLength = 40;
    this.maxVotes = 3;
    this.currentVotes = [];
  }

  start(){
    this.client.on("message",msg=>{
      //console.log("msg",msg.content);
      //console.log("channel",msg.channel.id);
      if (msg.content.startsWith(this.command) || msg.content.startsWith(this.altCommand)){
        //console.log("message is in channel");
        //msg.delete();

	var command = msg.content.split(" ");

	if (command.length < 2) {
	  if (this.currentCuteness < this.maxCuteness) {
	    // hier wird gevoted
	    if (this.currentVotes.hasOwnProperty(msg.author.id)){
	      if (this.currentVotes[msg.author.id] >= this.maxVotes) {
		msg.reply("Du hast in diesem Run schon "+this.maxVotes+" mal gevoted. Mehr geht leider nicht.");
		return;
	      } else this.currentVotes[msg.author.id]++;
	    } else this.currentVotes[msg.author.id] = 1;
	    this.currentCuteness++;
	    this.showCuteness(msg.channel);
	  } else msg.reply("Skala schon voll. Frage doch einen Mod diese mit `!cute reset` zurückzusetzen");
	} else {
	  switch (command[1]) {
	    case "reset":
              if (!msg.member.roles.cache.some(r=>this.resetRoles.includes(r.name)) ) {
		msg.reply("das kann nur ein mod machen...");
		return;
	      }
	      this.currentVotes = [];
	      this.currentCuteness = 0;
	      this.showCuteness(msg.channel);

	      break;

	    case "show":
	      this.showCuteness(msg.channel);
	      break;

	    case "-":
	      if (this.currentVotes.hasOwnProperty(msg.author.id)){
	        if (this.currentVotes[msg.author.id] <= -this.maxVotes) {
		  msg.reply("Du hast in diesem Run schon "+this.maxVotes+" mal gevoted. Mehr geht leider nicht.");
		  return;
	        } else this.currentVotes[msg.author.id]--;
	      } else this.currentVotes[msg.author.id] = -1;
	      this.currentCuteness--;
	      this.showCuteness(msg.channel);
	      break;

	    case "help":
	      this.showHelp(msg.channel);
	      break;
	
	  }
	}
      }
    })
  }

  showCuteness(channel){
    var currPos = this.currentCuteness / this.maxCuteness * this.barLength;
    if (currPos < 0) currPos = 0;
    var str = `[${"=".repeat(currPos)}||${"=".repeat(this.barLength - currPos - 1)}] Level: ${this.currentCuteness}/${this.maxCuteness}`; // hier minus eins weil der character in der mitte ja auch noch dazu kommt
    channel.send(str);
    return true;
  }
  
  showHelp(channel){
    var reply = new Discord.MessageEmbed().setColor("#0099ff")
          .setTitle("Cuteness-Bot Hilfe")
          .setFooter("Cuteness-Bot von Julian Ullrich");

    reply.addFields({name:"Beschreibung",value:"Dieser Bot wurde - nach einer Idee von Darius -  geschrieben um die Cuteness verschiedener Profs zu tracken."},
          {name:"Befehle",value:"```!cute -> erhöht die aktuelle cuteness um 1 und zeigt sie an.\n\n!cute - -> verringert die aktuelle cuteness um 1 und zeigt sie an.\n\n!cute show -> zeigt die aktuelle cuteness an.\n\n!cute reset -> setzt die aktuelle cuteness auf 0 zurück und zeigt sie an. Nur von Mods nutzbar.\n\n!cute help -> zeigt diese Hilfe an.```"});
    reply.addFields({name:"Alias",value:"```!niedlich``` kann als Alias für ```!cute``` genutzt werden."});

        channel.send(reply);
	
  }

}

module.exports = Bot;
