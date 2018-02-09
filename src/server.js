'use strict'
import vm from 'vm';
import util from 'util'
import express from 'express'
require('dotenv').config()

const Telegraf = require('telegraf');
const app = new Telegraf(process.env.ENV_BOT_TOKEN);
const expressServer = express()
const PORT = process.env.PORT || 3000
let sandbox = {}

vm.createContext(sandbox);
app.start((ctx) => {
  return ctx.reply(`Welcome ${ctx.from.first_name}.Type in Code.I mean Only Code!! :)`)
})

app.hears('/flush', (ctx) => {
  sandbox = {}
  return ctx.reply('Cleared JS Context')
})
app.hears('/context', (ctx) => {
  return ctx.reply(util.inspect(sandbox))
})
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
  console.log('Unexpected Error Occured', err)
})
app.hears('/commands', (ctx) => {
  return ctx.reply('/flush:To clear Javascript Context./commands:For help./start:To Start')
})

expressServer.listen(PORT, function () {
  console.log('Node app is running on port', PORT);
});
app.startPolling();


