import { DuplicatedTaskException } from "cronjob-to-task-scheduler";
import { CrontabScheduleManager } from "../CrontabScheduleManager";
import { WindowsScheduleManager } from "../WindowsScheduleManager";
import { Schedule } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";
import { platform } from "os";
import * as service from "../Services/resendSchedules";
import { Log } from "../Log";

class ScheduleAmqp {

    static async consume() {
        await Log.write('info', `Consumer`, true)
        await service.resendSchedules();

        await this.sleep(2500);

        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMQServer(process.env.AMQP_URL!);

        await Log.write('success', `start server.consumer`, true)
        await server.consume(queue, async (message) => {
            if (!message) return;
            const schedule = JSON.parse(message.content.toString()) as Schedule;
            await Log.write('success', `schedule event: ${schedule.scheduleId}`, true)
            if (schedule.action == 'create') {
                try {
                    if (platform() == 'linux') {
                        const cronScheduleManager = new CrontabScheduleManager();
                        await cronScheduleManager.create(schedule);

                    }

                    if (platform() == 'win32') {
                        const windowsScheduleManager = new WindowsScheduleManager(schedule);
                        windowsScheduleManager.create();
                    }

                    await this.publishScheduleSuccess(schedule);
                } catch (error: any) {
                    if (error instanceof DuplicatedTaskException) return;
                    await Log.write('error', `Erro ao criar cron: ${error?.message}`)
                }
            }

            if (schedule.action == 'delete') {
                try {
                    if (platform() == 'linux') {
                        const cronScheduleManager = new CrontabScheduleManager();
                        await cronScheduleManager.delete(schedule);
                    }

                    if (platform() == 'win32') {
                        const windowsScheduleManager = new WindowsScheduleManager(schedule);
                        windowsScheduleManager.delete();
                    }
                } catch (error: unknown) {
                    await this.publishDlq(schedule);
                }
            }
        })
    }

    private static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async publishDlq(schedule: Schedule) {
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.schedules-dlq', JSON.stringify(schedule))
    }

    static async publishScheduleSuccess(schedule: Schedule) {
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.schedules-success', JSON.stringify(schedule))
    }
}

export { ScheduleAmqp }