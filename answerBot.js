class bot{
  constructor(client){
    this.client = client;
    this.command = "!setchannel";
    //this.answerUsers = [];
    this.answerUsers = ["jukisu#3394","Elora#4431"];
    this.channels = {};
  }

  start(){
    this.client.on("message",msg=>{
      if (this.answerUsers.indexOf(msg.author.tag) == -1 || msg.guild !== null) return;
      //console.log("channel",msg.channel.id);
      if (msg.content.startsWith(this.command)){
        this.channels[msg.author.tag] = msg.content.split(" ")[1];
      } else {
        if (!this.channels.hasOwnProperty(msg.author.tag)) {
          msg.reply("Kein Channel gesetzt");
        } else {
	  try {
            this.client.channels.cache.get(this.channels[msg.author.tag]).send(msg.content);
	  } catch (err) {
	    msg.reply("error. evtl ist der channel nicht richtig?");
	  }
        }
      }
    })

  }

}

module.exports = bot;

