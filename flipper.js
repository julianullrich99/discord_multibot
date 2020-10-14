class FlipBot{
  constructor(client){
    this.client = client;
    this.command = "!flip";
  }

  start(){
    this.client.on("message",msg=>{
      //console.log("msg",msg.content);
      //console.log("channel",msg.channel.id);
      if (msg.content.startsWith(this.command)){
        //console.log("message is in channel");
        //msg.delete();
	msg.reply("Flipping coin.... Marcel wollte das so.");
	setTimeout(() => {
	  let result = this.flip();
	  msg.reply((result) ? "Kopf" : "Zahl");
	  msg.reply("Achtung, Glücksspiel kann süchtig machen! Benutzung auf eigene Gefahr und ab 18!");
	  msg.reply("Sponsored by: RAID Shadow Legends! PLAY NOW! https://raidshadowlegends.com/");
	},2000);
	
      }
    })
    
  }
	
  flip(){
    return (Math.random() > 0.5);
  }

}

module.exports = FlipBot;
