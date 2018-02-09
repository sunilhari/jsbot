'use strict'
import vm from 'vm';
import util from 'util'
import express from 'express'
import http from 'http'
require('dotenv').config()

const Telegraf = require('telegraf');
const app = new Telegraf(process.env.ENV_BOT_TOKEN);
const expressServer = express()
const PORT = process.env.PORT || 3000
const commands = ['flush', 'help', 'context']
let sandbox = {}
const handleCommands = (ctx) => {
  let command = ctx.message.text
  switch (command) {
    case '/flush':
      sandbox = {}
      return ctx.reply('Cleared JS Context')
      break;
    case '/help':
      return ctx.reply('/flush:To clear Javascript Context./help:For help./start:To Start./context:To see Current Js Context')
      break;
    case '/context':
      return ctx.reply(util.inspect(sandbox))
      break;
    default:
      return ctx.reply('Unknown Command Specified.Try /help for available commands')
  }
}

const keepAwake = () => {
  setInterval(function () {
    http.get("https://jscontextbot.herokuapp.com/");
  }, 300000); // every 5 minutes (300000)
}
vm.createContext(sandbox);
app.start((ctx) => {
  return ctx.reply(`Welcome ${ctx.from.first_name}.Type in Code.I mean Only Code!! :)`)
})

app.command(commands, handleCommands)
app.on('text', (ctx) => {
  console.log(ctx.message.text);
  let result;
  try {
    result = vm.runInContext(`${ctx.message.text}`, sandbox);
  } catch (e) {
    return ctx.reply("")
  }
  return result ? ctx.reply(result) : ctx.reply(':)')
})

app.catch((err) => {
  console.log('Unexpected Error Occured')
})

app.on('message', (ctx) => {
  return ctx.reply('Unknown Command Specified.Try /help for available commands')
})
expressServer.get('/', (req, res) => {
  res.sendfile('index.html', { root: __dirname });
})
expressServer.listen(PORT, function () {
  console.log('Node app is running on port', PORT);
});
app.startPolling();

keepAwake();

