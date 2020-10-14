class bot{
  constructor(client){
    this.client = client;
    this.command = "!1";
  }

  start(){
    this.client.on("message",msg=>{
      //console.log("msg",msg.content);
      //console.log("channel",msg.channel.id);
      if (msg.content.startsWith(this.command)){
        //console.log("message is in channel");
        //msg.delete();
	msg.reply("1");
	
      }
    })
    
  }

}

module.exports = bot;
