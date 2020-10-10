class DeleteBot{
  constructor(client){
    this.client = client;
    this.deleteChannels = ["764172794509918239"];
  }

  start(){
    this.client.on("message",msg=>{
      //console.log("msg",msg.content);
      //console.log("channel",msg.channel.id);
      if (this.deleteChannels.indexOf(msg.channel.id) > -1){
        //console.log("message is in channel");
        msg.delete();
      }
    })
    
  }

}

module.exports = DeleteBot;
