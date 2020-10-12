const { Message } = require("discord.js");

class MultiDelete{
  constructor(client){
    this.client = client;
    this.minRoles = ["Moderator","CEO"];
    this.command = "!multidelete";
  }

  start(){
    this.client.on("message",msg=>{
      if (msg.content.startsWith(this.command)){
        var command = msg.content.split(" ");
        console.log(command,command.length);
        if (command.length != 3) {
          msg.reply("Syntax: \n ``!multidelete startNachrichtenId endNachrichtenId``");
        } else {
          if (msg.member.roles.cache.some(r=>this.minRoles.includes(r.name)) ){
            msg.reply("ok");
            console.log("deleting multiple messages");
            var start = command[1];
            var end = command[2];
            if (end < start) {
              msg.reply("Die end-id muss größer sein als die start-id");
              console.log("error: end id cant be smaller than start id");
            }
            msg.channel.messages.fetch().then(messages => {
              messages.forEach(element => {
                if ((+element.id).between(start,end)) {
                  console.log(element.content);
                  element.delete();
                }
              });
              console.log("done");
            }).catch(console.error);
          } else {
            msg.reply("Du hast nicht die nötigen Rechte. Schade für dich.");
            console.log("not authorized to delete multiple messages");
          }
        }
      }
    })
    
  }

}

module.exports = MultiDelete;

Number.prototype.between = function (a,b){
  return (this >= a && this <= b && a <= b);
}