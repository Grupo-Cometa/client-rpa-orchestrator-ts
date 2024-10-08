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
            await this.disconnect();
            this.conn = await (0, amqplib_1.connect)(this.uri);
            this.channel = await this.conn.createChannel();
        }
        catch (error) {
            if (error instanceof Error) {
            }
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
                durable: true,
                autoDelete: false
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
    async consume(queue, callback) {
        try {
            const processMessage = (message) => {
                if (message) {
                    callback(message);
                }
            };
            const startConsuming = async () => {
                try {
                    await this.connect();
                    this.conn?.on('error', () => {
                        reconnect();
                    });
                    this.conn?.on('close', () => {
                        reconnect();
                    });
                    this.conn?.on('blocked', () => {
                        reconnect();
                    });
                    await this.channel?.assertQueue(queue, {
                        durable: true,
                        autoDelete: false,
                    });
                    await this.channel?.consume(queue, processMessage, {
                        noAck: true,
                    });
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
        catch (error) {
        }
    }
}
exports.RabbitMQServer = RabbitMQServer;
