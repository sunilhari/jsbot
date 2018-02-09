'use strict';

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var Telegraf = require('telegraf');
var app = new Telegraf(process.env.ENV_BOT_TOKEN);
var expressServer = (0, _express2.default)();
var PORT = process.env.PORT || 3000;
var commands = ['flush', 'help', 'context'];
var sandbox = {};
var handleCommands = function handleCommands(ctx) {
  var command = ctx.message.text;
  switch (command) {
    case '/flush':
      sandbox = {};
      return ctx.reply('Cleared JS Context');
      break;
    case '/help':
      return ctx.reply('/flush:To clear Javascript Context./help:For help./start:To Start./context:To see Current Js Context');
      break;
    case '/context':
      return ctx.reply(_util2.default.inspect(sandbox));
      break;
    default:
      return ctx.reply('Unknown Command Specified.Try /help for available commands');
  }
};
_vm2.default.createContext(sandbox);
app.start(function (ctx) {
  return ctx.reply('Welcome ' + ctx.from.first_name + '.Type in Code.I mean Only Code!! :)');
});

app.command(commands, handleCommands);
app.on('text', function (ctx) {
  console.log(ctx.message.text);
  var result = void 0;
  try {
    result = _vm2.default.runInContext('' + ctx.message.text, sandbox);
  } catch (e) {
    return ctx.reply("");
  }
  return result ? ctx.reply(result) : ctx.reply(':)');
});

app.catch(function (err) {
  console.log('Unexpected Error Occured');
});

app.on('message', function (ctx) {
  return ctx.reply('Unknown Command Specified.Try /help for available commands');
});
expressServer.listen(PORT, function () {
  console.log('Node app is running on port', PORT);
});
app.startPolling();
