"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSuccessAmqp = void 0;
const Log_1 = require("../Log");
const RabbitMqServer_1 = require("./RabbitMqServer");
class ScheduleSuccessAmqp {
    static async publish(schedule) {
        await Log_1.Log.write('info', 'excultando publishScheduleSuccess', true);
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.publish('robots.schedules-success', JSON.stringify(schedule));
    }
}
exports.ScheduleSuccessAmqp = ScheduleSuccessAmqp;
