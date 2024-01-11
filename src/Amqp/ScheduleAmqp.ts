import { DuplicatedTaskException } from "cronjob-to-task-scheduler";
import { CrontabScheduleManager } from "../CrontabScheduleManager";
import { WindowsScheduleManager } from "../WindowsScheduleManager";
import { Schedule } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";
import { platform } from "os";
import * as service from "../Services/resendSchedules";
import { Log } from "../Log";

class ScheduleAmqp {

    async consume() {

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

            if (schedule.action == 'create') return await this.create(schedule)
            if (schedule.action == 'delete') return await this.delete(schedule)
        })

    }

    private async create(schedule: Schedule) {
        try {
            await Log.write('info', `plataforma: ${platform()}`)
            if (platform() == 'linux') {
                const cronScheduleManager = new CrontabScheduleManager();
                await cronScheduleManager.create(schedule);
            }

            if (platform() == 'win32') {
                const windowsScheduleManager = new WindowsScheduleManager(schedule);
                windowsScheduleManager.create();
            }

            await Log.write('info', 'Linha 48 antes do publish', true);

        } catch (error: any) {
            if (error instanceof DuplicatedTaskException) return;
            await Log.write('error', `Erro ao criar cron: ${error?.message}`, true)
        }
    }

    private async delete(schedule: Schedule) {
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


    private async sleep(ms: number): Promise<void> {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }

    private async publishDlq(schedule: Schedule) {
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.schedules-dlq', JSON.stringify(schedule))
    }
}

export { ScheduleAmqp }