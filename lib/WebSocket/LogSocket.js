"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogSocket = void 0;
const WebSocketClient_1 = require("./WebSocketClient");
class LogSocket {
    static send(log) {
        const soket = new WebSocketClient_1.WebSocketClient(`logs.${process.env.PUBLIC_ID}`);
        soket.sendMessage(log);
    }
}
exports.LogSocket = LogSocket;
