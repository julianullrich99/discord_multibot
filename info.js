const Discord = require("discord.js")

class FlipBot{
  constructor(client){
    this.client = client;
    this.command = "!orangensaft";
  }

  start(){
    this.client.on("message",msg=>{
      if (msg.content.startsWith(this.command)){
        var reply = new Discord.MessageEmbed().setColor("#0099ff")
          .setTitle(`Orangensaft`)
          .setFooter("Multibot von Julian Ullrich");

          reply.addField("Orangensaft:", "Moin, Servus und Gurken Tag! Ich bin der Multivitaminsaft. Gesund und lecker. Ich helfe dir bei allem was man braucht.\n\nHier mal eine Liste mit allen aktuellen Bots die ich so bin:");

          reply.addField("!flip", "Coinflip halt...")
          reply.addField("!1", "EINS IN DEN CHAT, EINS, EINS IN DEN CHAT (mods können sogar mehrere einsen senden 😎)")
          reply.addField("!ehre", "Gib anderen Leuten Ehre (!ehre @julian) wenn die was cooles gemacht haben, nimms wieder weg (!ehrenlos @anton) und guck dir die Liste an (!ehre). (ICH WILL DER ALLERBESTE SEIN!)")
          reply.addField("!cute", "Wenn der Prof besonders cute ist... (!cute help)")
          reply.addField("!cringe", "Naja, das gleiche nur mit cringe halt... (!cringe help)")
          reply.addField("!alert", "Kann leute anstupsen und antworten wenn bestimmte Wörter fallen. Hihi lustig. (!alert help)")

        msg.reply(reply);

      }
    })
    
  }
}

module.exports = FlipBot;
