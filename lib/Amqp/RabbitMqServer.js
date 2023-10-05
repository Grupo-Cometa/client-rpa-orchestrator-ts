"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQServer = void 0;
const amqplib_1 = require("amqplib");
class RabbitMQServer {
    uri;
    constructor(uri) {
        this.uri = uri;
    }
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
    async consume(queue, callback) {
        const conn = await (0, amqplib_1.connect)(this.uri);
        const channel = await conn.createChannel();
        await channel.assertQueue(queue, {
            durable: true
        });
        channel.consume(queue, callback, {
            noAck: true
        });
    }
}
exports.RabbitMQServer = RabbitMQServer;
