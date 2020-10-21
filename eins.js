class bot{
  constructor(client){
    this.client = client;
    this.command = "!1";
    this.roles = ["Moderator","1"];
  }

  start(){
    this.client.on("message",msg=>{
      //console.log("msg",msg.content);
      //console.log("channel",msg.channel.id);
      if (msg.content.startsWith(this.command)){
        if (!msg.member.roles.cache.some(r=>this.roles.includes(r.name)) ) return;
        var command = msg.content.split(" ");
        var count = (isNaN(+command[1])) ? 1 : +command[1];
	var customMessage = "1";
	if (command.hasOwnProperty(2)){
		command.splice(0,2);
		customMessage = command.join(" ");
	}
        if (count > 100) count = 100;
        for (var i = 0; i < count; i++) 
	      msg.channel.send(customMessage);
	
      }
    })
    
  }

}

module.exports = bot;
