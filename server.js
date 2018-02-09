'use strict';

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var Telegraf = require('telegraf');
var app = new Telegraf(process.env.ENV_BOT_TOKEN);
var sandbox = {};
_vm2.default.createContext(sandbox);
app.start(function (ctx) {
  return ctx.reply('Welcome ' + ctx.from.first_name + '.Type in Code.I mean Only Code!! :)');
});

app.command('flush', function (ctx) {
  sandbox = {};
  return ctx.reply('Cleared JS Context');
});
app.on('text', function (ctx) {
  console.log(ctx.message.text);
  var result = void 0;
  try {
    result = _vm2.default.runInContext('' + ctx.message.text, sandbox);
  } catch (e) {
    return ctx.reply("");
  }
  console.log(result);
  console.log(_util2.default.inspect(sandbox));
  return result ? ctx.reply(result) : ctx.reply('Ok');
});

app.catch(function (err) {
  console.log('Unexpected Error Occured', err);
});
app.command('help', function (ctx) {
  return ctx.reply('/flush:To clear Javascript Context./help:For help./start:To Start');
});
app.startPolling();
