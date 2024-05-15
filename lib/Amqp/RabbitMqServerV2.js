"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqServerV2 = void 0;
const amqplib_1 = require("amqplib");
class RabbitMqServerV2 {
    url;
    connection = null;
    channel = null;
    constructor(url) {
        this.url = url;
    }
    async connect() {
        await this.disconnect();
        this.connection = await (0, amqplib_1.connect)(this.url);
        this.channel = await this.connection.createChannel();
    }
    async disconnect() {
        try {
            await this.connection?.close();
        }
        catch (error) {
        }
    }
    async publish(queue, message, options) {
        try {
            await this.connect();
            await this.channel?.assertQueue(queue, options);
            this.channel?.sendToQueue(queue, Buffer.from(message));
            setTimeout(() => {
                this.disconnect();
            }, 500);
        }
        catch (error) {
        }
    }
    async consume(queue, callback, options) {
        const startConsuming = async () => {
            try {
                await this.connect();
                this.connection?.on('close', () => {
                    reconnect();
                });
                this.connection?.on('error', () => {
                    reconnect();
                });
                this.connection?.on('blocked', () => {
                    reconnect();
                });
                await this.channel?.assertQueue(queue, options);
                await this.channel?.consume(queue, callback, { noAck: true });
            }
            catch (error) {
                reconnect();
            }
        };
        const reconnect = () => {
            setTimeout(() => {
                startConsuming();
            }, 30000);
        };
        await startConsuming();
    }
}
exports.RabbitMqServerV2 = RabbitMqServerV2;
