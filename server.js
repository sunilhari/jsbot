"use strict";

var _vm = require("vm");

var _vm2 = _interopRequireDefault(_vm);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _standalone = require("@babel/standalone");

var Babel = _interopRequireWildcard(_standalone);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();

var Telegraf = require("telegraf");
var app = new Telegraf(process.env.ENV_BOT_TOKEN);
var expressServer = (0, _express2.default)();
var PORT = process.env.PORT || 3000;
var commands = ["flush", "help", "context"];
var sandbox = {};
var handleCommands = function handleCommands(ctx) {
  var command = ctx.message.text;
  switch (command) {
    case "/flush":
      sandbox = {};
      return ctx.reply("Cleared JS Context");
      break;
    case "/help":
      return ctx.reply("/flush:To clear Javascript Context./help:For help./start:To Start./context:To see Current Js Context");
      break;
    case "/context":
      return ctx.reply(_util2.default.inspect(sandbox));
      break;
    default:
      return ctx.reply("Unknown Command Specified.Try /help for available commands");
  }
};
var getTranspiledCode = function getTranspiledCode(code) {
  return Babel.transform(code, { presets: ["es2015"] }).code;
};
_vm2.default.createContext(sandbox);
app.start(function (ctx) {
  return ctx.reply("Welcome " + ctx.from.first_name + ".Type in Code!! :)");
});
console.log('welcome');
app.command(commands, handleCommands);
app.on("text", function (ctx) {
  var transpiledCode = getTranspiledCode(ctx.message.text);
  console.log(transpiledCode);
  var result = void 0;
  try {
    result = _vm2.default.runInContext("" + transpiledCode, sandbox);
  } catch (e) {
    return ctx.reply("");
  }
  return result ? ctx.reply(result) : ctx.reply(":( Sorry.Guess am not that smart as you are.");
});

app.catch(function (err) {
  console.log("Unexpected Error Occured");
});

app.on("message", function (ctx) {
  return ctx.reply("Unknown Command Specified.Try /help for available commands");
});
expressServer.get("/", function (req, res) {
  res.sendfile("public/index.html", { root: __dirname });
});
expressServer.listen(PORT, function () {
  console.log("Node app is running on port", PORT);
});
app.startPolling();
