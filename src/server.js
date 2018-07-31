"use strict";
import vm from "vm";
import util from "util";
import express from "express";
import * as Babel from "@babel/standalone";

require("dotenv").config();

const Telegraf = require("telegraf");
const app = new Telegraf(process.env.ENV_BOT_TOKEN);
const expressServer = express();
const PORT = process.env.PORT || 3000;
const commands = ["flush", "help", "context"];
let sandbox = {};
const handleCommands = ctx => {
  let command = ctx.message.text;
  switch (command) {
    case "/flush":
      sandbox = {};
      return ctx.reply("Cleared JS Context");
      break;
    case "/help":
      return ctx.reply(
        "/flush:To clear Javascript Context./help:For help./start:To Start./context:To see Current Js Context"
      );
      break;
    case "/context":
      return ctx.reply(util.inspect(sandbox));
      break;
    default:
      return ctx.reply(
        "Unknown Command Specified.Try /help for available commands"
      );
  }
};
const getTranspiledCode = code => {
  return Babel.transform(code, { presets: ["es2015"] }).code;
};
vm.createContext(sandbox);
app.start(ctx => {
  return ctx.reply(`Welcome ${ctx.from.first_name}.Type in Code!! :)`);
});
console.log('welcome');
app.command(commands, handleCommands);
app.on("text", ctx => {
  let transpiledCode = getTranspiledCode(ctx.message.text);
  let result;
  try {
    result = vm.runInContext(`${transpiledCode}`, sandbox);
  } catch (e) {
    return ctx.reply("");
  }
  return result
    ? ctx.reply(result)
    : ctx.reply(":( Sorry.Guess am not that smart as you are.");
});

app.catch(err => {
  console.log("Unexpected Error Occured");
});

app.on("message", ctx => {
  return ctx.reply(
    "Unknown Command Specified.Try /help for available commands"
  );
});
expressServer.get("/", (req, res) => {
  res.sendfile("public/index.html", { root: __dirname });
});
expressServer.listen(PORT, function() {
  console.log("Node app is running on port", PORT);
});
app.startPolling();
