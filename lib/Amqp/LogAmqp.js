"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogAmqp = void 0;
const RabbitMqServer_1 = require("./RabbitMqServer");
class LogAmqp {
    static async publish(log) {
        try {
            const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
            await server.publish('robots.executions-logs', JSON.stringify(log));
        }
        catch (error) {
        }
    }
}
exports.LogAmqp = LogAmqp;
