"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = void 0;
const ws_1 = require("ws");
class WebSocketClient {
    channel;
    socketConnection;
    constructor(channel) {
        this.channel = channel;
        this.socketConnection = this.connection();
    }
    connection() {
        const socket = new ws_1.WebSocket(process.env.WS_URL, { handshakeTimeout: 60000, sessionTimeout: -1 });
        return socket;
    }
    sendMessage(data, callback) {
        const socket = this.connection();
        const body = {
            channel: this.channel,
            type: "publish",
            data
        };
        const strBody = JSON.stringify(body);
        socket.onopen = () => {
            socket.onmessage = async (message) => {
                //@ts-ignore
                const response = JSON.parse(message.data);
                if (callback)
                    return callback(response);
                socket.close();
            };
            if (socket.readyState === ws_1.WebSocket.OPEN)
                return socket.send(strBody);
        };
    }
    onMessage(callback) {
        const body = {
            channel: this.channel,
            type: 'subscribe',
        };
        this.socketConnection.onopen = () => {
            this.socketConnection.onmessage = (message) => {
                //@ts-ignore
                const response = JSON.parse(message.data);
                if (response?.statusCode === 101) {
                    return true;
                }
                return callback(response);
            };
            if (this.socketConnection.readyState === ws_1.WebSocket.CONNECTING) {
                this.socketConnection.close();
            }
            this.socketConnection.send(JSON.stringify(body));
            setInterval(() => {
                this.socketConnection.send(JSON.stringify(body));
            }, 30000);
        };
    }
}
exports.WebSocketClient = WebSocketClient;