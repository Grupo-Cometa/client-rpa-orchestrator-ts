"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogSocket = void 0;
const WebSocketClient_1 = require("./WebSocketClient");
class LogSocket {
    static send(log) {
        try {
            const socket = new WebSocketClient_1.WebSocketClient(`logs.${process.env.PUBLIC_ID}`);
            socket.sendMessage(log);
        }
        catch (error) {
        }
    }
}
exports.LogSocket = LogSocket;
