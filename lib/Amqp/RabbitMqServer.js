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
        try {
            this.conn = await (0, amqplib_1.connect)(this.uri);
            this.channel = await this.conn.createChannel();
        }
        catch (err) {
        }
    }
    async disconnect() {
        try {
            await this.channel?.close();
            await this.conn?.close();
        }
        catch (err) {
        }
    }
    async publish(queue, message) {
        try {
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
        catch (err) {
        }
    }
}
exports.RabbitMQServer = RabbitMQServer;
