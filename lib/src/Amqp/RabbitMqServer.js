"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQServer = void 0;
const amqplib_1 = require("amqplib");
class RabbitMQServer {
    uri;
    conn;
    channel;
    constructor(uri) {
        this.uri = uri;
    }
    async connect() {
        this.conn = await (0, amqplib_1.connect)(this.uri);
        this.channel = await this.conn.createChannel();
    }
    async disconnect() {
        await this.channel?.close();
        await this.conn?.close();
    }
    async publish(queue, message) {
        await this.connect();
        await this.channel?.assertQueue(queue, {
            durable: false
        });
        await new Promise((resolve) => {
            this.channel?.sendToQueue(queue, Buffer.from(message));
            setTimeout(() => {
                resolve();
                this.disconnect();
            }, 500);
        });
    }
}
exports.RabbitMQServer = RabbitMQServer;
