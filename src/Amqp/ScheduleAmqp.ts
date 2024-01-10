import { DuplicatedTaskException } from "cronjob-to-task-scheduler";
import { CrontabScheduleManager } from "../CrontabScheduleManager";
import { WindowsScheduleManager } from "../WindowsScheduleManager";
import { Schedule } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";
import { platform } from "os";
import * as service from "../Services/resendSchedules";
import { Log } from "../Log";
import { ScheduleSuccessAmqp } from "./ScheduleSuccessAmqp";

class ScheduleAmqp {

    static async consume() {

        await service.resendSchedules();

        await this.sleep(2500);

        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMQServer(process.env.AMQP_URL!);

        await Log.write('success', `start server.consumer`, true)
        await server.consume(queue, async (message) => {
            if (!message) {
                await Log.write('info', `Message: ${JSON.stringify(message || {})}`, true)
                return;
            }

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
                    await Log.write('info', 'Linha 40 antes do publish');
                    await ScheduleSuccessAmqp.publish(schedule);
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
}

export { ScheduleAmqp }