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
    close() {
        if (this.socketConnection.readyState == ws_1.WebSocket.OPEN)
            this.socketConnection.close();
    }
    async sleep(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
    sendMessage(data, callback) {
        const socket = this.connection();
        const body = {
            channel: this.channel,
            type: "publish",
            data
        };
        const strBody = JSON.stringify(body);
        socket.onopen = async () => {
            await this.sleep(300);
            if (socket.readyState != ws_1.WebSocket.OPEN)
                return;
            socket.onmessage = async (message) => {
                //@ts-ignore
                const response = JSON.parse(message.data);
                if (callback)
                    callback(response);
                socket.close();
                await this.sleep(300);
                if (this.socketConnection.readyState == ws_1.WebSocket.OPEN)
                    this.socketConnection.close();
            };
            socket.send(strBody);
        };
        socket.onclose = (_) => {
            socket.close();
        };
        socket.onerror = (_) => {
            socket.close();
        };
    }
    onMessage(callback) {
        const body = {
            channel: this.channel,
            type: 'subscribe',
        };
        this.socketConnection.onclose = (_) => {
            console.log('close channel:', this.channel);
            setTimeout(() => {
                console.log('tentando conectar onCLose');
                this.socketConnection = this.connection();
                this.onMessage(callback);
            }, 5000);
        };
        this.socketConnection.onerror = (_) => {
            this.socketConnection.close();
            console.log('tentando conectar onError');
        };
        this.socketConnection.onmessage = (message) => {
            //@ts-ignore
            const response = JSON.parse(message.data);
            if (response?.statusCode === 101) {
                return true;
            }
            return callback(response);
        };
        if (this.socketConnection.readyState === ws_1.WebSocket.OPEN) {
            this.socketConnection.send(JSON.stringify(body));
            setInterval(() => {
                this.socketConnection.send(JSON.stringify(body));
            }, 30000);
            return;
        }
        this.socketConnection.onopen = () => {
            this.socketConnection.send(JSON.stringify(body));
            setInterval(() => {
                this.socketConnection.send(JSON.stringify(body));
            }, 30000);
        };
    }
}
exports.WebSocketClient = WebSocketClient;
