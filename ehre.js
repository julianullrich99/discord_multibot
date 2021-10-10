class bot{
  constructor(client){
    this.client = client;
    this.command = "!ehre";
    this.sqlite3 = require("sqlite3").verbose();
    this.db = new this.sqlite3.Database("ehre.sqlite",err=>{
      if (err) {
        console.log("Can't open database",err);
      } else {
        console.log("connected to db");;
      }
    });   
    this.discord = require("discord.js");
    this.lastHonors = [];
    this.timeout = 180;
  }

  start(){
    this.client.on("message",msg=>{

	//if (msg.content.startsWith("resetRoles")) {
		//msg.guild.members.fetch().then(m => {
			//m.forEach(e=>{
			//});
		//}).catch(console.error);
	//}

      if (msg.content.startsWith(this.command)){
        //if (!msg.member.roles.cache.some(r=>this.roles.includes(r.name)) ) return;
        var serverId = msg.guild.id || 0;
        var command = msg.content.split(" ");

        if (command.length == 1) {
          // get ehrenlist
          this.db.all("SELECT * FROM `data` WHERE `server` = ? ORDER BY `count` DESC, LOWER(`username`) ASC", [serverId], (err, result) => {
            if (err) {
              console.log("error getting data");
              msg.reply("fehler beim holen der Daten");
            } else {
              var reply = new this.discord.MessageEmbed().setColor("#0099ff")
                .setTitle(`Ehrenliste`)
                .setFooter("Ehrenbot von Julian Ullrich");
              var response = [];
              if (result.length > 0) {
                var list = {};
                var longest = 0;
                result.forEach(e => {
                  list[e.username] = +e.count;
                  if (e.username.length > longest) longest = e.username.length;
                });

                var responseLength = 0;
                for (var n in list) {
                  let next = `\`${n.padEnd(longest, " ")} ${(list[n]).toString().padStart(3)}\``;
                  if (responseLength + next.length <= 1000){
                    response.push(next);
                    responseLength += next.length + 1;
                  } else {
                    reply.addField("-", response.join("\n"));
                    response = [];
                    response.push(next);
                    responseLength = next.length + 1;
                  }
                }

                reply.addField("-", response.join("\n"));

                //response.sort((a,b)=>{return b.count - a.count;});
                //console.log(response);

              } else {
                reply.addField("Suche:", "Keine passenden Einträge gefunden. Schade :(");
              }

              msg.reply(reply);
            }
          });
        } else {

          var userId = msg.author.id;

          var flag = false; // flag wenn der grade gesuchte user schon getimeouted ist und gelöscht wurde und jetzt wieder schreiben darf
          for (var key in this.lastHonors){
            if (this.lastHonors.hasOwnProperty(key)){
              var user = this.lastHonors[key];
              if (user.time < (new Date()).getTime() - this.timeout * 1000){
                // wenn der schon getimeoutet ist dann soll der gelöscht werden
                this.lastHonors.splice(key,1);
                if (user.id == userId) flag = true;
              }
              if (user.id == userId && !flag) {
                console.log("user can't honor again after this short time");
                msg.reply(`Du kannst erst in ${((user.time + this.timeout * 1000) - (new Date()).getTime()) / 1000} Sekunden wieder ehren!`);
                return;
              }
            }
          }

          var mentions = msg.mentions.members;
          mentions.forEach(e=>{
            if (msg.author.id == e.user.id) {
              console.log("cant give honor to yourself");
              msg.reply("Du kannst dich nicht selber Ehren!");
            } else {

              var userid = e.user.id;
              var nickname = e.nickname || e.user.username;

              this.db.all("SELECT * FROM `data` WHERE `server` = ? and `user` = ?",[serverId,userid],(err,res)=>{
                if (err) {
                  console.log("error getting data");
                  msg.reply("error getting data");
                  return;
                } else {
                  if (res.length > 0){
                    // schon ein eintrag vorhanden
                    console.log("updating entry");
                    var currVal = +res[0].count;
                    if (command[0] == "!ehre") currVal++;
                    else if (command[0] == "!ehrenlos") currVal--;
                    console.log("newval:",currVal);
                    this.db.run("UPDATE `data` SET `count` = ?, `username` = ? WHERE `user` = ? AND `server` = ?",[currVal,nickname,userid,serverId],(err)=>{
                      if (err) {
                        console.log("error writing data");
                        msg.reply("error writing data");
                        return;
                      } else msg.reply(`Erfolg! neue Ehre ${nickname}: ${currVal}`);
                    });
                  } else {
                    // kein eintrag vorhanden
                    console.log("inserting new entry");
                    var currVal = 1;
                    if (command[0] == "!ehrenlos") currVal = -1;
                    this.db.run("INSERT INTO `data`(`user`,`server`,`count`,`username`) VALUES (?,?,?,?)",[userid,serverId,currVal,nickname],(err)=>{
                      if (err) {
                        console.log("error writing new data");
                        msg.reply("error writing new data");
                        return;
                      } else msg.reply(`Erfolg! neue Ehre ${nickname}: ${currVal}`);
                    });
                  }
		  // alles glatt gegangen -> rollen ändern, timeout setzen
		  this.lastHonors.push({id: userId, time: (new Date()).getTime()});

		  var inc = (command[0] == "!ehre");
                }
              });

            }
          });

        }


  	
      }
    })
    
  }

}

module.exports = bot;
