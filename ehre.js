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
  }

  start(){
    this.client.on("message",msg=>{
      if (msg.content.startsWith(this.command)){
        //if (!msg.member.roles.cache.some(r=>this.roles.includes(r.name)) ) return;
        var serverId = msg.guild.id || 0;
        var command = msg.content.split(" ");

        if (command.length == 1) {
          // get ehrenlist
          this.db.all("SELECT * FROM `data` WHERE `server` = ?",[serverId],(err,result)=>{
            if (err) {
              console.log("error getting data");
              msg.reply("fehler beim holen der Daten");
            } else {
              var reply = new this.discord.MessageEmbed().setColor("#0099ff")
                .setTitle(`Ehrenliste`)
                .setFooter("Ehrenbot von Julian Ullrich");
              var response = [];
              if (result.length > 0){
                var list = {};
                result.forEach(e=>{
                  list[e.username] = e.count;
                })

                for (var n in list) response.push(`\`${n} - ${list[n]}\``);

                reply.addField("Ergebnis:",response.join("\n"));
              } else {
                reply.addField("Suche:","Keine passenden Einträge gefunden. Schade :(");
              }

              msg.reply(reply);
            }
          });
        } else {

          var mentions = msg.mentions.members;
          mentions.forEach(e=>{
            var userid = e.user.id;
            var nickname = e.nickname;

            this.db.all("SELECT * FROM `data` WHERE `server` = ? and `user` = ?",[serverId,userid],(err,res)=>{
              if (err) {
                console.log("error getting data");
                msg.reply("error getting data");
                return;
              } else {
                if (res.length > 0){
                  // schon ein eintrag vorhanden
                  console.log("updating entry");
                  var currVal = res[0].count;
                  currVal++;
                  console.log("newval:",currVal);
                  this.db.run("UPDATE `data` SET `count` = ?, `username` = ? WHERE `user` = ? AND `server` = ?",[currVal,nickname,userid,serverId],(err)=>{
                    if (err) {
                      console.log("error writing data");
                      msg.reply("error writing data");
                      return;
                    } else msg.reply(`Erfolg! neue Ehre: ${currVal}`);
                  });
                } else {
                  // kein eintrag vorhanden
                  console.log("inserting new entry");
                  var currVal = 1;
                  this.db.run("INSERT INTO `data`(`user`,`server`,`count`,`username`) VALUES (?,?,?,?)",[userid,serverId,currVal,nickname],(err)=>{
                    if (err) {
                      console.log("error writing new data");
                      msg.reply("error writing new data");
                      return;
                    } else msg.reply(`Erfolg! neue Ehre: ${currVal}`);
                  });
                }
              }
            });

          });

        }


  	
      }
    })
    
  }

}

module.exports = bot;
