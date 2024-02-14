"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleAmqp = void 0;
const cronjob_to_task_scheduler_1 = require("cronjob-to-task-scheduler");
const CrontabScheduleManager_1 = require("../CrontabScheduleManager");
const WindowsScheduleManager_1 = require("../WindowsScheduleManager");
const RabbitMqServer_1 = require("./RabbitMqServer");
const os_1 = require("os");
const service = __importStar(require("../Services/resendSchedules"));
const Log_1 = require("../Log");
const ScheduleSuccessAmqp_1 = require("./ScheduleSuccessAmqp");
class ScheduleAmqp {
    async consume() {
        await this.sleep(60000);
        await service.resendSchedules();
        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await Log_1.Log.write('success', `start server.consumer`, true);
        await server.consume(queue, async (message) => {
            if (!message) {
                await Log_1.Log.write('info', `Message: ${JSON.stringify(message || {})}`, true);
                return;
            }
            const schedule = JSON.parse(message.content.toString());
            await Log_1.Log.write('success', `schedule event: ${schedule.scheduleId}`, true);
            if (schedule.action == 'create')
                return await this.create(schedule);
            if (schedule.action == 'delete')
                return await this.delete(schedule);
        });
    }
    async create(schedule) {
        try {
            await Log_1.Log.write('info', `plataforma: ${(0, os_1.platform)()}`);
            if ((0, os_1.platform)() == 'linux') {
                const cronScheduleManager = new CrontabScheduleManager_1.CrontabScheduleManager();
                await cronScheduleManager.create(schedule);
            }
            if ((0, os_1.platform)() == 'win32') {
                const windowsScheduleManager = new WindowsScheduleManager_1.WindowsScheduleManager(schedule);
                windowsScheduleManager.create();
            }
            await Log_1.Log.write('info', 'Linha 53 antes do publish', true);
            await ScheduleSuccessAmqp_1.ScheduleSuccessAmqp.publish(schedule);
        }
        catch (error) {
            if (error instanceof cronjob_to_task_scheduler_1.DuplicatedTaskException)
                return;
            await Log_1.Log.write('error', `Erro ao criar cron: ${error?.message}`, true);
        }
    }
    async delete(schedule) {
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
    async sleep(ms) {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }
    async publishDlq(schedule) {
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.publish('robots.schedules-dlq', JSON.stringify(schedule));
    }
}
exports.ScheduleAmqp = ScheduleAmqp;
