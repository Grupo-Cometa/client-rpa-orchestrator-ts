"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowsScheduleManager = void 0;
const cronjob_to_task_scheduler_1 = require("cronjob-to-task-scheduler");
class WindowsScheduleManager {
    schedule;
    constructor(schedule) {
        this.schedule = schedule;
    }
    create() {
        const taskName = this.getScheduleName();
        const taskCommand = this.getScheduleCommand();
        cronjob_to_task_scheduler_1.CronToTaskSchedule.convert(taskName, this.schedule.cronExpression, taskCommand);
    }
    delete() {
        const taskName = this.getScheduleName();
        cronjob_to_task_scheduler_1.CronToTaskSchedule.deleteTask(taskName);
    }
    getScheduleName() {
        return `Orquestrador\\${this.schedule.robotPublicId}.${this.schedule.scheduleId}`;
    }
    getScheduleCommand() {
        return {
            command: `"${process.execPath}"`,
            arguments: `"${process.cwd()}\\dist\\bootstrap\\start.js" ${this.schedule.scheduleId}`,
            workingDirectory: process.cwd()
        };
    }
}
exports.WindowsScheduleManager = WindowsScheduleManager;
