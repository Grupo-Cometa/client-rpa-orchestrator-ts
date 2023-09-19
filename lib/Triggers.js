"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Triggers = void 0;
const WebSocketClient_1 = require("./WebSocket/WebSocketClient");
class Triggers {
    async start(callback) {
        const socketStart = new WebSocketClient_1.WebSocketClient(`start.${process.env.PUBLIC_ID}`);
        socketStart.onMessage(async () => {
            await callback();
        });
    }
    async stop(callback) {
        const socketStop = new WebSocketClient_1.WebSocketClient(`stop.${process.env.PUBLIC_ID}`);
        socketStop.onMessage(async () => {
            await callback();
        });
    }
}
exports.Triggers = Triggers;
