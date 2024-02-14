"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionAmqp = void 0;
const RabbitMqServer_1 = require("./RabbitMqServer");
class ExecutionAmqp {
    static async publish(execution) {
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.publish('robots.executions-logs', JSON.stringify(execution));
    }
}
exports.ExecutionAmqp = ExecutionAmqp;
