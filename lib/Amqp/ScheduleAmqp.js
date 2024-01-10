"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleAmqp = void 0;
const cronjob_to_task_scheduler_1 = require("cronjob-to-task-scheduler");
const CrontabScheduleManager_1 = require("../CrontabScheduleManager");
const WindowsScheduleManager_1 = require("../WindowsScheduleManager");
const RabbitMqServer_1 = require("./RabbitMqServer");
const os_1 = require("os");
const resendSchedules_1 = __importDefault(require("../Services/resendSchedules"));
const Log_1 = require("../Log");
class ScheduleAmqp {
    static async consume() {
        await Log_1.Log.write('info', `Consumer`, true);
        await (0, resendSchedules_1.default)();
        await this.sleep(2500);
        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await Log_1.Log.write('success', `start server.consumer`, true);
        await server.consume(queue, async (message) => {
            if (!message)
                return;
            const schedule = JSON.parse(message.content.toString());
            await Log_1.Log.write('success', `schedule event: ${schedule.scheduleId}`, true);
            if (schedule.action == 'create') {
                try {
                    if ((0, os_1.platform)() == 'linux') {
                        const cronScheduleManager = new CrontabScheduleManager_1.CrontabScheduleManager();
                        await cronScheduleManager.create(schedule);
                    }
                    if ((0, os_1.platform)() == 'win32') {
                        const windowsScheduleManager = new WindowsScheduleManager_1.WindowsScheduleManager(schedule);
                        windowsScheduleManager.create();
                    }
                    await this.publishScheduleSuccess(schedule);
                }
                catch (error) {
                    if (error instanceof cronjob_to_task_scheduler_1.DuplicatedTaskException)
                        return;
                    await Log_1.Log.write('error', `Erro ao criar cron: ${error?.message}`);
                }
            }
            if (schedule.action == 'delete') {
                try {
                    if ((0, os_1.platform)() == 'linux') {
                        const cronScheduleManager = new CrontabScheduleManager_1.CrontabScheduleManager();
                        await cronScheduleManager.delete(schedule);
                    }
                    if ((0, os_1.platform)() == 'win32') {
                        const windowsScheduleManager = new WindowsScheduleManager_1.WindowsScheduleManager(schedule);
                        windowsScheduleManager.delete();
                    }
                }
                catch (error) {
                    await this.publishDlq(schedule);
                }
            }
        });
    }
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async publishDlq(schedule) {
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.publish('robots.schedules-dlq', JSON.stringify(schedule));
    }
    static async publishScheduleSuccess(schedule) {
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.publish('robots.schedules-success', JSON.stringify(schedule));
    }
}
exports.ScheduleAmqp = ScheduleAmqp;
