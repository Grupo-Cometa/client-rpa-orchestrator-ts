"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQServer = void 0;
const amqplib_1 = require("amqplib");
class RabbitMQServer {
    uri;
    // private conn!: Connection;
    // private channel!: Channel;
    constructor(uri) {
        this.uri = uri;
    }
    // private async connect(): Promise<void> {
    //   this.conn = await connect(this.uri);
    //   this.channel = await this.conn.createChannel();
    // }
    // public async disconnect(): Promise<void> {
    //   await this.channel?.close();
    //   await this.conn?.close();
    // }
    async publish(queue, message) {
        const conn = await (0, amqplib_1.connect)(this.uri);
        const channel = await conn.createChannel();
        await channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(message));
        setTimeout(function () {
            conn.close();
        }, 500);
    }
}
exports.RabbitMQServer = RabbitMQServer;
