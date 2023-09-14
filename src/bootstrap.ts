#!/usr/bin/env node
const Main = require(process.cwd() + '\\src\\Main');
import { WebSocketClient } from "./WebSocket/WebSocketClient";
import 'dotenv/config';

const main = new Main.Main();

const socketStatus = new WebSocketClient(`status.${process.env.PUBLIC_ID}`);
const socketStart = new WebSocketClient(`start.${process.env.PUBLIC_ID}`);
const socketStop = new WebSocketClient(`stop.${process.env.PUBLIC_ID}`);

setInterval(() => {
    socketStatus.sendMessage(main.publishStatus())
}, 3500)

socketStart.onMessage(async () => {
    await main.start();  
})

socketStop.onMessage(async () => {
    await main.stop();    
})
