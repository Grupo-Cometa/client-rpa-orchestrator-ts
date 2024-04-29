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
const os_1 = require("os");
const service = __importStar(require("../Services/resendSchedules"));
const Log_1 = require("../Log");
const ScheduleSuccessAmqp_1 = require("./ScheduleSuccessAmqp");
const RabbitMqServer_1 = require("./RabbitMqServer");
class ScheduleAmqp {
    async consume() {
        await this.sleep(60000);
        await service.resendSchedules();
        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMqServer_1.RabbitMQServer(process.env.AMQP_URL);
        await server.consume(queue, async (message) => {
            if (!message)
                return;
            const schedule = JSON.parse(message.content.toString());
            if (schedule.action == 'create')
                await this.create(schedule);
            if (schedule.action == 'delete')
                await this.delete(schedule);
            await ScheduleSuccessAmqp_1.ScheduleSuccessAmqp.publish(schedule);
        });
    }
    async create(schedule) {
        try {
            if ((0, os_1.platform)() == 'linux') {
                const cronScheduleManager = new CrontabScheduleManager_1.CrontabScheduleManager();
                await cronScheduleManager.create(schedule);
            }
            if ((0, os_1.platform)() == 'win32') {
                const windowsScheduleManager = new WindowsScheduleManager_1.WindowsScheduleManager(schedule);
                windowsScheduleManager.create();
            }
        }
        catch (error) {
            if (error instanceof cronjob_to_task_scheduler_1.DuplicatedTaskException)
                return;
            await Log_1.Log.write('error', `Erro ao criar agendamento: ${error?.message}`);
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
            await Log_1.Log.write('error', `Erro ao deletar agendamento: ${error?.message}`);
        }
    }
    async sleep(ms) {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.ScheduleAmqp = ScheduleAmqp;
