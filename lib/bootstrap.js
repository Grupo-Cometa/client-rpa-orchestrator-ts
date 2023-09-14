#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main = require(process.cwd() + '\\src\\Main');
const WebSocketClient_1 = require("./WebSocket/WebSocketClient");
require("dotenv/config");
const main = new Main.Main();
const socketStatus = new WebSocketClient_1.WebSocketClient(`status.${process.env.PUBLIC_ID}`);
const socketStart = new WebSocketClient_1.WebSocketClient(`start.${process.env.PUBLIC_ID}`);
const socketStop = new WebSocketClient_1.WebSocketClient(`stop.${process.env.PUBLIC_ID}`);
setInterval(() => {
    socketStatus.sendMessage(main.publishStatus());
}, 3500);
socketStart.onMessage(async () => {
    await main.start();
});
socketStop.onMessage(async () => {
    await main.stop();
});
