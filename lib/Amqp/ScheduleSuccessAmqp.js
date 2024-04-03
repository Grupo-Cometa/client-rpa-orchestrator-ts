"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSuccessAmqp = void 0;
const RabbitMqServer_1 = require("./RabbitMqServer");
class ScheduleSuccessAmqp {
    static async publish(schedule) {
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.publish('robots.schedules-success', JSON.stringify(schedule));
    }
}
exports.ScheduleSuccessAmqp = ScheduleSuccessAmqp;
