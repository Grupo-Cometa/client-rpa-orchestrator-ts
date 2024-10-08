"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqServerV2 = void 0;
const amqplib_1 = require("amqplib");
class RabbitMqServerV2 {
    url;
    connection = null;
    channel = null;
    reconnectInterval = 30000;
    constructor(url) {
        this.url = url;
    }
    async connect() {
        try {
            await this.disconnect();
            this.connection = await (0, amqplib_1.connect)(this.url);
            this.channel = await this.connection.createChannel();
            this.connection.on('close', () => this.reconnect());
            this.connection.on('error', () => this.reconnect());
            this.connection.on('blocked', () => this.reconnect());
        }
        catch (error) {
            console.log('Failed to connect to RabbitMQ:', error);
            this.reconnect();
        }
    }
    async disconnect() {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
        }
        catch (error) {
            console.log('Failed to disconnect from RabbitMQ:', error);
        }
    }
    async reconnect() {
        console.log('Reconnecting to RabbitMQ...');
        await this.disconnect();
        setTimeout(() => this.connect(), this.reconnectInterval);
    }
    async publish(queue, message, options) {
        try {
            await this.connect();
            await this.channel?.assertQueue(queue, options);
            this.channel?.sendToQueue(queue, Buffer.from(message));
        }
        catch (error) {
            console.log('Failed to publish message:', error);
        }
        finally {
            await this.disconnect();
        }
    }
    async consume(queue, callback, options) {
        try {
            await this.connect();
            await this.channel?.assertQueue(queue, options);
            await this.channel?.consume(queue, callback, { noAck: true });
        }
        catch (error) {
            console.log('Failed to consume messages:', error);
            this.reconnect();
            setTimeout(() => this.consume(queue, callback, options), this.reconnectInterval);
        }
    }
}
exports.RabbitMqServerV2 = RabbitMqServerV2;
