import { CronToTaskSchedule } from "cronjob-to-task-scheduler";
import { Schedule } from "./types";

class WindowsScheduleManager {

    constructor(private schedule: Schedule) { }

    public create(): void {
        const taskName = this.getScheduleName();
        const taskCommand = this.getScheduleCommand();
        CronToTaskSchedule.convert(taskName, this.schedule.cronExpression, taskCommand);
    }

    public delete(): void {
        const taskName = this.getScheduleName();
        CronToTaskSchedule.deleteTask(taskName);
    }

    private getScheduleName(): string {
        return `Orquestrador\\${this.schedule.robotPublicId}.${this.schedule.scheduleId}`;
    }

    private getScheduleCommand(): { command: string, arguments: string, workingDirectory: string } {
        return {
            command: `"${process.execPath}"`,
            arguments: `"${process.cwd()}\\dist\\bootstrap\\start.js" ${this.schedule.scheduleId}`,
            workingDirectory: process.cwd()
        }
    }
}

export { WindowsScheduleManager }