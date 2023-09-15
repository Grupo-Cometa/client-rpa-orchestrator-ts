"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const RabbitMqServer_1 = require("./Amqp/RabbitMqServer");
const WebSocketClient_1 = require("./WebSocket/WebSocketClient");
require("dotenv/config");
class Log {
    static async send(message, logType) {
        if (process.env.DEBUG == 'true')
            return;
        const publicId = process.env.PUBLIC_ID;
        if (!publicId)
            throw new Error('environment-variable-public-id-not-found');
        const logData = {
            type: 'log',
            message: message,
            log_type: logType,
            public_id: publicId
        };
        this.websocketSend(logData, publicId);
        await this.rabbitmqSend(logData);
    }
    static async rabbitmqSend(logData) {
        try {
            const message = JSON.stringify(logData);
            const queue = 'robots.executions-logs';
            const rabbitmqServer = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
            await rabbitmqServer.publish(queue, message);
            return;
        }
        catch (error) {
        }
    }
    static websocketSend(logData, publicId) {
        try {
            const socketStatus = new WebSocketClient_1.WebSocketClient(`status.${process.env.PUBLIC_ID}`);
            socketStatus.sendMessage(logData);
            return;
        }
        catch (error) {
        }
    }
}
exports.Log = Log;
