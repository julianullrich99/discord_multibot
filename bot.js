#!/usr/bin/env node


require("dotenv").config();


const Discord = require("discord.js")
const client = new Discord.Client();

client.on("ready", ()=>{
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN)


const deleteBot = require("./deleteBot");
var delBot = new deleteBot(client);
delBot.start();

const multiDeleter = require("./multiDeleter");
var multiDeletebot = new multiDeleter(client);
multiDeletebot.start();

const flipper = require("./flipper");
var flipBot = new flipper(client);
flipBot.start();
