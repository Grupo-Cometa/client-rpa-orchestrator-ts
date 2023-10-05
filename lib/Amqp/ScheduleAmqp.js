"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleAmqp = void 0;
const CronScheduleManager_1 = require("../CronScheduleManager");
const RabbitMqServer_1 = require("./RabbitMqServer");
class ScheduleAmqp {
    static async consume() {
        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.consume(queue, (message) => {
            if (!message)
                return;
            const schedule = JSON.parse(message.content.toString());
            const cronScheduleManager = new CronScheduleManager_1.CronScheduleManager();
            if (schedule.action == 'create') {
                try {
                    cronScheduleManager.create(schedule);
                }
                catch (error) {
                    this.publishDlq(schedule);
                }
            }
            if (schedule.action == 'delete')
                cronScheduleManager.delete(schedule);
        });
    }
    static async publishDlq(schedule) {
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.publish('robots.schedules-dlq', JSON.stringify(schedule));
    }
}
exports.ScheduleAmqp = ScheduleAmqp;
