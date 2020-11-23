const Discord = require("discord.js");
class Bot{
  constructor(client){
    this.client = client;
    this.command = "!cringe";
    this.resetRoles = ["Moderator","CEO","SIMP"];
    this.maxCuteness = 100;
    this.currentCuteness = 0;
    this.barLength = 25;
    this.maxVotes = 10;
    this.currentVotes = [];
  }

  start(){
    this.client.on("message",msg=>{
      //console.log("msg",msg.content);
      //console.log("channel",msg.channel.id);
      if (msg.content.startsWith(this.command)){
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
	  } else msg.reply("Skala schon voll. Frage doch einen Mod oder Simp diese mit `!cringe reset` zurückzusetzen");
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
    var str;
    if (currPos >= 0)
    str = `Level: ${this.currentCuteness}/${this.maxCuteness}\n[${"=".repeat(currPos)}||${"=".repeat(this.barLength - currPos - 1)}]`; // hier minus eins weil der character in der mitte ja auch noch dazu kommt
    else
    str = `Level: ${this.currentCuteness}/${this.maxCuteness}\n||${"-".repeat(-currPos)}[${"=".repeat(this.barLength)}]`; // hier minus eins weil der character in der mitte ja auch noch dazu kommt
    channel.send(str);
    return true;
  }
  
  showHelp(channel){
    var reply = new Discord.MessageEmbed().setColor("#0099ff")
          .setTitle("Cringe-Bot Hilfe")
          .setFooter("Cringe-Bot von Julian Ullrich");

    reply.addFields({name:"Beschreibung",value:"Dieser Bot wurde - nach einer Idee von Niklas -  geschrieben um das Cringe-Level eines gewissen Kommollitonen zu tracken."},
          {name:"Befehle",value:"```!cringe -> erhöht den aktuellen Cringe um 1 und zeigt ihn an.\n\n!cringe - -> verringert den aktuellen Cringe um 1 und zeigt ihn an.\n\n!cringe show -> zeigt den aktuellen Cringe an.\n\n!cringe reset -> setzt den aktuellen Cringe auf 0 zurück und zeigt ihn an. Nur von Mods und Simps nutzbar.\n\n!cringe help -> zeigt diese Hilfe an.```"});

        channel.send(reply);
	
  }

}

module.exports = Bot;
